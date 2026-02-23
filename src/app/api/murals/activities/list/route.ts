// app/api/murals/activities/list/route.ts
import { query } from "@/lib/db";

export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);

        const regionIdRaw = searchParams.get("regionId");
        const eventIdRaw = searchParams.get("eventId");

        const regionId = regionIdRaw && /^\d+$/.test(regionIdRaw) ? Number(regionIdRaw) : null;
        const eventId = eventIdRaw && /^\d+$/.test(eventIdRaw) ? Number(eventIdRaw) : null;

        const sql = `
      SELECT
        a.id,
        a.name_event,
        a.date_event,
        a.id_event
      FROM activities a
      WHERE
        a.name_event IS NOT NULL AND btrim(a.name_event) <> ''
        AND ($1::int IS NULL OR a.id_event = $1::int)
        AND ($2::int IS NULL OR EXISTS (
          SELECT 1 FROM events ev
          WHERE ev.id = a.id_event AND ev.id_region = $2::int
        ))
      ORDER BY a.date_event DESC NULLS LAST, a.name_event ASC
    `;

        const res = await query(sql, [eventId, regionId]);

        return new Response(JSON.stringify({ activities: res.rows }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        console.error("Error loading mural activities list:", e);
        return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};