import type { SupabaseClient } from "@supabase/supabase-js";

export async function recordAnswer(
    supabase: SupabaseClient,
    params: { sessionId: string; userId: string; questionId: string; text: string }
) {
    const { sessionId, userId, questionId, text } = params;

    // Answers are final so if a row already exists, don't overwrite it
    const { data: existing } = await supabase
        .from("responses")
        .select("id")
        .eq("session_id", sessionId)
        .eq("question_id", questionId)
        .maybeSingle();

    if (!existing) {
        const { error } = await supabase.from("responses").insert({
            session_id: sessionId,
            question_id: questionId,
            user_id: userId,
            response_text: text,
        });

        if (error) return { error };
    }

    // Start the clock for the next question    
    const { error: clockErr } = await supabase
        .from("interview_sessions")
        .update({ question_started_at: new Date().toISOString() })
        .eq("id", sessionId)
        .is("completed_at", null);

    if (clockErr) console.error("CLOCK RESET ERROR:", clockErr);

    return { error: null };
}