import { createClient } from "@supabase/supabase-js";
import { callGemini } from "./gemini.js";

type ResponseWithQuestion = {
    id: string;
    response_text: string;
    interview_questions: { question: string } | null;
};

function getSupabase() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
        throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }
    return createClient(url, key, { auth: { persistSession: false } });
}

export async function gradeSession(sessionId: string) {
    const supabase = getSupabase();

    // The owner comes from the database, never from the request
    const { data: session, error: sessionErr } = await supabase
        .from("interview_sessions")
        .select("role, user_id, completed_at")
        .eq("id", sessionId)
        .single();

    if (sessionErr || !session) {
        throw new Error(sessionErr?.message ?? "Session not found");
    }

    if (!session.completed_at) {
        throw new Error("Session is not completed yet");
    }

    const { data: responses, error: respErr } = await supabase
        .from("responses")
        .select("id, response_text, interview_questions ( question )")
        .eq("session_id", sessionId)
        .returns<ResponseWithQuestion[]>();

    if (respErr) throw new Error(respErr.message);
    if (!responses || responses.length === 0) {
        return { generated: 0, skipped: 0, failed: 0 };
    }

    const { data: existing } = await supabase
        .from("feedback")
        .select("response_id")
        .in("response_id", responses.map((r) => r.id));

    const done = new Set((existing ?? []).map((f) => f.response_id));
    const pending = responses.filter((r) => !done.has(r.id));

    const results = await Promise.allSettled(
        pending.map(async (r) => {
            const question = r.interview_questions?.question ?? "Unknown question";
            const fb = await callGemini(question, r.response_text, session.role);

            const { error } = await supabase.from("feedback").insert({
                response_id: r.id,
                user_id: session.user_id,
                strengths: fb.strengths.join("\n"),
                weaknesses: fb.weaknesses.join("\n"),
                improvement_tips: fb.improvement_tips.join("\n"),
                star_score: fb.star_score,
            });

            // 23505 = already graded, which is fine when a job is retried
            if (error && error.code !== "23505") throw error;
        })
    );

    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length > 0) console.error("Grading failures:", failed);

    return {
        generated: pending.length - failed.length,
        skipped: done.size,
        failed: failed.length,
    };
}