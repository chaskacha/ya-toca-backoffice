// app/api/murals/compare/route.ts
import { query } from "@/lib/db";
import { openai_completions } from "@/constants/openai";

function getMultiInt(sp: URLSearchParams, key: string) {
    return sp.getAll(key).filter(x => /^\d+$/.test(x)).map(Number);
}

export const GET = async (req: Request) => {
    try {
        const sp = new URL(req.url).searchParams;

        const aEventIds = getMultiInt(sp, "a");
        const bEventIds = getMultiInt(sp, "b");

        if (!aEventIds.length || !bEventIds.length) {
            return new Response(
                JSON.stringify({ error: "Selecciona al menos 1 evento para A y B." }),
                { status: 400 }
            );
        }

        const baseSql = `
      SELECT
        ph.id AS idphrase,
        COALESCE(NULLIF(btrim(ph.clean_text), ''), btrim(ph.raw_text)) AS phrase,
        e.id AS event_id,
        e.name_event,
        e.date_event::text AS event_date
      FROM mural_phrases ph
      JOIN mural_events e ON e.id = ph.event_id
      WHERE ph.raw_text IS NOT NULL
    `;

        const [resA, resB] = await Promise.all([
            query(`${baseSql} AND e.id = ANY($1::int[]) LIMIT 1200`, [aEventIds]),
            query(`${baseSql} AND e.id = ANY($1::int[]) LIMIT 1200`, [bEventIds]),
        ]);

        if (!resA.rows.length || !resB.rows.length) {
            return new Response(
                JSON.stringify({ error: "No hay suficientes frases para comparar." }),
                { status: 400 }
            );
        }

        const allPhraseIds = [...resA.rows, ...resB.rows].map(r => r.idphrase);

        const embRes = await query(
            `
      SELECT idphrase, embedding
      FROM mural_phrase_embeddings
      WHERE idphrase = ANY($1::int[])
      `,
            [allPhraseIds]
        );

        if (!embRes.rows.length) {
            return new Response(
                JSON.stringify({ error: "No hay embeddings disponibles." }),
                { status: 409 }
            );
        }

        const system = `
        Eres un analista de opinión pública. Estás comparando FRASES CORTAS extraídas de murales.
        Contexto: estas frases fueron escritas por participantes cuando se les preguntó:
        "¿Qué nos toca hacer para mejorar el país?"

        Tu tarea: comparar dos cohortes (Evento A vs Evento B) y sintetizar tendencias por evento.
        IMPORTANTE:
        - Devuelve SOLO JSON estricto (sin markdown, sin texto extra, sin etiquetas).
        - NO inventes información ni atribuyas causalidades como hechos.
        - Todo insight explicativo debe formularse como hipótesis ("podría deberse a...", "es posible que...").
        - Evita generalizaciones fuertes: son frases representativas, no una encuesta estadística.
        - No incluyas datos personales ni inferencias sensibles sobre individuos.

        Qué observar:
        - Temas recurrentes (p.ej., educación, corrupción, convivencia, trabajo, seguridad, medio ambiente, participación).
        - Tono y framing (acción individual vs acción colectiva; optimismo vs frustración; demandas al Estado vs responsabilidad ciudadana).
        - Diferencias relevantes entre eventos (qué aparece más en uno que en otro, y cómo se expresa).

        Formato:
        - Usa bullets cortos (frases de 6–18 palabras) para tendencies/differences/hypotheses.
        - En evidence, usa citas textuales cortas (<= 200 caracteres) tomadas de los ejemplos provistos.

        Devuelve JSON con el schema solicitado y nada más.
        `;


        const user = {
            cohortA_eventIds: aEventIds,
            cohortB_eventIds: bEventIds,
            cohortA_phrases: resA.rows.slice(0, 40),
            cohortB_phrases: resB.rows.slice(0, 40),
            output_schema: {
                summary: "string",
                per_event: [{
                    eventId: "number",
                    eventLabel: "string",
                    cohortA_tendencies: ["string"],
                    cohortB_tendencies: ["string"],
                    key_differences: ["string"],
                    possible_reasons_hypotheses: ["string"],
                }],
            }
        };

        const completion = await openai_completions(
            "gpt-4.1-mini",
            [
                { role: "system", content: system },
                { role: "user", content: JSON.stringify(user) }
            ],
            { type: "json_object" }
        );

        return new Response(
            JSON.stringify({ result: JSON.parse(completion.choices[0].message.content ?? "{}") }),
            { status: 200 }
        );
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "Error interno" }), { status: 500 });
    }
};
