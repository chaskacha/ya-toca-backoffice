// app/api/darkroom/compare/route.ts
import { query } from "@/lib/db";
import { openai_completions } from "@/constants/openai";

type Dimension = "age_group" | "gender";

function getMulti(sp: URLSearchParams, key: string) {
    return sp.getAll(key).map((s) => s.trim()).filter(Boolean);
}

function isAllowedDimension(x: string): x is Dimension {
    return x === "age_group" || x === "gender";
}

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/**
 * Reduce tokens: pick top diffs per question (still enough for analysis).
 * Keeps the full "questions" payload for your table, but sends a compact
 * "analysis_basis" to the LLM.
 */
function buildAnalysisBasis(questions: any[], maxOptionsPerQuestion = 5) {
    return questions.map((q) => {
        const opts = Array.isArray(q.options) ? q.options : [];
        const ranked = [...opts]
            .map((o) => ({
                optionText: String(o.optionText ?? ""),
                aPct: clamp01(Number(o.aPct ?? 0)),
                bPct: clamp01(Number(o.bPct ?? 0)),
                diffPct: Number(o.diffPct ?? 0),
            }))
            .sort((x, y) => Math.abs(y.diffPct) - Math.abs(x.diffPct))
            .slice(0, maxOptionsPerQuestion);

        return {
            questionId: Number(q.questionId),
            questionText: String(q.questionText ?? ""),
            topDifferences: ranked,
        };
    });
}

export const GET = async (req: Request) => {
    try {
        const { searchParams } = new URL(req.url);

        const dimRaw = String(searchParams.get("dimension") ?? "");
        if (!isAllowedDimension(dimRaw)) {
            return new Response(JSON.stringify({ error: "Invalid dimension" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const aValues = getMulti(searchParams, "a");
        const bValues = getMulti(searchParams, "b");

        if (!aValues.length || !bValues.length) {
            return new Response(JSON.stringify({ error: "Missing a/b values" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Optional switch to disable AI when needed (cost / speed)
        // Default = ON
        const aiParam = String(searchParams.get("ai") ?? "1").trim();
        const aiEnabled = aiParam !== "0" && aiParam.toLowerCase() !== "false";

        // CTE: cuenta por pregunta/opción para cada cohorte
        const sql = `
      WITH
      cohort_a AS (
        SELECT question_id, option_id, COUNT(*)::int AS cnt
        FROM dark_room_responses
        WHERE ${dimRaw} = ANY($1::text[])
        GROUP BY question_id, option_id
      ),
      cohort_b AS (
        SELECT question_id, option_id, COUNT(*)::int AS cnt
        FROM dark_room_responses
        WHERE ${dimRaw} = ANY($2::text[])
        GROUP BY question_id, option_id
      ),
      totals_a AS (
        SELECT question_id, SUM(cnt)::int AS total
        FROM cohort_a
        GROUP BY question_id
      ),
      totals_b AS (
        SELECT question_id, SUM(cnt)::int AS total
        FROM cohort_b
        GROUP BY question_id
      )
      SELECT
        q.id AS question_id,
        q.question_text AS question_text,
        o.id AS option_id,
        o.option_text AS option_text,

        COALESCE(a.cnt, 0)::int AS a_count,
        COALESCE(ta.total, 0)::int AS a_total,

        COALESCE(b.cnt, 0)::int AS b_count,
        COALESCE(tb.total, 0)::int AS b_total

      FROM dark_room_questions q
      JOIN dark_room_options o ON o.question_id = q.id
      LEFT JOIN cohort_a a ON a.question_id = q.id AND a.option_id = o.id
      LEFT JOIN cohort_b b ON b.question_id = q.id AND b.option_id = o.id
      LEFT JOIN totals_a ta ON ta.question_id = q.id
      LEFT JOIN totals_b tb ON tb.question_id = q.id

      ORDER BY q.id ASC, o.id ASC
    `;

        const res = await query(sql, [aValues, bValues]);

        // Shape: agrupar por pregunta para el frontend
        const byQ = new Map<number, any>();

        for (const r of res.rows as any[]) {
            const qid = Number(r.question_id);

            if (!byQ.has(qid)) {
                byQ.set(qid, {
                    questionId: qid,
                    questionText: String(r.question_text),
                    cohortA: { total: Number(r.a_total), options: [] as any[] },
                    cohortB: { total: Number(r.b_total), options: [] as any[] },
                    options: [] as any[],
                });
            }

            const obj = byQ.get(qid);

            const aTotal = Number(r.a_total);
            const bTotal = Number(r.b_total);
            const aCount = Number(r.a_count);
            const bCount = Number(r.b_count);

            const aPct = aTotal > 0 ? aCount / aTotal : 0;
            const bPct = bTotal > 0 ? bCount / bTotal : 0;

            const opt = {
                optionId: Number(r.option_id),
                optionText: String(r.option_text),
                aCount,
                bCount,
                aPct,
                bPct,
                diffPct: aPct - bPct, // positivo => más en A
            };

            obj.cohortA.options.push({ optionId: opt.optionId, optionText: opt.optionText, count: aCount, pct: aPct });
            obj.cohortB.options.push({ optionId: opt.optionId, optionText: opt.optionText, count: bCount, pct: bPct });
            obj.options.push(opt);
        }

        const questions = Array.from(byQ.values());

        // --- AI ANALYSIS (stats -> text) ---
        let ai_analysis: any = null;
        let ai_error: string | null = null;

        if (aiEnabled) {
            try {
                const analysis_basis = buildAnalysisBasis(questions, 5);

                const system = `
Eres un analista de encuestas. Responde en español.
Vas a comparar dos cohortes usando SOLO datos agregados (porcentajes por opción).

Reglas:
- No inventes datos.
- No atribuyas causas psicológicas. Si propones razones, deben ser hipótesis y explícitas.
- No generalices a toda la población. Habla solo de diferencias observadas en estos datos.
- Si el total de alguna cohorte en una pregunta es 0, dilo como limitación.
- Devuelve SOLO JSON ESTRICTO (sin markdown, sin texto extra).
`;

                const user = {
                    dimension: dimRaw,
                    cohortA_values: aValues,
                    cohortB_values: bValues,
                    analysis_basis, // compact to reduce tokens
                    output_schema: {
                        summary: "string",
                        per_question: [
                            {
                                questionId: "number",
                                questionText: "string",
                                main_differences: ["string"],
                                notable_similarities: ["string"],
                                hypotheses: ["string"],
                                caution_notes: ["string"],
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
                ai_analysis = JSON.parse(content);

                // helpful sources (same style as your cabildos endpoint)
                ai_analysis.methodology_sources = [
                    { title: "Survey analysis basics (difference in proportions)", url: "https://en.wikipedia.org/wiki/Two-proportion_z-test" },
                    { title: "Avoiding ecological fallacy (interpreting aggregates)", url: "https://en.wikipedia.org/wiki/Ecological_fallacy" },
                ];
            } catch (e: any) {
                console.error("AI analysis error:", e);
                ai_error = "AI analysis failed";
            }
        }

        return new Response(
            JSON.stringify({
                dimension: dimRaw,
                cohortA: { values: aValues },
                cohortB: { values: bValues },
                questions,              // full stats for your table
                ai_analysis,            // <-- what your chat UI should render
                ai_error,               // if any
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};
