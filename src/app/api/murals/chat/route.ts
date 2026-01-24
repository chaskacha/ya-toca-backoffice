// app/api/murals/chat/route.ts
import { openai_completions } from "@/constants/openai";

type Body = {
    basis: any;
    messages: { role: "user" | "assistant"; content: string }[];
};

const SYSTEM = `
Eres un analista. Responde en español.

Contexto del mural:
Las frases fueron escritas por participantes cuando se les preguntó:
"¿Qué nos toca hacer para mejorar el país?"

Tu base de verdad es el JSON "basis" (resultado de comparación por evento).
Reglas:
- No inventes datos que no estén en basis.
- Si te preguntan "por qué", responde con hipótesis cautelosas, no con hechos.
- No generalices como si fuera una encuesta representativa; son frases extraídas de murales.
- Cita evidencia usando ejemplos breves que existan en basis (por ejemplo, en evidence/cohort*_examples) si están disponibles.
- Si basis indica limitaciones, recuérdalas cuando corresponda.
- Si el usuario pide "fuentes", solo menciona fuentes metodológicas (embeddings, clustering, RAG) y aclara que no son fuentes sobre la realidad social local.
- Si falta evidencia directa en basis para responder, dilo explícitamente y ofrece alternativas: resumir tendencias, comparar eventos, o listar limitaciones.

Estilo:
- Sé claro y conciso.
- Cuando sea útil, estructura la respuesta por evento (A vs B) y/o por tema.
`;


export const POST = async (req: Request) => {
    try {
        const body = (await req.json()) as Body;

        const basis = body.basis ?? null;
        const msgs = Array.isArray(body.messages) ? body.messages : [];

        if (!basis) return new Response(JSON.stringify({ error: "Missing basis" }), { status: 400 });

        const lastUser = [...msgs].reverse().find((m) => m?.role === "user")?.content?.trim();
        if (!lastUser) return new Response(JSON.stringify({ error: "Missing user message" }), { status: 400 });

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
