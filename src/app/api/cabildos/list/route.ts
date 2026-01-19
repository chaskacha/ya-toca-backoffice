import { query } from "@/lib/db";

export const GET = async () => {
    try {
        const res = await query(
            `
      SELECT id, nombre_de_cabildo
      FROM cabildos
      WHERE nombre_de_cabildo IS NOT NULL AND btrim(nombre_de_cabildo) <> ''
      ORDER BY nombre_de_cabildo ASC
      `
        );

        return new Response(JSON.stringify({ cabildos: res.rows }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error loading cabildos list:", error);
        return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};
