import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MessageBox } from "@/components/message-box";
import { generateSessionFeedback } from "@/lib/interview/generateFeedback";
import { Button } from "@/components/ui/button";

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

    // Prevent access to completed sessions
    if (session.completed_at) {
        redirect(`/interview/${sessionId}/complete`);
    }

    // Use the shuffled locked-in order stored on the session
    const questionIds: string[] = session.question_ids ?? [];
    const totalQuestions = questionIds.length;

    // Figure out how many questions the user has actually answered
    const { count: answeredCount, error: countErr } = await supabase
        .from("responses")
        .select("id", { count: "exact", head: true })
        .eq("session_id", sessionId);

    if (countErr) {
        console.error("ANSWERED COUNT ERROR:", countErr);
        return <MessageBox variant="error" title="Error loading progress" />;
    }

    const currentPosition = (answeredCount ?? 0) + 1;

    if (qNum !== currentPosition) {
        redirect(`/interview/${sessionId}/question/${currentPosition}`);
    }

    const currentQuestionId = questionIds[qNum - 1];

    if (!currentQuestionId) {
        // All questions answered — mark the session complete
        const { error: completeErr } = await supabase
            .from("interview_sessions")
            .update({ completed_at: new Date().toISOString() })
            .eq("id", sessionId)
            .is("completed_at", null);

        if (completeErr) {
            console.error("COMPLETE ERROR:", completeErr);
        }

        try {
            await generateSessionFeedback(sessionId, user.id);
        } catch (err) {
            console.error("FEEDBACK GENERATION ERROR:", err);
        }

        redirect(`/interview/${sessionId}/complete`);
    }

    // Fetch just this one question by its locked-in id
    const { data: question, error: qErr } = await supabase
        .from("interview_questions")
        .select("*")
        .eq("id", currentQuestionId)
        .single();

    if (qErr || !question) {
        console.error("QUESTION ERROR:", qErr);
        return <MessageBox variant="error" title="Error loading question" />;
    }

    // Handle form submission
    async function submitAnswer(formData: FormData) {
        "use server";

        const supabase = await createClient();
        const answer = formData.get("answer") as string;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) redirect("/auth/login");

        const { data: session } = await supabase
            .from("interview_sessions")
            .select("id, completed_at")
            .eq("id", sessionId)
            .eq("user_id", user.id)
            .single();

        if (!session || session.completed_at) {
            redirect(`/interview/${sessionId}/complete`);
        }

        // Prevent duplicate rows if this question is resubmitted
        const { data: existing } = await supabase
            .from("responses")
            .select("id")
            .eq("session_id", sessionId)
            .eq("question_id", question.id)
            .maybeSingle();

        if (existing) {
            const { error: updateErr } = await supabase
                .from("responses")
                .update({ response_text: answer })
                .eq("id", existing.id);

            if (updateErr) {
                console.error("UPDATE ERROR:", updateErr);
                return;
            }
        } else {
            const { error: insertErr } = await supabase
                .from("responses")
                .insert({
                    session_id: sessionId,
                    question_id: question.id,
                    user_id: user.id,
                    response_text: answer,
                });

            if (insertErr) {
                console.error("INSERT ERROR:", insertErr);
                return;
            }
        }

        redirect(`/interview/${sessionId}/question/${qNum + 1}`);
    }

    // Render question
    return (
        <div className="max-w-xl mx-auto px-5 py-10 sm:py-16">
            <p className="text-sm text-muted-foreground mb-2">
                Question {qNum} of {totalQuestions}
            </p>

            {/* Progress bar */}
            <div className="h-1 w-full bg-border mb-8">
                <div
                    className="h-1 bg-foreground"
                    style={{ width: `${(qNum / totalQuestions) * 100}%` }}
                />
            </div>

            <h1 className="text-xl sm:text-2xl font-semibold mb-8 leading-snug">
                {question.question}
            </h1>

            <form action={submitAnswer} className="flex flex-col gap-4">
                <textarea
                    name="answer"
                    required
                    className="w-full border border-border bg-transparent p-3 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-foreground"
                    rows={6}
                />

                <Button type="submit" className="w-full sm:w-fit">
                    Submit Answer
                </Button>
            </form>
        </div>
    );
}