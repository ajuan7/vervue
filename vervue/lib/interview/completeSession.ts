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
    // Using the GC grader URL, post with session ID
    if (data && data.length > 0) {
        after(async () => {
            const graderUrl = process.env.GRADER_URL;

            // No grader configured: grade inside the app, as before
            if (!graderUrl) {
                try {
                    await generateSessionFeedback(sessionId, userId, supabase);
                } catch (err) {
                    console.error("FEEDBACK GENERATION ERROR:", err);
                }
                return;
            }

            try {
                const res = await fetch(`${graderUrl}/grade`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-grader-secret": process.env.GRADER_SECRET ?? "",
                    },
                    body: JSON.stringify({ sessionId }),
                    signal: AbortSignal.timeout(55_000),
                });

                if (!res.ok) {
                    console.error("GRADER ERROR", res.status, await res.text());
                }
            } catch (err) {
                console.error("GRADER REQUEST FAILED", err);
            }
        });
    }
}