import { query } from "@/lib/db";

export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);

        const questionId = searchParams.get("questionId");
        const optionId = searchParams.get("optionId");
        const age = searchParams.get("age");
        const gender = searchParams.get("gender");
        const page = Math.max(1, Number(searchParams.get("page") ?? 1));
        const pageSize = Math.min(100, Math.max(5, Number(searchParams.get("pageSize") ?? 20)));
        const offset = (page - 1) * pageSize;

        const qId = questionId && /^\d+$/.test(questionId) ? Number(questionId) : null;
        const oId = optionId && /^\d+$/.test(optionId) ? Number(optionId) : null;
        const ageStr = age ? String(age).trim() : "";
        const genderStr = gender ? String(gender).trim() : "";

        const where: string[] = [];
        const params: any[] = [];

        const add = (cond: string, val: any) => {
            params.push(val);
            where.push(cond.replace("$$", `$${params.length}`));
        };

        if (qId) add(`r.question_id = $$::int`, qId);
        if (oId) add(`r.option_id = $$::int`, oId);
        if (ageStr) add(`r.age_group = $$::text`, ageStr);
        if (genderStr) add(`r.gender = $$::text`, genderStr);

        const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

        const totalRes = await query(
            `SELECT COUNT(*)::int AS total FROM dark_room_responses r ${whereSql}`,
            params
        );

        const rowsRes = await query(
            `
      SELECT
        r.created_at::text AS created_at,
        r.question_id,
        q.question_text,
        r.option_id,
        o.option_text,
        COALESCE(NULLIF(btrim(r.age_group),''),'No especifica') AS age_group,
        COALESCE(NULLIF(btrim(r.gender),''),'No especifica') AS gender
      FROM dark_room_responses r
      JOIN dark_room_questions q ON q.id = r.question_id
      JOIN dark_room_options o ON o.id = r.option_id
      ${whereSql}
      ORDER BY r.created_at DESC
      LIMIT ${pageSize} OFFSET ${offset}
      `,
            params
        );

        return new Response(
            JSON.stringify({
                total: totalRes.rows?.[0]?.total ?? 0,
                rows: rowsRes.rows ?? [],
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
