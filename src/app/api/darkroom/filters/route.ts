// app/api/darkroom/filters/route.ts
import { query } from "@/lib/db";

function uniqClean(arr: any[]) {
    return Array.from(
        new Set(
            (arr ?? [])
                .map((x) => String(x ?? "").trim())
                .filter(Boolean)
        )
    );
}

export const GET = async () => {
    try {
        const qRes = await query(
            `
      SELECT id, question_text
      FROM dark_room_questions
      ORDER BY id ASC
      `
        );

        const oRes = await query(
            `
      SELECT id, question_id, option_text
      FROM dark_room_options
      ORDER BY question_id ASC, id ASC
      `
        );

        // ✅ NEW: get age groups + genders (for compare modal)
        const fRes = await query(
            `
      SELECT
        array_agg(DISTINCT age_group) AS age_groups,
        array_agg(DISTINCT gender)    AS genders
      FROM dark_room_responses
      WHERE age_group IS NOT NULL AND btrim(age_group) <> ''
        AND gender IS NOT NULL AND btrim(gender) <> ''
      `
        );

        const questions = (qRes.rows ?? []).map((q: any) => ({
            id: Number(q.id),
            text: String(q.question_text),
        }));

        const options = (oRes.rows ?? []).map((o: any) => ({
            id: Number(o.id),
            question_id: Number(o.question_id),
            text: String(o.option_text),
        }));

        // Group options per question (easy for the UI)
        const optionsByQuestion: Record<number, typeof options> = {};
        for (const opt of options) {
            optionsByQuestion[opt.question_id] = [...(optionsByQuestion[opt.question_id] ?? []), opt];
        }

        const row = (fRes.rows?.[0] ?? {}) as any;
        const ageGroups = uniqClean(row.age_groups);
        const genders = uniqClean(row.genders);

        return new Response(
            JSON.stringify({
                questions,
                optionsByQuestion,
                ageGroups,
                genders,
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
