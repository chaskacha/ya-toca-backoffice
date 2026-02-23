// app/api/murals/dashboard/route.ts
import { query } from "@/lib/db";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);

    const regionIdRaw = searchParams.get("regionId");
    const eventIdRaw = searchParams.get("eventId");
    const activityIdRaw = searchParams.get("activityId");

    const regionId = regionIdRaw && /^\d+$/.test(regionIdRaw) ? Number(regionIdRaw) : null;
    const eventId = eventIdRaw && /^\d+$/.test(eventIdRaw) ? Number(eventIdRaw) : null;
    const activityId = activityIdRaw && /^\d+$/.test(activityIdRaw) ? Number(activityIdRaw) : null;

    const sql = `
WITH base_events AS (
  SELECT
    ev.id AS event_id,
    ev.name AS event_name,
    ev.id_region,
    r.nombreregion AS region_name
  FROM events ev
  LEFT JOIN regiones r ON r.id = ev.id_region
  WHERE
    ($1::int IS NULL OR ev.id_region = $1::int)
    AND ($2::int IS NULL OR ev.id = $2::int)
),
base_activities AS (
  SELECT
    a.id AS activity_id,
    a.name_event,
    a.date_event,
    a.id_event,
    be.event_id,
    be.event_name,
    be.id_region,
    be.region_name
  FROM activities a
  JOIN base_events be ON be.event_id = a.id_event
  WHERE ($3::int IS NULL OR a.id = $3::int)
),
base_photos AS (
  SELECT
    p.id AS photo_id,
    p.id_activity,
    ba.activity_id,
    ba.name_event,
    ba.date_event,
    ba.event_id,
    ba.event_name,
    ba.id_region,
    ba.region_name
  FROM mural_photos p
  JOIN base_activities ba ON ba.activity_id = p.id_activity
),
base_phrases AS (
  SELECT
    ph.id,
    ph.photo_id,
    ph.id_activity,
    COALESCE(NULLIF(btrim(ph.clean_text), ''), btrim(ph.raw_text)) AS phrase_norm,

    ba.activity_id,
    ba.name_event,
    ba.date_event,
    ba.event_id,
    ba.event_name,
    ba.region_name
  FROM mural_phrases ph
  JOIN base_activities ba ON ba.activity_id = ph.id_activity
  WHERE ph.raw_text IS NOT NULL AND btrim(ph.raw_text) <> ''
    AND (
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
     SELECT (COALESCE(event_name,'Sin evento')) AS k, COUNT(*)::int AS v
     FROM base_phrases
     GROUP BY (COALESCE(event_name,'Sin evento'))
     ORDER BY COUNT(*) DESC
   ) t
  ) AS events,

  (SELECT COALESCE(jsonb_object_agg(k, v), '{}'::jsonb)
   FROM (
     SELECT
       (COALESCE(name_event,'Sin actividad')) AS k,
       COUNT(*)::int AS v
     FROM base_phrases
     GROUP BY (COALESCE(name_event,'Sin actividad'))
     ORDER BY COUNT(*) DESC
   ) t
  ) AS activities
;
`;

    const res = await query(sql, [regionId, eventId, activityId]);
    const row = res.rows?.[0];

    return new Response(
      JSON.stringify({
        totalPhotos: row?.total_photos ?? 0,
        totalPhrases: row?.total_phrases ?? 0,
        breakdown: {
          regions: row?.regions ?? {},
          events: row?.events ?? {},
          activities: row?.activities ?? {},
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