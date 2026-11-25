const GEMINI_MODEL = "gemini-3.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export type FeedbackResult = {
    strengths: string[];
    weaknesses: string[];
    improvement_tips: string[];
    star_score: number;
};

const bulletList = { type: "array", items: { type: "string" }, minItems: 1, maxItems: 4 };

const feedbackSchema = {
    type: "object",
    properties: {
        strengths: bulletList,
        weaknesses: bulletList,
        improvement_tips: bulletList,
        star_score: { type: "integer" },
    },
    required: ["strengths", "weaknesses", "improvement_tips", "star_score"],
};

function getRubric(role: string): string {
    if (role === "Behavioural") {
        return `Evaluate the answer against the STAR structure (Situation, Task, Action, Result). Say which parts are missing or weak. Check that the answer is about the candidate's own actions ("I", not "we") and that the result is specific or measurable. A vague answer with no clear result should score 2 or lower. Score from 1 to 5 stars.`;
    }

    return `Evaluate the answer on clarity, relevance, and depth. Score from 1 to 5 stars.`;
}

export async function callGemini(
    question: string,
    answer: string,
    role: string
): Promise<FeedbackResult> {
    const prompt = `You are an expert interview coach reviewing a candidate's answer.

Question: ${question}

Candidate's Answer: ${answer}

${getRubric(role)}

Give specific, actionable feedback, not generic advice. Write strengths, weaknesses and improvement tips as 2 to 4 short bullet points each. One idea per bullet, under 25 words, no numbering.`;

    const res = await fetch(GEMINI_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": process.env.GEMINI_API_KEY ?? "",
        },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: feedbackSchema,
            },
        }),
        signal: AbortSignal.timeout(45_000),
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
    parsed.star_score = Math.min(5, Math.max(1, Math.round(parsed.star_score)));

    return parsed;
}