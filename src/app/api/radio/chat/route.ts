// src/app/api/radio/chat/route.ts
import { openai_completions } from "@/constants/openai";

type Body = {
    basis: any;
    messages: { role: "user" | "assistant"; content: string }[];
};

const SYSTEM = `
Eres un analista. Responde en español.

Contexto (Radio):
- El contenido base proviene de transcripciones de episodios de radio (audio → texto).
- NO es una encuesta representativa. Son fragmentos/transcripciones del programa.

Tu base de verdad es el JSON "basis" (resultado de comparación).
Reglas:
- No inventes datos que no estén en basis.
- Si te preguntan "por qué", responde con hipótesis cautelosas, no con hechos.
- Sustenta con evidencia cuando exista (por ejemplo, evidence/cohort*_examples).
- Si falta evidencia directa en basis para responder, dilo explícitamente.
- Si el usuario pide "fuentes", solo menciona fuentes metodológicas (transcripción, embeddings, análisis descriptivo, LLM) y aclara que no prueban realidad social local.
- Mantén la respuesta clara y concisa.
`;

export const POST = async (req: Request) => {
    try {
        const body = (await req.json()) as Body;

        const basis = body?.basis ?? null;
        const msgs = Array.isArray(body?.messages) ? body.messages : [];

        if (!basis) {
            return new Response(JSON.stringify({ error: "Missing basis" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const lastUser = [...msgs].reverse().find((m) => m?.role === "user")?.content?.trim();
        if (!lastUser) {
            return new Response(JSON.stringify({ error: "Missing user message" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // keep last ~10 messages (ephemeral)
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
        return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};
