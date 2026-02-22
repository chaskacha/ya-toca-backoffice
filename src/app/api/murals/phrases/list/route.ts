// app/api/murals/phrases/route.ts
import { query } from "@/lib/db";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);

    const regionIdRaw = searchParams.get("regionId");
    const eventIdRaw = searchParams.get("eventId");

    const regionId = regionIdRaw && /^\d+$/.test(regionIdRaw) ? Number(regionIdRaw) : null;
    const eventId = eventIdRaw && /^\d+$/.test(eventIdRaw) ? Number(eventIdRaw) : null;

    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const pageSize = Math.min(100, Math.max(10, Number(searchParams.get("pageSize") || "20")));
    const offset = (page - 1) * pageSize;

    const sql = `
  WITH base AS (
    SELECT
      ph.id AS phrase_id,
      ph.created_at AS created_at,
      ph.question AS question,
      COALESCE(NULLIF(btrim(ph.clean_text), ''), btrim(ph.raw_text)) AS phrase,
      ph.confidence,

      -- photo can be NULL for event_id=13
      p.photo_url,

      e.id AS event_id,
      e.name_event,
      e.date_event,
      e.idregion,
      r.nombreregion AS region_name
    FROM mural_phrases ph
    LEFT JOIN mural_photos p ON p.id = ph.photo_id
    JOIN mural_events e ON e.id = ph.event_id
    LEFT JOIN regiones r ON r.id = e.idregion
    WHERE
      ph.raw_text IS NOT NULL
      AND btrim(ph.raw_text) <> ''

      -- if phrase has a photo_id, ensure it belongs to same event (safety)
      AND (ph.photo_id IS NULL OR p.event_id = ph.event_id)
  ),
  filtered AS (
    SELECT *
    FROM base b
    WHERE
      ($1::int IS NULL OR b.idregion = $1::int)
      AND ($2::int IS NULL OR b.event_id = $2::int)
  )
  SELECT
    (SELECT COUNT(*)::int FROM filtered) AS total,
    (SELECT COALESCE(jsonb_agg(to_jsonb(t)), '[]'::jsonb)
     FROM (
       SELECT
         created_at, phrase_id, phrase, question, confidence,
         photo_url, event_id, name_event, date_event, idregion, region_name
       FROM filtered
       ORDER BY created_at DESC, phrase_id DESC
       LIMIT $3 OFFSET $4
     ) t
    ) AS rows;
`;

    const res = await query(sql, [regionId, eventId, pageSize, offset]);
    const row = res.rows?.[0] ?? {};

    return new Response(
      JSON.stringify({
        page,
        pageSize,
        total: row.total ?? 0,
        rows: row.rows ?? [],
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Error ejecutando la consulta:", e);
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 });
  }
};
