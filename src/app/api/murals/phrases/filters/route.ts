// app/api/murals/filters/route.ts
import { query } from "@/lib/db";

export const GET = async () => {
    try {
        const regionsRes = await query(
            `
      SELECT DISTINCT
        r.id,
        r.nombreregion
      FROM mural_events e
      JOIN regiones r ON r.id = e.idregion
      ORDER BY r.nombreregion ASC
      `
        );

        const eventsRes = await query(
            `
      SELECT
        e.id,
        e.name_event,
        e.date_event,
        e.idregion
      FROM mural_events e
      WHERE e.name_event IS NOT NULL AND btrim(e.name_event) <> ''
      ORDER BY e.date_event DESC, e.name_event ASC
      `
        );
        return new Response(
            JSON.stringify({
                regions: regionsRes.rows,
                events: eventsRes.rows,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (e) {
        console.error("Error loading mural filters:", e);
        return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};
