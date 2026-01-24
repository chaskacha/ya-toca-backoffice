// app/api/darkroom/dashboard/route.ts
import { query } from "@/lib/db";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);

    const questionId = searchParams.get("questionId");
    const age = searchParams.get("age");
    const gender = searchParams.get("gender");

    const questionIdInt = questionId && /^\d+$/.test(questionId) ? Number(questionId) : null;
    const ageStr = age ? String(age).trim() : "";
    const genderStr = gender ? String(gender).trim() : "";

    const sql = `
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
          AND ($2::text = '' OR COALESCE(NULLIF(btrim(r.age_group), ''), 'No especifica') = $2::text)
          AND ($3::text = '' OR COALESCE(NULLIF(btrim(r.gender), ''), 'No especifica') = $3::text)
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

    const res = await query(sql, [questionIdInt, ageStr, genderStr]);
    const row = res.rows?.[0];

    return new Response(
      JSON.stringify({
        totalResponses: row?.total_responses ?? 0,
        breakdown: {
          age: row?.age_breakdown ?? {},
          gender: row?.gender_breakdown ?? {},
          byQuestion: row?.responses_by_question ?? {},
          byOption: row?.responses_by_option ?? {},
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
