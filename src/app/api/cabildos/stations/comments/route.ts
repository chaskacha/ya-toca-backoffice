// app/api/cabildos/stations/comments/route.ts
import { query } from "@/lib/db";

const ADMIN_PHONE = "51991515939";
const STATIONS = [14, 11, 12, 15];

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);

    const cabildoIdRaw = searchParams.get("cabildoId");
    const cabildoId =
      cabildoIdRaw && /^\d+$/.test(cabildoIdRaw) ? Number(cabildoIdRaw) : null;

    const region = searchParams.get("region") || null;
    const gender = searchParams.get("gender") || null;
    const ageGroup = searchParams.get("age") || null;
    const nivelinstruccion = searchParams.get("nivelinstruccion") || null;
    const grupoetnico = searchParams.get("grupoetnico") || null;

    const stationIdRaw = searchParams.get("stationId");
    const stationId =
      stationIdRaw && /^\d+$/.test(stationIdRaw) ? Number(stationIdRaw) : null;

    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const pageSize = Math.min(100, Math.max(10, Number(searchParams.get("pageSize") || "20")));
    const offset = (page - 1) * pageSize;

    const sql = `
    WITH participants_base AS (
  SELECT
    p.id AS participant_id,
    p.id_cabildo,
    p.fechacreacion AS fecha,
    cbl.nombre_de_cabildo AS cabildo,
    reg.nombreregion AS region_cabildo,
    p.region AS region_procedencia,
    p.telefono,
    COALESCE(NULLIF(btrim(p.genero), ''), 'No especifica') AS genero,
    COALESCE(NULLIF(btrim(p.age_group), ''), 'No especifica') AS age_group,
    COALESCE(NULLIF(btrim(p.nivelinstruccion), ''), 'No especifica') AS nivelinstruccion,
    COALESCE(NULLIF(btrim(p.grupoetnico), ''), 'No especifica') AS grupoetnico
  FROM participantes p
  JOIN cabildos cbl ON cbl.id = p.id_cabildo
  LEFT JOIN regiones reg ON reg.id = cbl.idregion
  WHERE
    p.id_cabildo IS NOT NULL
    AND p.telefono IS NOT NULL
    AND btrim(p.telefono) <> ''
    AND p.telefono <> $1
),
filtered_participants AS (
  SELECT *
  FROM participants_base pb
  WHERE
    ($3::int  IS NULL OR pb.id_cabildo = $3::int)
    AND ($4::text IS NULL OR pb.region_cabildo = $4::text)
    AND ($5::text IS NULL OR pb.genero = $5::text)
    AND ($6::text IS NULL OR pb.age_group = $6::text)
    AND ($7::text IS NULL OR pb.nivelinstruccion = $7::text)
    AND ($8::text IS NULL OR pb.grupoetnico = $8::text)
),
comments_by_station AS (
  SELECT
    fp.participant_id,
    e.id AS idestacion,
    c.texto AS comentario,
    c.id AS comentario_id
  FROM filtered_participants fp
  JOIN comentariosparticipantes cp ON cp.idparticipante = fp.participant_id
  JOIN comentarios c ON c.id = cp.idcomentario
  JOIN estaciones e ON e.id = c.idestacion
  WHERE
    e.id = ANY($2::int[])
    AND ($9::int IS NULL OR e.id = $9::int)
),
pivoted AS (
  SELECT
    fp.fecha,
    fp.participant_id,
    fp.cabildo,
    fp.region_cabildo,
    fp.region_procedencia,
    fp.telefono,
    fp.genero,
    fp.age_group,
    fp.nivelinstruccion,
    fp.grupoetnico,

    COALESCE(
      string_agg(com.comentario, E'\n\n' ORDER BY com.comentario_id)
      FILTER (WHERE com.idestacion = 14),
      ''
    ) AS e1_catarsis,

    COALESCE(
      string_agg(com.comentario, E'\n\n' ORDER BY com.comentario_id)
      FILTER (WHERE com.idestacion = 11),
      ''
    ) AS e2_circunstancias,

    COALESCE(
      string_agg(com.comentario, E'\n\n' ORDER BY com.comentario_id)
      FILTER (WHERE com.idestacion = 12),
      ''
    ) AS e3_yo_presidente,

    COALESCE(
      string_agg(com.comentario, E'\n\n' ORDER BY com.comentario_id)
      FILTER (WHERE com.idestacion = 15),
      ''
    ) AS cierre

  FROM filtered_participants fp
  LEFT JOIN comments_by_station com ON com.participant_id = fp.participant_id
  GROUP BY
    fp.fecha, fp.participant_id, fp.cabildo, fp.region_cabildo, fp.region_procedencia,
    fp.telefono, fp.genero, fp.age_group, fp.nivelinstruccion, fp.grupoetnico
)
SELECT
  (SELECT COUNT(*)::int FROM pivoted) AS total,
  (SELECT COALESCE(jsonb_agg(to_jsonb(t)), '[]'::jsonb)
   FROM (
     SELECT *
     FROM pivoted
     ORDER BY fecha DESC
     LIMIT $10 OFFSET $11
   ) t
  ) AS rows
;

    `;

    const res = await query(sql, [
      ADMIN_PHONE,
      STATIONS,
      cabildoId,
      region,
      gender,
      ageGroup,
      nivelinstruccion,
      grupoetnico,
      stationId,
      pageSize,
      offset,
    ]);

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
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
