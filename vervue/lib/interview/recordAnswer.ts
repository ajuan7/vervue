import type { SupabaseClient } from "@supabase/supabase-js";

export async function recordAnswer(
    supabase: SupabaseClient,
    params: { sessionId: string; userId: string; questionId: string; text: string }
) {
    const { sessionId, userId, questionId, text } = params;

    // Answers are final. The unique(session_id, question_id) rule stops a double
    // submit from saving twice, and 23505 just means it is already answered
    const { error } = await supabase.from("responses").insert({
        session_id: sessionId,
        question_id: questionId,
        user_id: userId,
        response_text: text,
    });

    if (error && error.code !== "23505") return { error };

    // Start the clock for the next question    
    const { error: clockErr } = await supabase
        .from("interview_sessions")
        .update({ question_started_at: new Date().toISOString() })
        .eq("id", sessionId)
        .is("completed_at", null);

    if (clockErr) console.error("CLOCK RESET ERROR:", clockErr);

    return { error: null };
}