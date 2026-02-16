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

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);

    const questionId = searchParams.get("questionId");
    const optionId = searchParams.get("optionId");
    const age = searchParams.get("age");
    const gender = searchParams.get("gender");

    const questionIdInt = questionId && /^\d+$/.test(questionId) ? Number(questionId) : null;
    const optionIdInt = optionId && /^\d+$/.test(optionId) ? Number(optionId) : null;

    const ageStr = age ? String(age).trim() : "";
    const genderStr = gender ? String(gender).trim() : "";

    // -----------------------------
    // 1) Main breakdowns (same as you had, + optionId filter)
    // -----------------------------
    const sqlBreakdowns = `
      WITH base AS (
        SELECT
          r.id,
          r.question_id,
          r.option_id,
          COALESCE(NULLIF(btrim(r.age_group), ''), 'No especifica') AS age_group,
          COALESCE(NULLIF(btrim(r.gender), ''), 'No especifica') AS gender
        FROM dark_room_responses r
        WHERE
          ($1::int IS NULL OR r.question_id = $1::int)
          AND ($2::int IS NULL OR r.option_id = $2::int)
          AND ($3::text = '' OR COALESCE(NULLIF(btrim(r.age_group), ''), 'No especifica') = $3::text)
          AND ($4::text = '' OR COALESCE(NULLIF(btrim(r.gender), ''), 'No especifica') = $4::text)
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

    const res1 = await query(sqlBreakdowns, [questionIdInt, optionIdInt, ageStr, genderStr]);
    const row = res1.rows?.[0];

    const totalResponses: number = row?.total_responses ?? 0;

    // -----------------------------
    // 2) Pivot data (Pregunta + Opción + Género/Edad)
    //    % is calculated per column (gender+age), like your Excel.
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
          ($1::int IS NULL OR r.question_id = $1::int)
          AND ($2::int IS NULL OR r.option_id = $2::int)
          AND ($3::text = '' OR COALESCE(NULLIF(btrim(r.age_group), ''), 'No especifica') = $3::text)
          AND ($4::text = '' OR COALESCE(NULLIF(btrim(r.gender), ''), 'No especifica') = $4::text)
      ),
      norm AS (
        SELECT
          b.question_id,
          b.option_id,
          -- Normalize age groups (keep your DB values; you can adjust mapping here if needed)
          b.age_group_raw AS age_group,

          -- Normalize gender into H/M/O (fallback keeps original text)
          CASE
            WHEN lower(b.gender_raw) IN ('h', 'Masculino', 'male', 'm') THEN 'Masculino'
            WHEN lower(b.gender_raw) IN ('f', 'Femenino', 'female') THEN 'Femenino'
            WHEN lower(b.gender_raw) IN ('o', 'Otro', 'other', 'Prefiero no indicar', 'prefiero no decir') THEN 'Otro'
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

    const res2 = await query(sqlPivot, [questionIdInt, optionIdInt, ageStr, genderStr]);
    const pivotFlat: {
      question_id: number;
      question_text: string;
      option_id: number;
      option_text: string;
      gender_code: string;
      age_group: string;
      cnt: number;
    }[] = res2.rows ?? [];

    // Build genders + ageGroups lists
    const genderSet = new Set<string>();
    const ageSet = new Set<string>();

    for (const r of pivotFlat) {
      genderSet.add(r.gender_code);
      ageSet.add(r.age_group);
    }

    // Prefer standard order if present
    const preferredGenders = ["Masculino", "Femenino", "Otro", "No especifica"];
    const preferredAges = ["16-29", "30-45", "46+", "No especifica"];

    const genders = preferredGenders.filter((g) => genderSet.has(g)).concat(
      [...genderSet].filter((g) => !preferredGenders.includes(g))
    );

    const ageGroups = preferredAges.filter((a) => ageSet.has(a)).concat(
      [...ageSet].filter((a) => !preferredAges.includes(a))
    );

    // Column totals: colTotals[gender][age] = total count in that column
    const colTotals: Record<string, Record<string, number>> = {};
    for (const g of genders) colTotals[g] = {};
    for (const g of genders) for (const a of ageGroups) colTotals[g][a] = 0;

    for (const r of pivotFlat) {
      if (!colTotals[r.gender_code]) colTotals[r.gender_code] = {};
      if (colTotals[r.gender_code][r.age_group] == null) colTotals[r.gender_code][r.age_group] = 0;
      colTotals[r.gender_code][r.age_group] += Number(r.cnt || 0);
    }

    // Row building
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

    const grandTotal = totalResponses || [...rowMap.values()].reduce((acc, r) => acc + (r.total || 0), 0) || 0;

    // Compute pct per cell (within the column gender+age), and totalPct per row
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

    // Optional: sort by question then by total desc
    pivotRows.sort((a, b) => {
      if (a.questionId !== b.questionId) return a.questionId - b.questionId;
      return (b.total ?? 0) - (a.total ?? 0);
    });

    return new Response(
      JSON.stringify({
        totalResponses,
        breakdown: {
          age: row?.age_breakdown ?? {},
          gender: row?.gender_breakdown ?? {},
          byQuestion: row?.responses_by_question ?? {},
          byOption: row?.responses_by_option ?? {},
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
