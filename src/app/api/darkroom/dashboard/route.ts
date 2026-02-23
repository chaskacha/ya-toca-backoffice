// app/api/darkroom/dashboard/route.ts
import { query } from "@/lib/db";

type PivotCell = { count: number; pct: number };
type PivotRow = {
  questionId: number;
  questionText: string;
  optionId: number;
  optionText: string;
  cells: Record<string, Record<string, PivotCell>>; // cells[gender][age]
  total: number;
  totalPct: number;
};

type TwoOptMeta = {
  aOptionId: number;
  bOptionId: number;
  aLabel: string;
  bLabel: string;
};

type TwoOptSegRow = { label: string; a: number; b: number };

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);

    const regionId = searchParams.get("regionId");
    const questionId = searchParams.get("questionId");
    const optionId = searchParams.get("optionId");
    const age = searchParams.get("age");
    const gender = searchParams.get("gender");

    const regionIdInt = regionId && /^\d+$/.test(regionId) ? Number(regionId) : null;
    const questionIdInt = questionId && /^\d+$/.test(questionId) ? Number(questionId) : null;
    const optionIdInt = optionId && /^\d+$/.test(optionId) ? Number(optionId) : null;

    const ageStr = age ? String(age).trim() : "";
    const genderStr = gender ? String(gender).trim() : "";

    // -----------------------------
    // 1) Main breakdowns
    //   NOTE: normalize gender here too so charts group properly
    // -----------------------------
    const sqlBreakdowns = `
      WITH base AS (
        SELECT
          r.id,
          r.question_id,
          r.option_id,
          COALESCE(NULLIF(btrim(r.age_group), ''), 'No especifica') AS age_group,
          CASE
            WHEN lower(COALESCE(NULLIF(btrim(r.gender), ''), 'No especifica')) IN ('h','masculino','male','m') THEN 'Masculino'
            WHEN lower(COALESCE(NULLIF(btrim(r.gender), ''), 'No especifica')) IN ('f','femenino','female') THEN 'Femenino'
            WHEN lower(COALESCE(NULLIF(btrim(r.gender), ''), 'No especifica')) IN (
              'o','otro','other',
              'prefiero no indicar','prefiero no decir','prefiero no responder','prefiero no especificar',
              'no indica','no indicar'
            ) THEN 'Otro'
            WHEN COALESCE(NULLIF(btrim(r.gender), ''), 'No especifica') = 'No especifica' THEN 'No especifica'
            ELSE COALESCE(NULLIF(btrim(r.gender), ''), 'No especifica')
          END AS gender
        FROM dark_room_responses r
        WHERE
          ($1::int IS NULL OR r.id_region = $1::int)
          AND ($2::int IS NULL OR r.question_id = $2::int)
          AND ($3::int IS NULL OR r.option_id = $3::int)
          AND ($4::text = '' OR COALESCE(NULLIF(btrim(r.age_group), ''), 'No especifica') = $4::text)
          AND ($5::text = '' OR (
              CASE
                WHEN lower(COALESCE(NULLIF(btrim(r.gender), ''), 'No especifica')) IN ('h','masculino','male','m') THEN 'Masculino'
                WHEN lower(COALESCE(NULLIF(btrim(r.gender), ''), 'No especifica')) IN ('f','femenino','female') THEN 'Femenino'
                WHEN lower(COALESCE(NULLIF(btrim(r.gender), ''), 'No especifica')) IN (
                  'o','otro','other',
                  'prefiero no indicar','prefiero no decir','prefiero no responder','prefiero no especificar',
                  'no indica','no indicar'
                ) THEN 'Otro'
                WHEN COALESCE(NULLIF(btrim(r.gender), ''), 'No especifica') = 'No especifica' THEN 'No especifica'
                ELSE COALESCE(NULLIF(btrim(r.gender), ''), 'No especifica')
              END
          ) = $5::text)
      )
      SELECT
        (SELECT COUNT(*)::int FROM base) AS total_responses,

        (SELECT COALESCE(jsonb_object_agg(k, v), '{}'::jsonb)
         FROM (
           SELECT age_group AS k, COUNT(*)::int AS v
           FROM base
           GROUP BY age_group
           ORDER BY COUNT(*) DESC
         ) t
        ) AS age_breakdown,

        (SELECT COALESCE(jsonb_object_agg(k, v), '{}'::jsonb)
         FROM (
           SELECT gender AS k, COUNT(*)::int AS v
           FROM base
           GROUP BY gender
           ORDER BY COUNT(*) DESC
         ) t
        ) AS gender_breakdown,

        (SELECT COALESCE(jsonb_object_agg(k, v), '{}'::jsonb)
         FROM (
           SELECT (q.question_text) AS k, COUNT(*)::int AS v
           FROM base b
           JOIN dark_room_questions q ON q.id = b.question_id
           GROUP BY q.question_text
           ORDER BY COUNT(*) DESC
         ) t
        ) AS responses_by_question,

        (SELECT COALESCE(jsonb_object_agg(k, v), '{}'::jsonb)
         FROM (
           SELECT (o.option_text) AS k, COUNT(*)::int AS v
           FROM base b
           JOIN dark_room_options o ON o.id = b.option_id
           GROUP BY o.option_text
           ORDER BY COUNT(*) DESC
         ) t
        ) AS responses_by_option
      ;
    `;

    const res1 = await query(sqlBreakdowns, [regionIdInt, questionIdInt, optionIdInt, ageStr, genderStr]);
    const row1 = res1.rows?.[0];
    const totalResponses: number = row1?.total_responses ?? 0;

    // -----------------------------
    // 2) Pivot data
    //   NOTE: normalize gender_code here too (merge "Prefiero no indicar" => "Otro")
    // -----------------------------
    const sqlPivot = `
      WITH base AS (
        SELECT
          r.question_id,
          r.option_id,
          COALESCE(NULLIF(btrim(r.age_group), ''), 'No especifica') AS age_group_raw,
          COALESCE(NULLIF(btrim(r.gender), ''), 'No especifica') AS gender_raw
        FROM dark_room_responses r
        WHERE
          ($1::int IS NULL OR r.id_region = $1::int)
          AND ($2::int IS NULL OR r.question_id = $2::int)
          AND ($3::int IS NULL OR r.option_id = $3::int)
          AND ($4::text = '' OR COALESCE(NULLIF(btrim(r.age_group), ''), 'No especifica') = $4::text)
          AND ($5::text = '' OR (
              CASE
                WHEN lower(COALESCE(NULLIF(btrim(r.gender), ''), 'No especifica')) IN ('h','masculino','male','m') THEN 'Masculino'
                WHEN lower(COALESCE(NULLIF(btrim(r.gender), ''), 'No especifica')) IN ('f','femenino','female') THEN 'Femenino'
                WHEN lower(COALESCE(NULLIF(btrim(r.gender), ''), 'No especifica')) IN (
                  'o','otro','other',
                  'prefiero no indicar','prefiero no decir','prefiero no responder','prefiero no especificar',
                  'no indica','no indicar'
                ) THEN 'Otro'
                WHEN COALESCE(NULLIF(btrim(r.gender), ''), 'No especifica') = 'No especifica' THEN 'No especifica'
                ELSE COALESCE(NULLIF(btrim(r.gender), ''), 'No especifica')
              END
          ) = $5::text)
      ),
      norm AS (
        SELECT
          b.question_id,
          b.option_id,
          b.age_group_raw AS age_group,
          CASE
            WHEN lower(b.gender_raw) IN ('h','masculino','male','m') THEN 'Masculino'
            WHEN lower(b.gender_raw) IN ('f','femenino','female') THEN 'Femenino'
            WHEN lower(b.gender_raw) IN (
              'o','otro','other',
              'prefiero no indicar','prefiero no decir','prefiero no responder','prefiero no especificar',
              'no indica','no indicar'
            ) THEN 'Otro'
            WHEN b.gender_raw = 'No especifica' THEN 'No especifica'
            ELSE b.gender_raw
          END AS gender_code
        FROM base b
      )
      SELECT
        n.question_id,
        q.question_text,
        n.option_id,
        o.option_text,
        n.gender_code,
        n.age_group,
        COUNT(*)::int AS cnt
      FROM norm n
      JOIN dark_room_questions q ON q.id = n.question_id
      JOIN dark_room_options o ON o.id = n.option_id
      GROUP BY
        n.question_id, q.question_text,
        n.option_id, o.option_text,
        n.gender_code, n.age_group
      ORDER BY
        n.question_id ASC,
        n.option_id ASC,
        n.gender_code ASC,
        n.age_group ASC
    `;

    const res2 = await query(sqlPivot, [regionIdInt, questionIdInt, optionIdInt, ageStr, genderStr]);

    const pivotFlat: {
      question_id: number;
      question_text: string;
      option_id: number;
      option_text: string;
      gender_code: string;
      age_group: string;
      cnt: number;
    }[] = res2.rows ?? [];

    const genderSet = new Set<string>();
    const ageSet = new Set<string>();

    for (const r of pivotFlat) {
      genderSet.add(r.gender_code);
      ageSet.add(r.age_group);
    }

    const preferredGenders = ["Masculino", "Femenino", "Otro", "No especifica"];
    const preferredAges = ["15-", "16-29", "30-45", "46+", "No especifica"];

    const genders = preferredGenders
      .filter((g) => genderSet.has(g))
      .concat([...genderSet].filter((g) => !preferredGenders.includes(g)));

    const ageGroups = preferredAges
      .filter((a) => ageSet.has(a))
      .concat([...ageSet].filter((a) => !preferredAges.includes(a)));

    const colTotals: Record<string, Record<string, number>> = {};
    for (const g of genders) colTotals[g] = {};
    for (const g of genders) for (const a of ageGroups) colTotals[g][a] = 0;

    for (const r of pivotFlat) {
      if (!colTotals[r.gender_code]) colTotals[r.gender_code] = {};
      if (colTotals[r.gender_code][r.age_group] == null) colTotals[r.gender_code][r.age_group] = 0;
      colTotals[r.gender_code][r.age_group] += Number(r.cnt || 0);
    }

    const rowMap = new Map<string, PivotRow>();

    const ensureCell = (pr: PivotRow, g: string, a: string) => {
      if (!pr.cells[g]) pr.cells[g] = {};
      if (!pr.cells[g][a]) pr.cells[g][a] = { count: 0, pct: 0 };
    };

    for (const r of pivotFlat) {
      const key = `${r.question_id}::${r.option_id}`;
      let pr = rowMap.get(key);

      if (!pr) {
        pr = {
          questionId: r.question_id,
          questionText: r.question_text,
          optionId: r.option_id,
          optionText: r.option_text,
          cells: {},
          total: 0,
          totalPct: 0,
        };
        rowMap.set(key, pr);
      }

      const g = r.gender_code;
      const a = r.age_group;
      const count = Number(r.cnt || 0);

      ensureCell(pr, g, a);
      pr.cells[g][a].count += count;
      pr.total += count;
    }

    const grandTotal =
      totalResponses || [...rowMap.values()].reduce((acc, r) => acc + (r.total || 0), 0) || 0;

    for (const pr of rowMap.values()) {
      pr.totalPct = grandTotal ? (pr.total / grandTotal) * 100 : 0;

      for (const g of Object.keys(pr.cells)) {
        for (const a of Object.keys(pr.cells[g])) {
          const denom = Number(colTotals?.[g]?.[a] ?? 0) || 0;
          const c = pr.cells[g][a].count || 0;
          pr.cells[g][a].pct = denom ? (c / denom) * 100 : 0;
        }
      }
    }

    const pivotRows = [...rowMap.values()];
    pivotRows.sort((a, b) => {
      if (a.questionId !== b.questionId) return a.questionId - b.questionId;
      return (b.total ?? 0) - (a.total ?? 0);
    });

    // -----------------------------
    // 3) Two-options segmentation (A vs B)
    // Only when questionId is selected and optionId NOT selected.
    // -----------------------------
    let twoOptionsMeta: TwoOptMeta | null = null;
    let twoOptionsSegments: Record<string, TwoOptSegRow[]> | null = null;

    if (questionIdInt && !optionIdInt) {
      const optRes = await query(
        `
        SELECT id, option_text
        FROM dark_room_options
        WHERE question_id = $1
        ORDER BY id ASC
        `,
        [questionIdInt]
      );

      const opts = optRes.rows ?? [];

      if (opts.length >= 2) {
        const a = opts[0];
        const b = opts[1];

        twoOptionsMeta = {
          aOptionId: Number(a.id),
          bOptionId: Number(b.id),
          aLabel: String(a.option_text),
          bLabel: String(b.option_text),
        };

        const segRes = await query(
          `
          WITH base AS (
            SELECT
              r.option_id,
              CASE
                WHEN lower(COALESCE(NULLIF(btrim(r.gender), ''), 'No especifica')) IN ('h','masculino','male','m') THEN 'Masculino'
                WHEN lower(COALESCE(NULLIF(btrim(r.gender), ''), 'No especifica')) IN ('f','femenino','female') THEN 'Femenino'
                WHEN lower(COALESCE(NULLIF(btrim(r.gender), ''), 'No especifica')) IN (
                  'o','otro','other',
                  'prefiero no indicar','prefiero no decir','prefiero no responder','prefiero no especificar',
                  'no indica','no indicar'
                ) THEN 'Otro'
                WHEN COALESCE(NULLIF(btrim(r.gender), ''), 'No especifica') = 'No especifica' THEN 'No especifica'
                ELSE COALESCE(NULLIF(btrim(r.gender), ''), 'No especifica')
              END AS gender,
              COALESCE(NULLIF(btrim(r.age_group),''),'No especifica') AS age_group,
              COALESCE(reg.nombreregion, 'Sin región') AS region
            FROM dark_room_responses r
            LEFT JOIN regiones reg ON reg.id = r.id_region
            WHERE r.question_id = $1
              AND r.option_id IN ($2, $3)
              AND ($4::int IS NULL OR r.id_region = $4::int)
              AND ($5::text = '' OR COALESCE(NULLIF(btrim(r.age_group),''),'No especifica') = $5::text)
              AND ($6::text = '' OR (
                CASE
                  WHEN lower(COALESCE(NULLIF(btrim(r.gender), ''), 'No especifica')) IN ('h','masculino','male','m') THEN 'Masculino'
                  WHEN lower(COALESCE(NULLIF(btrim(r.gender), ''), 'No especifica')) IN ('f','femenino','female') THEN 'Femenino'
                  WHEN lower(COALESCE(NULLIF(btrim(r.gender), ''), 'No especifica')) IN (
                    'o','otro','other',
                    'prefiero no indicar','prefiero no decir','prefiero no responder','prefiero no especificar',
                    'no indica','no indicar'
                  ) THEN 'Otro'
                  WHEN COALESCE(NULLIF(btrim(r.gender), ''), 'No especifica') = 'No especifica' THEN 'No especifica'
                  ELSE COALESCE(NULLIF(btrim(r.gender), ''), 'No especifica')
                END
              ) = $6::text)
          )
          SELECT
            gender,
            age_group,
            region,
            SUM(CASE WHEN option_id = $2 THEN 1 ELSE 0 END)::int AS a,
            SUM(CASE WHEN option_id = $3 THEN 1 ELSE 0 END)::int AS b
          FROM base
          GROUP BY gender, age_group, region
          `,
          [questionIdInt, twoOptionsMeta.aOptionId, twoOptionsMeta.bOptionId, regionIdInt, ageStr, genderStr]
        );

        const cubeRows = segRes.rows ?? [];

        const build = (groupBy: Array<"gender" | "age_group" | "region">): TwoOptSegRow[] => {
          const map: Record<string, { a: number; b: number }> = {};

          for (const r of cubeRows) {
            const key = groupBy.map((k) => String((r as any)[k] ?? "")).join(" · ");
            if (!map[key]) map[key] = { a: 0, b: 0 };
            map[key].a += Number((r as any).a ?? 0);
            map[key].b += Number((r as any).b ?? 0);
          }

          return Object.entries(map)
            .map(([label, v]) => ({ label, a: v.a, b: v.b }))
            .sort((x, y) => y.a + y.b - (x.a + x.b));
        };

        twoOptionsSegments = {
          gender: build(["gender"]),
          age: build(["age_group"]),
          region: build(["region"]),
          gender_age: build(["gender", "age_group"]),
          gender_region: build(["gender", "region"]),
          age_region: build(["age_group", "region"]),
          gender_age_region: build(["gender", "age_group", "region"]),
        };
      }
    }

    return new Response(
      JSON.stringify({
        totalResponses,
        breakdown: {
          age: row1?.age_breakdown ?? {},
          gender: row1?.gender_breakdown ?? {},
          byQuestion: row1?.responses_by_question ?? {},
          byOption: row1?.responses_by_option ?? {},
          pivot: {
            genders,
            ageGroups,
            rows: pivotRows,
            totals: {
              colTotals,
              grandTotal,
            },
          },
        },
        twoOptionsMeta,
        twoOptionsSegments,
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