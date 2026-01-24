// src/app/api/radio/compare/route.ts
import { query } from "@/lib/db";
import { openai_completions } from "@/constants/openai";

function getMultiInt(sp: URLSearchParams, key: string) {
    return sp
        .getAll(key)
        .flatMap((x) => String(x).split(",")) // allow a=1,2
        .map((x) => x.trim())
        .filter((x) => /^\d+$/.test(x))
        .map(Number);
}

function pickLabel(dimension: string, id: number, maps: { topics: Map<number, string>; programs: Map<number, string> }) {
    if (dimension === "topicId") return maps.topics.get(id) ?? `Topic ${id}`;
    return maps.programs.get(id) ?? `Program ${id}`;
}

export const GET = async (req: Request) => {
    try {
        const sp = new URL(req.url).searchParams;

        const dimension = String(sp.get("dimension") || "").trim(); // "topicId" | "programId"
        if (dimension !== "topicId" && dimension !== "programId") {
            return new Response(JSON.stringify({ error: 'dimension must be "topicId" or "programId"' }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const aIds = getMultiInt(sp, "a");
        const bIds = getMultiInt(sp, "b");

        if (!aIds.length || !bIds.length) {
            return new Response(JSON.stringify({ error: "Selecciona al menos 1 valor para A y B." }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // 1) Fetch episodes for cohort A / B (must be done + have transcript)
        // NOTE: we compare by transcript_text; embeddings are not required for this v1.
        const whereCol = dimension === "topicId" ? "e.topic_id" : "e.program_id";

        const baseSql = `
      SELECT
        e.id AS episode_id,
        e.program_id,
        p.name_program,
        e.topic_id,
        t.topic_name,
        e.mp3_url,
        COALESCE(NULLIF(btrim(e.transcript_text), ''), '') AS transcript_text
      FROM radio_episodes e
      JOIN radio_programs p ON p.id = e.program_id
      LEFT JOIN radio_topics t ON t.id = e.topic_id
      WHERE e.status = 'done'
        AND e.transcript_text IS NOT NULL
        AND btrim(e.transcript_text) <> ''
        AND ${whereCol} = ANY($1::int[])
      ORDER BY e.id DESC
      LIMIT 200
    `;

        const [resA, resB] = await Promise.all([
            query(baseSql, [aIds]),
            query(baseSql, [bIds]),
        ]);

        if (!resA.rows.length || !resB.rows.length) {
            return new Response(
                JSON.stringify({
                    error:
                        "No hay suficientes episodios con transcript (status=done) para comparar. Procesa más audios primero.",
                }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // 2) Name maps (to render nicer labels)
        const [topicsRes, programsRes] = await Promise.all([
            query(`SELECT id, topic_name FROM radio_topics ORDER BY id ASC`),
            query(`SELECT id, name_program FROM radio_programs ORDER BY id ASC`),
        ]);

        const topics = new Map<number, string>((topicsRes.rows ?? []).map((r: any) => [Number(r.id), String(r.topic_name)]));
        const programs = new Map<number, string>((programsRes.rows ?? []).map((r: any) => [Number(r.id), String(r.name_program)]));

        // 3) Build LLM prompt
        const system = `
Eres un analista. Estás comparando TRANSCRIPCIONES de radio (audio -> texto).
Tu tarea: comparar Cohorte A vs Cohorte B y resumir diferencias.

IMPORTANTE:
- Devuelve SOLO JSON estricto (sin markdown, sin texto extra).
- No inventes datos. Si falta evidencia, dilo como limitación.
- Si te preguntan "por qué", formula hipótesis con cautela.
- Escribe en español.
- Usa bullets cortos (6–18 palabras).
- Evidencia: usa frases textuales cortas (<=200 caracteres) tomadas de los ejemplos provistos.
`;

        const cohortA_label = `${dimension} A: ${aIds.map((id) => pickLabel(dimension, id, { topics, programs })).join(", ")}`;
        const cohortB_label = `${dimension} B: ${bIds.map((id) => pickLabel(dimension, id, { topics, programs })).join(", ")}`;

        const userPayload = {
            dimension,
            cohortA_label,
            cohortB_label,
            cohortA_ids: aIds,
            cohortB_ids: bIds,
            cohortA_examples: resA.rows.slice(0, 18).map((r: any) => ({
                episode_id: r.episode_id,
                program: r.name_program,
                topic: r.topic_name ?? null,
                snippet: String(r.transcript_text).slice(0, 800),
            })),
            cohortB_examples: resB.rows.slice(0, 18).map((r: any) => ({
                episode_id: r.episode_id,
                program: r.name_program,
                topic: r.topic_name ?? null,
                snippet: String(r.transcript_text).slice(0, 800),
            })),
            output_schema: {
                summary: "string",
                per_dimension: [
                    {
                        id: "number",
                        name: "string",
                        cohortA_tendencies: ["string"],
                        cohortB_tendencies: ["string"],
                        key_differences: ["string"],
                        possible_reasons_hypotheses: ["string"],
                        evidence: {
                            cohortA_examples: ["string"],
                            cohortB_examples: ["string"],
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
                { role: "user", content: JSON.stringify(userPayload) },
            ],
            { type: "json_object" }
        );

        const parsed = JSON.parse(completion.choices?.[0]?.message?.content ?? "{}");

        // 4) Normalize to your UI shape (like murals)
        const per = (parsed?.per_dimension ?? []).map((x: any) => ({
            id: Number(x.id ?? 0),
            name: String(x.name ?? ""),
            cohortA_tendencies: Array.isArray(x.cohortA_tendencies) ? x.cohortA_tendencies : [],
            cohortB_tendencies: Array.isArray(x.cohortB_tendencies) ? x.cohortB_tendencies : [],
            key_differences: Array.isArray(x.key_differences) ? x.key_differences : [],
            possible_reasons_hypotheses: Array.isArray(x.possible_reasons_hypotheses) ? x.possible_reasons_hypotheses : [],
            evidence: {
                cohortA_examples: Array.isArray(x?.evidence?.cohortA_examples) ? x.evidence.cohortA_examples : [],
                cohortB_examples: Array.isArray(x?.evidence?.cohortB_examples) ? x.evidence.cohortB_examples : [],
            },
        }));

        // If model didn't return per list, fallback to a single row comparing A vs B
        const fallback =
            per.length > 0
                ? per
                : [
                    {
                        id: 0,
                        name: dimension,
                        cohortA_tendencies: [],
                        cohortB_tendencies: [],
                        key_differences: [],
                        possible_reasons_hypotheses: [],
                        evidence: { cohortA_examples: [], cohortB_examples: [] },
                    },
                ];

        const result = {
            summary: String(parsed?.summary ?? ""),
            // keep same naming convention as murals: per_event / per_region etc.
            // for radio we’ll return per_topic or per_program depending on dimension
            ...(dimension === "topicId" ? { per_topic: fallback } : { per_program: fallback }),
            limitations: Array.isArray(parsed?.limitations) ? parsed.limitations : [],
            methodology_sources: [
                { title: "OpenAI (LLM) – análisis y síntesis", url: "https://platform.openai.com/" },
            ],
        };

        return new Response(JSON.stringify({ result }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "Error interno" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};
