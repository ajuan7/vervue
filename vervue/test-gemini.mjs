const GEMINI_MODEL = "gemini-3.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

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

const question = "Tell me about a time you handled a difficult teammate.";
const answer =
    "There was a guy on my team who kept missing deadlines. I just started doing his work for him because it was easier than dealing with it.";

const prompt = `You are an expert interview coach reviewing a candidate's answer.

Question: ${question}

Candidate's Answer: ${answer}

Evaluate the answer on clarity, relevance, and depth. Give specific, actionable feedback — not generic advice. Score from 1 to 5 stars.`;

async function main() {
    if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is not set in the environment. Aborting.");
        process.exit(1);
    }

    console.log(`Calling ${GEMINI_MODEL}...\n`);

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

    console.log(`Status: ${res.status} ${res.statusText}`);

    if (!res.ok) {
        const errText = await res.text();
        console.error("\nRaw error body:\n", errText);
        process.exit(1);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
        console.error("\nNo text found in response. Full response:\n", JSON.stringify(data, null, 2));
        process.exit(1);
    }

    console.log("\nRaw model output:\n", text);

    try {
        const parsed = JSON.parse(text);
        console.log("\n✅ Parsed successfully:\n", parsed);

        const requiredKeys = ["strengths", "weaknesses", "improvement_tips", "star_score"];
        const missing = requiredKeys.filter((k) => !(k in parsed));

        if (missing.length > 0) {
            console.warn(`\n⚠️  Missing expected keys: ${missing.join(", ")}`);
        } else {
            console.log("\n✅ All expected keys present. Gemini integration looks good.");
        }
    } catch (err) {
        console.error("\n❌ Failed to parse model output as JSON:", err);
        process.exit(1);
    }
}

main();
