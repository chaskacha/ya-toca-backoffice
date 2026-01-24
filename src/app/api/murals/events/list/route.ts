// app/api/murals/events/list/route.ts
import { query } from "@/lib/db";

export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const regionId = searchParams.get("regionId");

        const regionIdInt = regionId && /^\d+$/.test(regionId) ? Number(regionId) : null;

        const sql = `
      SELECT
        e.id,
        e.name_event,
        e.date_event,
        e.idregion,
        r.nombreregion AS region_nombre
      FROM mural_events e
      LEFT JOIN regiones r ON r.id = e.idregion
      WHERE
        e.name_event IS NOT NULL AND btrim(e.name_event) <> ''
        AND ($1::int IS NULL OR e.idregion = $1::int)
      ORDER BY e.date_event DESC, e.name_event ASC
    `;

        const res = await query(sql, [regionIdInt]);

        return new Response(JSON.stringify({ events: res.rows }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        console.error("Error loading mural events list:", e);
        return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};
