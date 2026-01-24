// app/api/murals/chat/route.ts
import { openai_completions } from "@/constants/openai";

type Body = {
    basis: any;
    messages: { role: "user" | "assistant"; content: string }[];
};

const SYSTEM = `
Eres un analista. Responde en español.
Tu base de verdad es el JSON "basis" (resultado de comparación de Dark Room por pregunta y opciones).
- No inventes datos que no estén en basis.
- Este ejercicio corresponde al "Dark Room": participantes eligieron opciones ante una pregunta (no hay texto libre).
- Si te preguntan "por qué", responde con hipótesis cautelosas, no con hechos.
- Sustenta con números: totales y distribuciones (edad/género) que existan en basis.
- Si basis indica limitaciones, recuérdalas cuando corresponda.
- Si el usuario pide "fuentes", solo menciona fuentes metodológicas (LLM, análisis descriptivo) y aclara que no son fuentes sobre la realidad social local.
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
