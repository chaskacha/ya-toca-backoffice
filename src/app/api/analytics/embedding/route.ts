import { build_topic_text, l2_normalize, sha256 } from "@/constants/functions";
import { get_embedding, EMBEDDING_MODEL, EMBEDDING_PIPELINE_VERSION } from "@/constants/openai";
import { EmbeddedTopic, Topic, topics } from "@/constants/predefined_themes";

export const POST = async (req: Request) => {
    try {
        async function embedOne(t: Topic): Promise<EmbeddedTopic> {
            const built = build_topic_text(t);

            const resp = await get_embedding(built);

            const raw = resp as number[];
            const { embedding, norm } = l2_normalize(raw);

            return {
                id: t.id,
                alias: t.alias,
                name: t.name,
                description: t.description,
                keywords: t.keywords ?? [],
                seed_examples: t.seed_examples ?? [],
                model: EMBEDDING_MODEL,
                embedding,
                norm,
                text_hash: sha256(built),
                built_text: built,
                createdAt: new Date().toISOString(),
                version: EMBEDDING_PIPELINE_VERSION,
            };
        }

        async function embedAll(topics: Topic[]): Promise<EmbeddedTopic[]> {
            // Validate & sort by id for deterministic output
            const validated = topics.map((t) => t);
            validated.sort((a, b) => a.id - b.id);

            const results: EmbeddedTopic[] = [];
            for (const t of validated) {
                const et = await embedOne(t);
                results.push(et);
                // Progress log
                console.log(
                    `✔ Embedded topic #${t.id} (${t.alias}) | dim=${et.embedding.length} | norm=${et.norm.toFixed(
                        4
                    )}`
                );
            }
            return results;
        }

        const embedded = await embedAll(topics);

        // For now: print a compact JSON you can capture or pipe to a file
        const out = {
            collection: "topics",
            model: EMBEDDING_MODEL,
            version: EMBEDDING_PIPELINE_VERSION,
            count: embedded.length,
            items: embedded,
        };

        return new Response(JSON.stringify(out), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error al generar embeddings:", error);
        return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}