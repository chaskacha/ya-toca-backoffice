// app/api/murals/analyze/route.ts
import { query } from "@/lib/db";
import { openai_completions } from "@/constants/openai";

function getMultiInt(sp: URLSearchParams, key: string) {
    return sp.getAll(key).filter((x) => /^\d+$/.test(x)).map(Number);
}

type RowPhrase = {
    id: number;
    created_at: string;
    phrase: string;
    question: string | null;

    region_id: number | null;
    region_name: string | null;

    event_id: number | null;
    event_name: string | null;

    activity_id: number | null;
    activity_name: string | null;
};

function cleanText(s: any, max = 900) {
    const t = String(s ?? "").trim();
    if (!t) return "";
    return t.length > max ? t.slice(0, max) : t;
}

export const GET = async (req: Request) => {
    try {
        const sp = new URL(req.url).searchParams;

        const regionIds = getMultiInt(sp, "regionId");
        const eventIds = getMultiInt(sp, "eventId");
        const activityIds = getMultiInt(sp, "activityId");

        /**
         * ✅ Schema reality:
         * mural_phrases.ph.id_activity -> activities.id
         * activities.id_event -> events.id
         * events.id_region (or idregion) -> regiones.id
         *
         * So region/event come THROUGH activities, not from mural_phrases.
         */
        const sql = `
      SELECT
        ph.id,
        ph.created_at,
        COALESCE(NULLIF(btrim(ph.clean_text), ''), btrim(ph.raw_text)) AS phrase,
        NULLIF(btrim(ph.question), '') AS question,

        r.id AS region_id,
        r.nombreregion AS region_name,

        e.id AS event_id,
        e.name AS event_name,

        a.id AS activity_id,
        a.name_event AS activity_name

      FROM mural_phrases ph
      JOIN activities a ON a.id = ph.id_activity
      LEFT JOIN events e ON e.id = a.id_event
      LEFT JOIN regiones r ON r.id = COALESCE(e.id_region)

      WHERE
        (ph.clean_text IS NOT NULL OR ph.raw_text IS NOT NULL)
        AND btrim(COALESCE(ph.clean_text, ph.raw_text)) <> ''

        -- filters
        AND ($1::int[] IS NULL OR array_length($1::int[], 1) IS NULL OR r.id = ANY($1::int[]))
        AND ($2::int[] IS NULL OR array_length($2::int[], 1) IS NULL OR e.id = ANY($2::int[]))
        AND ($3::int[] IS NULL OR array_length($3::int[], 1) IS NULL OR a.id = ANY($3::int[]))

      ORDER BY ph.created_at DESC
      LIMIT 1800
    `;

        const res = await query(sql, [
            regionIds.length ? regionIds : null,
            eventIds.length ? eventIds : null,
            activityIds.length ? activityIds : null,
        ]);

        const rows = (res.rows ?? []) as RowPhrase[];

        if (!rows.length) {
            return new Response(
                JSON.stringify({
                    error: "No hay suficientes frases para analizar con los filtros seleccionados.",
                    count: 0,
                    filters: { regionIds, eventIds, activityIds },
                }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Decide grouping priority (pick the first dimension that has >1 distinct value)
        const distinctRegions = Array.from(new Set(rows.map((r) => String(r.region_id ?? "")))).filter(Boolean);
        const distinctEvents = Array.from(new Set(rows.map((r) => String(r.event_id ?? "")))).filter(Boolean);
        const distinctActivities = Array.from(new Set(rows.map((r) => String(r.activity_id ?? "")))).filter(Boolean);

        type GroupMode = "region" | "event" | "activity" | "global";
        let groupMode: GroupMode = "global";
        if (distinctRegions.length > 1) groupMode = "region";
        else if (distinctEvents.length > 1) groupMode = "event";
        else if (distinctActivities.length > 1) groupMode = "activity";

        const MAX_GROUPS = 8;
        const MAX_SAMPLES_PER_GROUP = 22;

        const groupsMap = new Map<string, RowPhrase[]>();
        for (const r of rows) {
            let key = "global";
            if (groupMode === "region") key = `region:${r.region_id ?? 0}`;
            if (groupMode === "event") key = `event:${r.event_id ?? 0}`;
            if (groupMode === "activity") key = `activity:${r.activity_id ?? 0}`;
            groupsMap.set(key, [...(groupsMap.get(key) ?? []), r]);
        }

        const groupsSorted = Array.from(groupsMap.entries())
            .map(([key, list]) => ({ key, list }))
            .sort((a, b) => b.list.length - a.list.length)
            .slice(0, MAX_GROUPS);

        const representative = groupsSorted.map(({ key, list }) => {
            const first = list[0];
            let label = "Global";
            if (groupMode === "region") label = first.region_name ?? `Región ${first.region_id ?? ""}`;
            if (groupMode === "event") label = first.event_name ?? `Evento ${first.event_id ?? ""}`;
            if (groupMode === "activity") label = first.activity_name ?? `Actividad ${first.activity_id ?? ""}`;

            const samples = list.slice(0, MAX_SAMPLES_PER_GROUP).map((x) => ({
                id: x.id,
                created_at: x.created_at,
                region: x.region_name ?? "",
                event: x.event_name ?? "",
                activity: x.activity_name ?? "",
                question: x.question ?? "",
                phrase: cleanText(x.phrase, 900),
            }));

            return { key, label, count: list.length, samples };
        });

        const system = `
Eres un analista de respuestas breves (murales). Responde en español.

IMPORTANTE:
- Existe UNA SOLA población (un solo grupo definido por filtros).
- NO hagas comparaciones A/B.
- Analiza SOLO con la evidencia proporcionada.
- No inventes datos.

Reglas de salida:
- Devuelve SOLO JSON válido.
- En "evidence" usa SOLO citas textuales breves (<= 200 caracteres) tomadas de samples.phrase.
- Si hay poca evidencia, indícalo en "limitations".
`;

        const user = {
            filters: { regionIds, eventIds, activityIds },
            grouping: groupMode,
            representative_samples_by_group: representative,
            output_schema: {
                population_summary: "string",
                groups: [
                    {
                        label: "string",
                        count: "number",
                        dominant_themes: ["string"],
                        emotions: ["string"],
                        narratives: ["string"],
                        actionable_opportunities: ["string"],
                        evidence: ["short quotes <= 200 chars"],
                    },
                ],
                limitations: ["string"],
            },
        };

        const completion = await openai_completions(
            "gpt-4.1-mini",
            [
                { role: "system", content: system },
                { role: "user", content: JSON.stringify(user) },
            ],
            { type: "json_object" }
        );

        const content = completion.choices?.[0]?.message?.content ?? "{}";
        const parsed = JSON.parse(content);

        return new Response(
            JSON.stringify({
                count: rows.length,
                grouping: groupMode,
                result: parsed,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 });
    }
};