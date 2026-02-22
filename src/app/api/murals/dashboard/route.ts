// app/api/murals/dashboard/route.ts
import { query } from "@/lib/db";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);

    const regionId = searchParams.get("regionId");
    const eventId = searchParams.get("eventId");

    const regionIdInt = regionId && /^\d+$/.test(regionId) ? Number(regionId) : null;
    const eventIdInt = eventId && /^\d+$/.test(eventId) ? Number(eventId) : null;

    const sql = `
  WITH base_events AS (
    SELECT
      e.id AS event_id,
      e.name_event,
      e.date_event,
      e.idregion,
      r.nombreregion AS region_name
    FROM mural_events e
    LEFT JOIN regiones r ON r.id = e.idregion
    WHERE
      ($1::int IS NULL OR e.idregion = $1::int)
      AND ($2::int IS NULL OR e.id = $2::int)
  ),
  base_photos AS (
    SELECT
      p.id AS photo_id,
      p.event_id,
      be.name_event,
      be.date_event,
      be.idregion,
      be.region_name
    FROM mural_photos p
    JOIN base_events be ON be.event_id = p.event_id
  ),
  base_phrases AS (
    SELECT
      ph.id,
      ph.photo_id,
      ph.event_id,
      COALESCE(NULLIF(btrim(ph.clean_text), ''), btrim(ph.raw_text)) AS phrase_norm,

      -- attach event/region info (works even when photo_id is NULL)
      be.name_event,
      be.date_event,
      be.region_name
    FROM mural_phrases ph
    JOIN base_events be ON be.event_id = ph.event_id
    WHERE ph.raw_text IS NOT NULL AND btrim(ph.raw_text) <> ''
      AND (
        -- phrases tied to a photo
        ph.photo_id IS NULL
        OR EXISTS (
          SELECT 1
          FROM base_photos bp
          WHERE bp.photo_id = ph.photo_id
        )
      )
  )
  SELECT
    (SELECT COUNT(*)::int FROM base_photos) AS total_photos,
    (SELECT COUNT(*)::int FROM base_phrases) AS total_phrases,

    (SELECT COALESCE(jsonb_object_agg(k, v), '{}'::jsonb)
     FROM (
       SELECT COALESCE(region_name, 'Sin región') AS k, COUNT(*)::int AS v
       FROM base_phrases
       GROUP BY COALESCE(region_name, 'Sin región')
       ORDER BY COUNT(*) DESC
     ) t
    ) AS regions,

    (SELECT COALESCE(jsonb_object_agg(k, v), '{}'::jsonb)
     FROM (
       SELECT
         (COALESCE(name_event,'Sin evento') || ' — ' || COALESCE(date_event::text,'')) AS k,
         COUNT(*)::int AS v
       FROM base_phrases
       GROUP BY (COALESCE(name_event,'Sin evento') || ' — ' || COALESCE(date_event::text,''))
       ORDER BY COUNT(*) DESC
     ) t
    ) AS events,

    (SELECT COALESCE(jsonb_agg(x), '[]'::jsonb)
     FROM (
       SELECT phrase_norm AS text, COUNT(*)::int AS count
       FROM base_phrases
       WHERE phrase_norm IS NOT NULL AND phrase_norm <> ''
       GROUP BY phrase_norm
       ORDER BY COUNT(*) DESC
       LIMIT 25
     ) x
    ) AS top_phrases
  ;
`;

    const res = await query(sql, [regionIdInt, eventIdInt]);
    const row = res.rows?.[0];

    return new Response(
      JSON.stringify({
        totalPhotos: row?.total_photos ?? 0,
        totalPhrases: row?.total_phrases ?? 0,
        breakdown: {
          regions: row?.regions ?? {},
          events: row?.events ?? {},
          topPhrases: row?.top_phrases ?? [],
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
