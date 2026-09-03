import { createClient } from "@/lib/supabase/server";

const GEMINI_MODEL = "gemini-3.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

type FeedbackResult = {
    strengths: string;
    weaknesses: string;
    improvement_tips: string;
    star_score: number;
};

type ResponseWithQuestion = {
    id: string;
    response_text: string;
    interview_questions: { question: string } | null;
};

const feedbackSchema = {
    type: "object",
    properties: {
        strengths: { type: "string" },
        weaknesses: { type: "string" },
        improvement_tips: { type: "string" },
        star_score: { type: "integer" },
    },
    required: ["strengths", "weaknesses", "improvement_tips", "star_score"],
};

async function callGemini(question: string, answer: string): Promise<FeedbackResult> {
    const prompt = `You are an expert interview coach reviewing a candidate's answer.

Question: ${question}

Candidate's Answer: ${answer}

Evaluate the answer on clarity, relevance, and depth. Give specific, actionable feedback — not generic advice. Score from 1 to 5 stars.`;

    const res = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: feedbackSchema,
            },
        }),
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Gemini API error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
        throw new Error("Gemini returned an empty response");
    }

    const parsed = JSON.parse(text) as FeedbackResult;

    // Guard against the model so doesnt go outside the expected range
    parsed.star_score = Math.min(5, Math.max(1, Math.round(parsed.star_score)));

    return parsed;
}


// Generates AI feedback for every response in a session that doesn't
// already have feedback, and stores the results in the `feedback` table.


export async function generateSessionFeedback(sessionId: string, userId: string) {
    const supabase = await createClient();

    const { data: responses, error: respErr } = await supabase
        .from("responses")
        .select(`
            id,
            response_text,
            interview_questions ( question )
        `)
        .eq("session_id", sessionId)
        .returns<ResponseWithQuestion[]>();

    if (respErr) {
        throw new Error(respErr.message);
    }

    if (!responses || responses.length === 0) {
        return { generated: 0, skipped: 0, failed: 0 };
    }

    // Skip responses that already have feedback
    const { data: existingFeedback } = await supabase
        .from("feedback")
        .select("response_id")
        .in("response_id", responses.map((r) => r.id));

    const alreadyDone = new Set((existingFeedback ?? []).map((f) => f.response_id));
    const pending = responses.filter((r) => !alreadyDone.has(r.id));

    if (pending.length === 0) {
        return { generated: 0, skipped: responses.length, failed: 0 };
    }

    const results = await Promise.allSettled(
        pending.map(async (r) => {
            const questionText = r.interview_questions?.question ?? "Unknown question";
            const feedback = await callGemini(questionText, r.response_text);

            const { error: insertErr } = await supabase.from("feedback").insert({
                response_id: r.id,
                user_id: userId,
                strengths: feedback.strengths,
                weaknesses: feedback.weaknesses,
                improvement_tips: feedback.improvement_tips,
                star_score: feedback.star_score,
            });

            if (insertErr) throw insertErr;
        })
    );

    const failed = results.filter((r) => r.status === "rejected").length;

    if (failed > 0) {
        console.error(
            "Feedback generation failures:",
            results.filter((r) => r.status === "rejected")
        );
    }

    return {
        generated: pending.length - failed,
        skipped: alreadyDone.size,
        failed,
    };
}