import { query } from "@/lib/db";

const ADMIN_PHONE = "51991515939";
const STATIONS = [11, 12, 13, 14];

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
      WITH base AS (
        SELECT
          p.id_cabildo, -- ✅ IMPORTANT (so we can filter)
          p.fechacreacion AS fecha,
          cbl.nombre_de_cabildo AS cabildo,
          p.telefono AS telefono,
          p.region AS region,
          COALESCE(NULLIF(btrim(p.genero), ''), 'No especifica') AS genero,
          COALESCE(NULLIF(btrim(p.age_group), ''), 'No especifica') AS age_group,
          COALESCE(NULLIF(btrim(p.nivelinstruccion), ''), 'No especifica') AS nivelinstruccion,
          COALESCE(NULLIF(btrim(p.grupoetnico), ''), 'No especifica') AS grupoetnico,
          e.id AS idestacion,
          e.nombreestacion AS estacion,
          c.texto AS comentario
        FROM participantes p
        JOIN cabildos cbl ON cbl.id = p.id_cabildo
        JOIN comentariosparticipantes cp ON cp.idparticipante = p.id
        JOIN comentarios c ON c.id = cp.idcomentario
        JOIN estaciones e ON e.id = c.idestacion
        WHERE
          p.id_cabildo IS NOT NULL
          AND p.telefono IS NOT NULL
          AND btrim(p.telefono) <> ''
          AND p.telefono <> $1
          AND e.id = ANY($2::int[])
      ),
      filtered AS (
        SELECT *
        FROM base b
        WHERE
          ($3::int  IS NULL OR b.id_cabildo = $3::int)
          AND ($4::text IS NULL OR b.region = $4::text)
          AND ($5::text IS NULL OR b.genero = $5::text)
          AND ($6::text IS NULL OR b.age_group = $6::text)
          AND ($7::text IS NULL OR b.nivelinstruccion = $7::text)
          AND ($8::text IS NULL OR b.grupoetnico = $8::text)
          AND ($9::int  IS NULL OR b.idestacion = $9::int)
      )
      SELECT
        (SELECT COUNT(*)::int FROM filtered) AS total,
        (SELECT COALESCE(jsonb_agg(to_jsonb(t)), '[]'::jsonb)
         FROM (
           SELECT
             fecha, cabildo, telefono, region, genero, age_group, nivelinstruccion, grupoetnico,
             idestacion, estacion, comentario
           FROM filtered
           ORDER BY fecha DESC
           LIMIT $10 OFFSET $11
         ) t
        ) AS rows;
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
