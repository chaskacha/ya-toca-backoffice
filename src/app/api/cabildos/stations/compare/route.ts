// app/api/cabildos/stations/compare/route.ts
import { query } from "@/lib/db";
import { openai_completions, EMBEDDING_MODEL, EMBEDDING_PIPELINE_VERSION } from "@/constants/open";

const ADMIN_PHONE = "51991515939";
const DEFAULT_STATIONS = [11, 12, 13, 14];

type Row = {
    idcomentario: number;
    comentario: string;
    idestacion: number;
    estacion: string;

    region: string | null;
    genero: string | null;
    age_group: string | null;
    nivelinstruccion: string | null;
    grupoetnico: string | null;
    id_cabildo: number | null;
};

function getMulti(sp: URLSearchParams, key: string) {
    return sp.getAll(key).map((s) => s.trim()).filter(Boolean);
}
function getMultiInt(sp: URLSearchParams, key: string) {
    return sp.getAll(key)
        .map((s) => s.trim())
        .filter((s) => /^\d+$/.test(s))
        .map((s) => Number(s));
}

function buildCohortFilters(sp: URLSearchParams, prefix: "a_" | "b_") {
    return {
        cabildoIds: getMultiInt(sp, `${prefix}cabildoId`),
        regions: getMulti(sp, `${prefix}region`),
        genders: getMulti(sp, `${prefix}gender`),
        ageGroups: getMulti(sp, `${prefix}age`),
        niveles: getMulti(sp, `${prefix}nivelinstruccion`),
        etnicos: getMulti(sp, `${prefix}grupoetnico`),
    };
}

function buildWhereClause(cohort: ReturnType<typeof buildCohortFilters>, paramOffset: number) {
    const params: any[] = [];
    const parts: string[] = [];

    const pushIn = (col: string, values: any[], cast: string) => {
        if (!values.length) return;
        params.push(values);
        parts.push(`${col} = ANY($${paramOffset + params.length}::${cast}[])`);
    };

    pushIn("b.id_cabildo", cohort.cabildoIds, "int");
    pushIn("b.region", cohort.regions, "text");
    pushIn("b.genero", cohort.genders, "text");
    pushIn("b.age_group", cohort.ageGroups, "text"); // ✅ use age_group column
    pushIn("b.nivelinstruccion", cohort.niveles, "text");
    pushIn("b.grupoetnico", cohort.etnicos, "text");

    const sql = parts.length ? ` AND ${parts.join(" AND ")}` : "";
    return { sql, params };
}

function parsePgVector(v: any): number[] | null {
    if (!v) return null;

    // pgvector often returns string like "[0.1,0.2,...]"
    if (typeof v === "string") {
        const s = v.trim();
        if (!s.startsWith("[") || !s.endsWith("]")) return null;
        const nums = s.slice(1, -1).split(",").map((x) => Number(x.trim()));
        return nums.every((n) => Number.isFinite(n)) ? nums : null;
    }

    if (Array.isArray(v)) {
        const nums = v.map(Number);
        return nums.every((n) => Number.isFinite(n)) ? nums : null;
    }

    return null;
}

const cosine = (a: number[], b: number[]) => {
    let dot = 0, na = 0, nb = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        na += a[i] * a[i];
        nb += b[i] * b[i];
    }
    return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-12);
};

export const GET = async (req: Request) => {
    try {
        const { searchParams } = new URL(req.url);

        const stationIds = (() => {
            const ids = getMultiInt(searchParams, "stationId");
            const finalIds = (ids.length ? ids : DEFAULT_STATIONS).filter((x) => DEFAULT_STATIONS.includes(x));
            return finalIds.length ? finalIds : DEFAULT_STATIONS;
        })();

        const cohortA = buildCohortFilters(searchParams, "a_");
        const cohortB = buildCohortFilters(searchParams, "b_");

        const baseSql = `
      WITH dedup AS (
        SELECT DISTINCT ON (p.telefono)
          p.id,
          p.telefono,
          p.id_cabildo,
          p.region,
          p.genero,
          p.age_group,
          p.nivelinstruccion,
          p.grupoetnico,
          p.fechacreacion
        FROM participantes p
        WHERE
          p.id_cabildo IS NOT NULL
          AND p.telefono IS NOT NULL
          AND btrim(p.telefono) <> ''
          AND p.telefono <> $1
        ORDER BY p.telefono, p.id DESC
      ),
      base AS (
        SELECT d.*
        FROM dedup d
      ),
      joined AS (
        SELECT
          b.*,
          cp.idcomentario,
          cm.texto AS comentario,
          cm.idestacion,
          e.nombreestacion AS estacion
        FROM base b
        JOIN comentariosparticipantes cp ON cp.idparticipante = b.id
        JOIN comentarios cm ON cm.id = cp.idcomentario
        JOIN estaciones e ON e.id = cm.idestacion
        WHERE cm.idestacion = ANY($2::int[])
          AND cm.texto IS NOT NULL
          AND btrim(cm.texto) <> ''
      )
    `;

        const whereA = buildWhereClause(cohortA, 2);
        const whereB = buildWhereClause(cohortB, 2);

        const sqlA = `
      ${baseSql}
      SELECT
        idcomentario, comentario, idestacion, estacion,
        region, genero, age_group, nivelinstruccion, grupoetnico, id_cabildo
      FROM joined b
      WHERE 1=1
      ${whereA.sql}
      LIMIT 1200
    `;
        const sqlB = `
      ${baseSql}
      SELECT
        idcomentario, comentario, idestacion, estacion,
        region, genero, age_group, nivelinstruccion, grupoetnico, id_cabildo
      FROM joined b
      WHERE 1=1
      ${whereB.sql}
      LIMIT 1200
    `;

        const paramsA = [ADMIN_PHONE, stationIds, ...whereA.params];
        const paramsB = [ADMIN_PHONE, stationIds, ...whereB.params];

        const [resA, resB] = await Promise.all([query(sqlA, paramsA), query(sqlB, paramsB)]);
        const rowsA = resA.rows as Row[];
        const rowsB = resB.rows as Row[];

        if (!rowsA.length || !rowsB.length) {
            return new Response(JSON.stringify({
                error: "No hay suficientes datos para comparar con los filtros seleccionados.",
                cohortA_count: rowsA.length,
                cohortB_count: rowsB.length,
            }), { status: 400, headers: { "Content-Type": "application/json" } });
        }

        const allIds = Array.from(new Set([...rowsA, ...rowsB].map((r) => r.idcomentario)));

        const embRes = await query(
            `
      SELECT idcomentario, embedding
      FROM comentario_embeddings
      WHERE idcomentario = ANY($1::int[])
        AND pipeline_version = $2
        AND model = $3
      `,
            [allIds, EMBEDDING_PIPELINE_VERSION, EMBEDDING_MODEL]
        );

        const embMap = new Map<number, number[]>();
        for (const r of embRes.rows as any[]) {
            const vec = parsePgVector(r.embedding);
            if (vec) embMap.set(r.idcomentario, vec);
        }

        const rowsA_embedded = rowsA.filter((r) => embMap.has(r.idcomentario));
        const rowsB_embedded = rowsB.filter((r) => embMap.has(r.idcomentario));

        if (!rowsA_embedded.length || !rowsB_embedded.length) {
            return new Response(JSON.stringify({
                error: "Not enough embedded comments to compare",
                hint: "Run the embeddings backfill and retry.",
                cohortA_total: rowsA.length,
                cohortB_total: rowsB.length,
                cohortA_embedded: rowsA_embedded.length,
                cohortB_embedded: rowsB_embedded.length,
            }), { status: 409, headers: { "Content-Type": "application/json" } });
        }

        const pickRepresentatives = (rows: Row[], k = 10) => {
            const byStation = new Map<number, Row[]>();
            for (const r of rows) {
                byStation.set(r.idestacion, [...(byStation.get(r.idestacion) ?? []), r]);
            }

            const out: Record<number, { estacion: string; samples: { id: number; text: string }[] }> = {};
            for (const [sid, list] of byStation.entries()) {
                const vectors = list.map((r) => embMap.get(r.idcomentario)!);

                const dim = vectors[0].length;
                const centroid = new Array(dim).fill(0);
                for (const v of vectors) for (let i = 0; i < dim; i++) centroid[i] += v[i];
                for (let i = 0; i < dim; i++) centroid[i] /= vectors.length;

                const ranked = list
                    .map((r, idx) => ({ r, score: cosine(centroid, vectors[idx]) }))
                    .sort((x, y) => y.score - x.score)
                    .slice(0, k)
                    .map((x) => ({ id: x.r.idcomentario, text: String(x.r.comentario).slice(0, 1200) }));

                out[sid] = { estacion: list[0].estacion, samples: ranked };
            }
            return out;
        };

        const repsA = pickRepresentatives(rowsA_embedded, 10);
        const repsB = pickRepresentatives(rowsB_embedded, 10);

        const system = `
Eres un analista. Compara dos cohortes de comentarios de participantes por estación (estación).
Devuelve JSON ESTRICTO. Sin markdown. Sin claves adicionales.
Sé cuidadoso: estos son extractos representativos. No hagas afirmaciones excesivas ni concluyentes.
Las posibles razones deben formularse como hipótesis, no como hechos.
`;

        const user = {
            cohortA_filters: cohortA,
            cohortB_filters: cohortB,
            stations: stationIds,
            cohortA_representative_comments: repsA,
            cohortB_representative_comments: repsB,
            output_schema: {
                summary: "string",
                per_station: [
                    {
                        stationId: "number",
                        stationName: "string",
                        cohortA_tendencies: ["string"],
                        cohortB_tendencies: ["string"],
                        key_differences: ["string"],
                        possible_reasons_hypotheses: ["string"],
                        evidence: {
                            cohortA_examples: ["short quotes <= 200 chars"],
                            cohortB_examples: ["short quotes <= 200 chars"]
                        }
                    }
                ],
                methodology_sources: [
                    { title: "string", url: "string" }
                ],
                limitations: ["string"]
            }
        };

        const completion = await openai_completions(
            "gpt-4.1-mini",
            [
                { role: "system", content: system },
                { role: "user", content: JSON.stringify(user) },
            ],
            { type: "json_object" }
        );

        const content = completion.choices?.[0]?.message?.content ?? "{}";
        const parsed = JSON.parse(content);

        parsed.methodology_sources = [
            { title: "OpenAI text-embedding-3-large model docs", url: "https://platform.openai.com/docs/models/text-embedding-3-large" },
            { title: "BERTopic (Grootendorst) – topic modeling with embeddings", url: "https://arxiv.org/abs/2203.05794" },
            { title: "RAG (Lewis et al., 2020) – retrieval-grounded generation", url: "https://arxiv.org/abs/2005.11401" },
        ];

        return new Response(JSON.stringify({
            cohortA_count: rowsA.length,
            cohortB_count: rowsB.length,
            cohortA_embedded: rowsA_embedded.length,
            cohortB_embedded: rowsB_embedded.length,
            result: parsed
        }), { status: 200, headers: { "Content-Type": "application/json" } });

    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 });
    }
};
