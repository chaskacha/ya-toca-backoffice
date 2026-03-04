// app/api/murals/compare/route.ts
import { query } from "@/lib/db";
import { openai_completions } from "@/constants/openai";

function getMultiInt(sp: URLSearchParams, key: string) {
    return sp.getAll(key).filter((x) => /^\d+$/.test(x)).map(Number);
}

function normQ(x: any) {
    const s = String(x ?? "").trim();
    return s.length ? s : null;
}

type Dimension = "eventId" | "regionId" | "activityId";

type RowPhrase = {
    idphrase: number;
    phrase: string;
    question: string | null;

    event_id: number | null;
    event_name: string | null;

    region_id: number | null;
    region_name: string | null;

    activity_id: number | null;
    activity_name: string | null;
};

function pickBestCommonQuestion(a: RowPhrase[], b: RowPhrase[]) {
    const count = (rows: RowPhrase[]) => {
        const m = new Map<string, number>();
        for (const r of rows) {
            const q = normQ(r.question);
            if (!q) continue;
            m.set(q, (m.get(q) ?? 0) + 1);
        }
        return m;
    };

    const aMap = count(a);
    const bMap = count(b);

    let best: { q: string; score: number; aCount: number; bCount: number } | null = null;

    for (const [q, aCount] of aMap.entries()) {
        const bCount = bMap.get(q) ?? 0;
        if (!bCount) continue;
        const score = Math.min(aCount, bCount); // overlap score
        if (!best || score > best.score) best = { q, score, aCount, bCount };
    }

    const stats = Array.from(new Set([...aMap.keys(), ...bMap.keys()]))
        .map((q) => ({
            question: q,
            aCount: aMap.get(q) ?? 0,
            bCount: bMap.get(q) ?? 0,
            overlap: Math.min(aMap.get(q) ?? 0, bMap.get(q) ?? 0),
        }))
        .sort((x, y) => y.overlap - x.overlap);

    return {
        bestQuestion: best?.q ?? null,
        stats,
    };
}

export const GET = async (req: Request) => {
    try {
        const sp = new URL(req.url).searchParams;

        const dimension = (sp.get("dimension") || "eventId") as Dimension;
        const aIds = getMultiInt(sp, "a");
        const bIds = getMultiInt(sp, "b");

        // optional: force a specific question
        const questionOverride = normQ(sp.get("question"));

        if (!aIds.length || !bIds.length) {
            return new Response(JSON.stringify({ error: "Selecciona al menos 1 valor para A y B." }), { status: 400 });
        }

        const filterColumn =
            dimension === "regionId" ? "r.id" : dimension === "activityId" ? "a.id" : "e.id";

        const dimLabel =
            dimension === "regionId" ? "Región" : dimension === "activityId" ? "Actividad" : "Evento";

        const baseSql = `
      SELECT
        ph.id AS idphrase,
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
      LEFT JOIN regiones r ON r.id = e.id_region

      WHERE
        (ph.clean_text IS NOT NULL OR ph.raw_text IS NOT NULL)
        AND btrim(COALESCE(ph.clean_text, ph.raw_text)) <> ''
    `;

        const [resA, resB] = await Promise.all([
            query(`${baseSql} AND ${filterColumn} = ANY($1::int[]) LIMIT 2200`, [aIds]),
            query(`${baseSql} AND ${filterColumn} = ANY($1::int[]) LIMIT 2200`, [bIds]),
        ]);

        const rowsA = (resA.rows ?? []) as RowPhrase[];
        const rowsB = (resB.rows ?? []) as RowPhrase[];

        if (!rowsA.length || !rowsB.length) {
            return new Response(JSON.stringify({ error: "No hay suficientes frases para comparar." }), { status: 400 });
        }

        // ✅ choose common question
        const { bestQuestion, stats } = pickBestCommonQuestion(rowsA, rowsB);
        const selectedQuestion = questionOverride ?? bestQuestion;

        if (!selectedQuestion) {
            return new Response(
                JSON.stringify({
                    error:
                        "No existe una pregunta en común entre A y B para comparar. " +
                        "Selecciona otra combinación o pasa ?question=... (una pregunta que exista en ambos).",
                    dimension,
                    questionStats: stats.slice(0, 25),
                }),
                { status: 400 }
            );
        }

        // ✅ scope both cohorts to same question
        const scopedA = rowsA.filter((r) => normQ(r.question) === selectedQuestion);
        const scopedB = rowsB.filter((r) => normQ(r.question) === selectedQuestion);

        if (scopedA.length < 10 || scopedB.length < 10) {
            return new Response(
                JSON.stringify({
                    error:
                        "Hay pocas frases bajo la misma pregunta para comparar (mínimo 10 por cohorte). " +
                        "Tip: prueba otra selección o pasa ?question=... con mejor overlap.",
                    dimension,
                    selectedQuestion,
                    basis: { cohortA_total_scoped: scopedA.length, cohortB_total_scoped: scopedB.length },
                    questionStats: stats.slice(0, 25),
                }),
                { status: 400 }
            );
        }

        const system = `
Eres un analista de contenido. Estás comparando FRASES CORTAS extraídas de murales.

Contexto: estas frases responden a la pregunta:
"${selectedQuestion}"

Comparación: Cohorte A vs Cohorte B (por ${dimLabel}).
IMPORTANTE:
- Devuelve SOLO JSON estricto (sin markdown, sin texto extra).
- No inventes información ni causalidades como hechos.
- Si explicas "por qué", formula hipótesis ("podría deberse a...").
- Evita generalizaciones fuertes: NO es una encuesta estadística.
- En evidence, usa citas textuales cortas (<= 200 caracteres) tomadas de los ejemplos provistos.
`;

        const user = {
            dimension,
            selectedQuestion,
            cohortA_ids: aIds,
            cohortB_ids: bIds,
            cohortA_phrases: scopedA.slice(0, 70),
            cohortB_phrases: scopedB.slice(0, 70),
            output_schema: {
                summary: "string",
                question: "string",
                per_group: [
                    {
                        group_label: "string (usually Global)",
                        cohortA_themes: ["string"],
                        cohortB_themes: ["string"],
                        differences: ["string"],
                        evidence: {
                            cohortA_examples: ["short quotes"],
                            cohortB_examples: ["short quotes"],
                        },
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

        const parsed = JSON.parse(completion.choices?.[0]?.message?.content ?? "{}");

        return new Response(
            JSON.stringify({
                dimension,
                selectedQuestion,
                questionStats: stats.slice(0, 25),
                basis: {
                    cohortA_total_scoped: scopedA.length,
                    cohortB_total_scoped: scopedB.length,
                },
                result: parsed,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "Error interno" }), { status: 500 });
    }
};