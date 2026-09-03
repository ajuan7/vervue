import { createClient } from "@/lib/supabase/server";
import { MessageBox } from "@/components/message-box";
import { redirect } from "next/navigation";

export const instant = false;

type Feedback = {
    strengths: string;
    weaknesses: string;
    improvement_tips: string;
    star_score: number;
};

type ResponseRow = {
    id: string;
    question_id: string;
    response_text: string;
    interview_questions: { question: string } | null;
    feedback: Feedback[] | null;
};

export default async function SummaryPage({
    params,
}: {
    params: Promise<{ sessionId: string }>;
}) {
    const { sessionId } = await params;

    const supabase = await createClient();

    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");

    // Fetch session
    const { data: session, error: sessionErr } = await supabase
        .from("interview_sessions")
        .select("*")
        .eq("id", sessionId)
        .eq("user_id", user.id)
        .single();

    if (sessionErr || !session) {
        return (
            <MessageBox
                variant="error"
                title="Invalid session"
                description="This interview session could not be found."
            />
        );
    }

    // Fetch responses + feedback, ordered by when they were actually answered
    const { data: responses, error: respErr } = await supabase
        .from("responses")
        .select(`
            id,
            question_id,
            response_text,
            interview_questions ( question ),
            feedback:feedback (
                strengths,
                weaknesses,
                improvement_tips,
                star_score
            )
        `)
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true })
        .returns<ResponseRow[]>();

    if (respErr) {
        return (
            <MessageBox
                variant="error"
                title="Error loading summary"
                description="Could not load responses or feedback."
            />
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-10">
            <h1 className="text-3xl font-bold mb-4">Interview Summary</h1>
            <p className="text-gray-600 mb-8">
                Role: <strong>{session.role}</strong>
            </p>

            {responses.length === 0 && (
                <MessageBox
                    variant="info"
                    title="No responses yet"
                    description="You haven't answered any questions for this session."
                />
            )}

            {responses.map((r, idx) => {
                const fb = r.feedback?.[0];

                return (
                    <div key={r.id} className="border rounded p-5 mb-6">
                        <h2 className="text-xl font-semibold mb-2">
                            Question {idx + 1} : {r.interview_questions?.question ?? "Untitled question"}
                        </h2>

                        <p className="mb-4">
                            <strong>Your Answer:</strong>
                            <br />
                            {r.response_text}
                        </p>

                        {fb ? (
                            <div className="mt-4">
                                <p className="mb-2">
                                    <strong>⭐ Score:</strong> {fb.star_score}/5
                                </p>

                                <p className="mb-2">
                                    <strong>Strengths:</strong>
                                    <br />
                                    {fb.strengths}
                                </p>

                                <p className="mb-2">
                                    <strong>Weaknesses:</strong>
                                    <br />
                                    {fb.weaknesses}
                                </p>

                                <p className="mb-2">
                                    <strong>Improvement Tips:</strong>
                                    <br />
                                    {fb.improvement_tips}
                                </p>
                            </div>
                        ) : (
                            <MessageBox
                                variant="warning"
                                title="No feedback yet"
                                description="AI feedback has not been generated for this response."
                            />
                        )}
                    </div>
                );
            })}

            <a
                href="/dashboard"
                className="inline-block mt-6 bg-gray-800 text-white px-4 py-2 rounded"
            >
                Back to Dashboard
            </a>
        </div >
    );
}