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

type RowPhrase = {
    idphrase: number;
    phrase: string;
    question: string | null;
    event_id: number;
    name_event: string;
    event_date: string | null;
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

    return {
        bestQuestion: best?.q ?? null,
        stats: Array.from(new Set([...aMap.keys(), ...bMap.keys()]))
            .map((q) => ({
                question: q,
                aCount: aMap.get(q) ?? 0,
                bCount: bMap.get(q) ?? 0,
                overlap: Math.min(aMap.get(q) ?? 0, bMap.get(q) ?? 0),
            }))
            .sort((x, y) => y.overlap - x.overlap),
    };
}

export const GET = async (req: Request) => {
    try {
        const sp = new URL(req.url).searchParams;

        const aEventIds = getMultiInt(sp, "a");
        const bEventIds = getMultiInt(sp, "b");

        // optional override:
        // /api/murals/compare?...&question=¿Qué%20nos%20toca...?
        const questionOverride = normQ(sp.get("question"));

        if (!aEventIds.length || !bEventIds.length) {
            return new Response(JSON.stringify({ error: "Selecciona al menos 1 evento para A y B." }), { status: 400 });
        }

        const baseSql = `
      SELECT
        ph.id AS idphrase,
        COALESCE(NULLIF(btrim(ph.clean_text), ''), btrim(ph.raw_text)) AS phrase,
        NULLIF(btrim(ph.question), '') AS question,
        a.id AS event_id,
        a.name_event,
        a.date_event::text AS event_date
      FROM mural_phrases ph
      JOIN activities a ON a.id = ph.event_id
      WHERE ph.raw_text IS NOT NULL
    `;

        const [resA, resB] = await Promise.all([
            query(`${baseSql} AND a.id = ANY($1::int[]) LIMIT 2000`, [aEventIds]),
            query(`${baseSql} AND a.id = ANY($1::int[]) LIMIT 2000`, [bEventIds]),
        ]);

        const rowsA = (resA.rows ?? []) as RowPhrase[];
        const rowsB = (resB.rows ?? []) as RowPhrase[];

        if (!rowsA.length || !rowsB.length) {
            return new Response(JSON.stringify({ error: "No hay suficientes frases para comparar." }), { status: 400 });
        }

        // ✅ choose question scope
        const { bestQuestion, stats } = pickBestCommonQuestion(rowsA, rowsB);
        const selectedQuestion = questionOverride ?? bestQuestion;

        // If we found a question, filter by it.
        // If not, we compare "general opinion" (question NULL) only.
        let scopedA = rowsA;
        let scopedB = rowsB;

        if (selectedQuestion) {
            scopedA = rowsA.filter((r) => normQ(r.question) === selectedQuestion);
            scopedB = rowsB.filter((r) => normQ(r.question) === selectedQuestion);
        } else {
            // no common question: focus on general (NULL question)
            scopedA = rowsA.filter((r) => !normQ(r.question));
            scopedB = rowsB.filter((r) => !normQ(r.question));
        }

        if (scopedA.length < 10 || scopedB.length < 10) {
            return new Response(
                JSON.stringify({
                    error:
                        "No hay suficientes frases bajo la misma pregunta para comparar. " +
                        "Tip: pasa ?question=... o carga más frases con la misma pregunta.",
                    selectedQuestion,
                    questionStats: stats.slice(0, 10),
                }),
                { status: 400 }
            );
        }

        const allPhraseIds = [...scopedA, ...scopedB].map((r) => r.idphrase);

        const embRes = await query(
            `
      SELECT idphrase, embedding
      FROM mural_phrase_embeddings
      WHERE idphrase = ANY($1::int[])
      `,
            [allPhraseIds]
        );

        if (!embRes.rows.length) {
            return new Response(JSON.stringify({ error: "No hay embeddings disponibles." }), { status: 409 });
        }

        // dynamic prompt includes selected question
        const questionLine = selectedQuestion
            ? `Contexto: estas frases responden a la pregunta:\n"${selectedQuestion}".`
            : `Contexto: estas frases son opiniones generales (sin pregunta explícita).`;

        const system = `
        Eres un analista de opinión pública. Estás comparando FRASES CORTAS extraídas de murales.
        ${questionLine}

        Tu tarea: comparar dos cohortes (Evento A vs Evento B) y sintetizar tendencias.
        IMPORTANTE:
        - Devuelve SOLO JSON estricto (sin markdown, sin texto extra).
        - No inventes información ni causalidades como hechos.
        - Si explicas "por qué", formula hipótesis ("podría deberse a...").
        - Evita generalizaciones fuertes: son frases representativas, no una encuesta estadística.
        - En evidence, usa citas textuales cortas (<= 200 caracteres) tomadas de los ejemplos provistos.
        `;

        const user = {
            selectedQuestion,
            cohortA_eventIds: aEventIds,
            cohortB_eventIds: bEventIds,
            sample_note: "Los arrays cohortA_phrases/cohortB_phrases son una muestra. No inventes frases fuera de la muestra.",
            cohortA_phrases: scopedA.slice(0, 60),
            cohortB_phrases: scopedB.slice(0, 60),
            output_schema: {
                summary: "string",
                question: "string|null",
                cohortA_size: "number",
                cohortB_size: "number",
                per_event: [
                    {
                        eventId: "number",
                        eventLabel: "string",
                        cohortA_tendencies: ["string"],
                        cohortB_tendencies: ["string"],
                        key_differences: ["string"],
                        possible_reasons_hypotheses: ["string"],
                        evidence_quotes: [
                            {
                                cohort: '"A"|"B"',
                                quote: "string",
                            },
                        ],
                    },
                ],
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

        return new Response(
            JSON.stringify({
                selectedQuestion,
                questionStats: stats.slice(0, 25),
                basis: {
                    cohortA_total_scoped: scopedA.length,
                    cohortB_total_scoped: scopedB.length,
                },
                result: JSON.parse(content),
            }),
            { status: 200 }
        );
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "Error interno" }), { status: 500 });
    }
};
