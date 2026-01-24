import { openai_completions } from "@/constants/openai";

type Body = {
    basis: any; // CompareResult JSON
    messages: { role: "user" | "assistant"; content: string }[];
};

const SYSTEM = `
Eres un analista. Responde en español.
Tu base de verdad es el JSON "basis" (resultado de comparación por estación).
No inventes datos que no estén en basis.

Contexto: cada estación corresponde a una pregunta distinta:
- Estación 1: "¿Qué te choca o te frustra de vivir en este país? ¿Y qué te da esperanza o te hace sentir que sí se puede?"
- Estación 2: "¿Crees que el lugar y las condiciones en las que nacimos marcan lo que podemos lograr? ¿Cómo podemos convivir y construir con gente que piensa distinto?"
- Estación 3: "Si fueras presidente, ¿qué harías para no decepcionar a tu generación? ¿Cuáles serían tus prioridades?"

Reglas de respuesta:
- Si el usuario pregunta por una estación específica, responde SOLO con lo que corresponda a esa estación (no mezcles estaciones).
- Si el usuario no especifica estación, pregunta/infiera con cuidado: ofrece un resumen por estación o pide que elija una (sin inventar).
- Si te preguntan "por qué", responde con hipótesis cautelosas, no con hechos.
- Cita evidencia usando ejemplos breves que existan en basis.evidence (si están). No inventes citas.
- Si basis indica limitaciones, recuérdalas cuando corresponda (por ejemplo: pocos ejemplos, sesgos, representatividad).
- Si el usuario pide "fuentes", solo menciona fuentes metodológicas (embeddings, clustering, RAG) y aclara que no son fuentes sobre la realidad social local.

Estilo:
- Claro, neutral y útil.
- Si no hay evidencia suficiente en basis para responder algo, dilo explícitamente y sugiere qué faltaría (p.ej., más ejemplos o más frases).
`;


export const POST = async (req: Request) => {
    try {
        const body = (await req.json()) as Body;

        const basis = body.basis ?? null;
        const msgs = Array.isArray(body.messages) ? body.messages : [];

        if (!basis) {
            return new Response(JSON.stringify({ error: "Missing basis" }), { status: 400 });
        }
        const lastUser = [...msgs].reverse().find((m) => m?.role === "user")?.content?.trim();
        if (!lastUser) {
            return new Response(JSON.stringify({ error: "Missing user message" }), { status: 400 });
        }

        // Keep it light: send only last N messages
        const history = msgs.slice(-10);

        const completion = await openai_completions("gpt-4.1-mini", [
            { role: "system", content: SYSTEM },
            {
                role: "user",
                content: JSON.stringify({
                    basis,
                    conversation: history,
                    instruction: "Responde a la última pregunta del usuario usando basis como base.",
                }),
            },
        ]);

        const answer = completion.choices?.[0]?.message?.content ?? "No pude responder.";

        return new Response(JSON.stringify({ answer }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 });
    }
};
