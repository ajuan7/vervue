import { after } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { generateSessionFeedback } from "@/lib/interview/generateFeedback";

// Mark session complete and grades it in the background so the user
// isn't kept waiting on the AI calls. 
export async function completeSession(supabase: SupabaseClient, sessionId: string, userId: string) {
    const { data, error } = await supabase
        .from("interview_sessions")
        .update({ completed_at: new Date().toISOString() })
        .eq("id", sessionId)
        .eq("user_id", userId)
        .is("completed_at", null)
        .select("id");

    if (error) {
        console.error("COMPLETE ERROR:", error);
        return;
    }

    // Only the request that actually completed the session starts grading
    if (data && data.length > 0) {
        after(async () => {
            try {
                await generateSessionFeedback(sessionId, userId, supabase);
            } catch (err) {
                console.error("FEEDBACK GENERATION ERROR:", err);
            }
        });
    }
}