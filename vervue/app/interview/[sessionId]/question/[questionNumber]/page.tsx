import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MessageBox } from "@/components/message-box";
import { generateSessionFeedback } from "@/lib/interview/generateFeedback";

export const instant = false;
export default async function QuestionPage(props: {
    params: Promise<{ sessionId: string; questionNumber: string }>;
}) {
    const { sessionId, questionNumber } = await props.params;
    const qNum = Number(questionNumber);

    const supabase = await createClient();

    // Ensure user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");

    // Validate session belongs to user
    const { data: session, error: sessionErr } = await supabase
        .from("interview_sessions")
        .select("*")
        .eq("id", sessionId)
        .eq("user_id", user.id)
        .single();

    if (sessionErr || !session) {
        return <MessageBox variant="error" title="Invalid session" description="This interview session could not be found." />;
    }

    // Fetch all questions for this role
    const { data: questions, error: qErr } = await supabase
        .from("interview_questions")
        .select("*")
        .eq("role", session.role)        // match the session's role
        .order("id", { ascending: true }); // stable ordering

    if (qErr) {
        console.error("QUESTION ERROR:", qErr);
        return <MessageBox variant="error" title="Error loading questions" />;
    }

    const totalQuestions = 6;
    const limitedQuestions = questions.slice(0, totalQuestions);

    // Pick the question by index (1-based)
    const question = limitedQuestions[qNum - 1];

    if (!question) {
        // All questions answered — mark the session complete
        const { error: completeErr } = await supabase
            .from("interview_sessions")
            .update({ completed_at: new Date().toISOString() })
            .eq("id", sessionId)
            .is("completed_at", null); // no-op if something else already completed it

        if (completeErr) {
            console.error("COMPLETE ERROR:", completeErr);
        }

        // Generate AI feedback
        // reaches the summary page
        // the summary page already has "No feedback yet" fallback.
        try {
            await generateSessionFeedback(sessionId, user.id);
        } catch (err) {
            console.error("FEEDBACK GENERATION ERROR:", err);
        }

        redirect(`/interview/${sessionId}/complete`);
    }


    // Handle form submission
    async function submitAnswer(formData: FormData) {
        "use server";

        const supabase = await createClient();
        const answer = formData.get("answer") as string;

        const { error } = await supabase
            .from("responses")
            .insert({
                session_id: sessionId,
                question_id: question.id,
                user_id: user?.id,
                response_text: answer,
            });

        if (error) {
            console.error("INSERT ERROR:", error);
            return;
        }

        // Move to next question
        redirect(`/interview/${sessionId}/question/${qNum + 1}`);
    }

    // Render question
    return (
        <div className="max-w-xl mx-auto py-10">
            <h1 className="text-2xl font-bold">
                Question {questionNumber}
            </h1>
            <p className="text-sm text-gray-500 mb-3">
                Question {qNum} of {totalQuestions}
            </p>

            <p className="mb-6">{question.question}</p>

            <form action={submitAnswer}>
                <textarea
                    name="answer"
                    required
                    className="w-full border rounded p-3 mb-4"
                    rows={5}
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Submit Answer
                </button>
            </form>
        </div>
    );
}
