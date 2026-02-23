// app/api/murals/events/list/route.ts
import { query } from "@/lib/db";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);

    const regionIdRaw = searchParams.get("regionId");
    const qRaw = searchParams.get("q");

    const regionId = regionIdRaw && /^\d+$/.test(regionIdRaw) ? Number(regionIdRaw) : null;
    const q = qRaw ? String(qRaw).trim() : "";

    const sql = `
      SELECT
        ev.id,
        ev.name,
        ev.id_region,
        r.nombreregion AS region_name
      FROM events ev
      LEFT JOIN regiones r ON r.id = ev.id_region
      WHERE
        ev.name IS NOT NULL AND btrim(ev.name) <> ''
        AND ($1::int IS NULL OR ev.id_region = $1::int)
        AND ($2::text = '' OR ev.name ILIKE '%' || $2::text || '%')
      ORDER BY ev.name ASC
    `;

    const res = await query(sql, [regionId, q]);

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