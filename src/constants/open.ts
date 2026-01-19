import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});
export const EMBEDDING_MODEL = "text-embedding-3-large"; // text-embedding-ada-002
export const EMBEDDING_PIPELINE_VERSION = "topics-v1.0.0";

export const get_embeddings = async (text: string[]) => {
    const response = await openai.embeddings.create({
        model: EMBEDDING_MODEL,
        input: text,
    });
    return response.data.map(d => d.embedding);
};
// const SYS = `Eres un analista de taxonomías de temas sociopolíticos.
// Devuelve JSON con: {id, keywords[], seed_examples[]}.
// - 10–15 keywords en minúsculas, útiles y variadas (incluye sinónimos/variantes).
// - 6–10 seed_examples en español, 5–20 palabras, naturales y diversas.
// - No repitas en exceso la misma palabra.`;

// export async function propose(t: RawTopic) {
//     const user = `Tema: ${t.name}\nDescripción: ${t.description}\nDevuelve solo JSON.`;
//     const res = await openai.chat.completions.create({
//         model: "gpt-4o-mini",
//         temperature: 0.3,
//         response_format: { type: "json_object" },
//         messages: [{ role: "system", content: SYS }, { role: "user", content: user }]
//     });
//     return JSON.parse(res.choices[0].message.content!);
// }

export const openai_completions = (model: string, messages: OpenAI.Chat.ChatCompletionCreateParams['messages'], response_format?: OpenAI.Chat.ChatCompletionCreateParams['response_format']) => {
    return openai.chat.completions.create({
        model,
        messages,
        response_format
    });
}