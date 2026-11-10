import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MessageBox } from "@/components/message-box";
import { completeSession } from "@/lib/interview/completeSession";
import { recordAnswer } from "@/lib/interview/recordAnswer";
import { AnswerForm } from "@/components/interview/answer-form";
import {
    GRACE_SECONDS,
    NO_ANSWER_TEXT,
    getElapsedSeconds,
    getTimeLimit,
} from "@/lib/interview/timer";

export const instant = false;

// Gives the background grading time to finish on vercel
export const maxDuration = 60;

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
        // All questions answered so complete the session. Grading will run in the background
        await completeSession(supabase, sessionId, user.id);
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

    // Timer 
    const timeLimit = getTimeLimit(question.difficulty);

    // Sessions created before timers existed have no start time yet
    let startedAt: string | null = session.question_started_at;
    if (!startedAt) {
        startedAt = new Date().toISOString();
        await supabase
            .from("interview_sessions")
            .update({ question_started_at: startedAt })
            .eq("id", sessionId)
            .is("completed_at", null);
    }

    const secondsLeft = Math.floor(timeLimit - getElapsedSeconds(startedAt));

    // Time ran out while the user was away. Forfeit this question only;
    // the next one gets a fresh clock.
    if (secondsLeft <= 0) {
        await recordAnswer(supabase, {
            sessionId,
            userId: user.id,
            questionId: question.id,
            text: NO_ANSWER_TEXT,
        });
        redirect(`/interview/${sessionId}/question/${qNum + 1}`);
    }

    // Handle form submission
    async function submitAnswer(formData: FormData) {
        "use server";

        const supabase = await createClient();
        const answer = ((formData.get("answer") as string) ?? "").trim();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) redirect("/auth/login");

        const { data: session } = await supabase
            .from("interview_sessions")
            .select("id, completed_at, question_started_at")
            .eq("id", sessionId)
            .eq("user_id", user.id)
            .single();

        if (!session || session.completed_at) {
            redirect(`/interview/${sessionId}/complete`);
        }

        // Enforce the limit on the server as the browser clock can't be trusted
        const tooLate =
            getElapsedSeconds(session.question_started_at) > timeLimit + GRACE_SECONDS;

        const text = tooLate || answer === "" ? NO_ANSWER_TEXT : answer;

        const { error } = await recordAnswer(supabase, {
            sessionId,
            userId: user.id,
            questionId: question.id,
            text,
        });

        if (error) {
            console.error("SAVE ANSWER ERROR:", error);
            return;
        }


        if (qNum >= totalQuestions) {
            await completeSession(supabase, sessionId, user.id);
            redirect(`/interview/${sessionId}/complete`);
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

            <AnswerForm key={qNum} action={submitAnswer} secondsLeft={secondsLeft} />
        </div>
    );
}