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

function scoreStyle(score: number) {
    if (score >= 4)
        return {
            text: "text-green-700 dark:text-green-400",
            bg: "bg-green-100 dark:bg-green-500/15",
            bar: "bg-green-500",
            label: "Strong",
        };
    if (score >= 3)
        return {
            text: "text-amber-700 dark:text-amber-400",
            bg: "bg-amber-100 dark:bg-amber-500/15",
            bar: "bg-amber-500",
            label: "Decent",
        };
    return {
        text: "text-red-700 dark:text-red-400",
        bg: "bg-red-100 dark:bg-red-500/15",
        bar: "bg-red-500",
        label: "Needs work",
    };
}

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

    const scores = responses
        .map((r) => r.feedback?.[0]?.star_score)
        .filter((s): s is number => typeof s === "number");
    const average = scores.length
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : null;
    const best = scores.length ? Math.max(...scores) : null;
    const overall = average !== null ? scoreStyle(average) : null;

    const card =
        "rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none";
    const smallLabel =
        "text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400";

    return (
        <div className="max-w-2xl mx-auto px-5 py-10">
            {/* Header */}
            <div className="animate-fade-up mb-8">
                <p className="text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Interview complete
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold mt-1 text-gray-900 dark:text-white">
                    Your results
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Role:{" "}
                    <strong className="text-gray-900 dark:text-white">{session.role}</strong>
                </p>
            </div>

            {/* Overview stats */}
            {responses.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mb-10">
                    <div
                        className={`animate-pop-in ${card} p-3 sm:p-4 text-center`}
                        style={{ animationDelay: "150ms" }}
                    >
                        <p className={smallLabel}>Average</p>
                        <p className={`text-2xl sm:text-3xl font-bold mt-1 ${overall?.text ?? "text-gray-400"}`}>
                            {average !== null ? average.toFixed(1) : "–"}
                            <span className="text-base font-medium text-gray-400">/5</span>
                        </p>
                    </div>
                    <div
                        className={`animate-pop-in ${card} p-3 sm:p-4 text-center`}
                        style={{ animationDelay: "250ms" }}
                    >
                        <p className={smallLabel}>Best</p>
                        <p className="text-2xl sm:text-3xl font-bold mt-1 text-gray-900 dark:text-white">
                            {best !== null ? best : "–"}
                            <span className="text-base font-medium text-gray-400">/5</span>
                        </p>
                    </div>
                    <div
                        className={`animate-pop-in ${card} p-3 sm:p-4 text-center`}
                        style={{ animationDelay: "350ms" }}
                    >
                        <p className={smallLabel}>Answered</p>
                        <p className="text-2xl sm:text-3xl font-bold mt-1 text-gray-900 dark:text-white">
                            {responses.length}
                        </p>
                    </div>
                </div>
            )}

            {responses.length === 0 && (
                <MessageBox
                    variant="info"
                    title="No responses yet"
                    description="You haven't answered any questions for this session."
                />
            )}

            {/* Question cards */}
            {responses.map((r, idx) => {
                const fb = r.feedback?.[0];
                const style = fb ? scoreStyle(fb.star_score) : null;
                const base = 400 + Math.min(idx, 3) * 150;

                return (
                    <div
                        key={r.id}
                        className={`animate-fade-up ${card} p-5 sm:p-6 mb-6`}
                        style={{ animationDelay: `${base}ms` }}
                    >
                        <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="min-w-0">
                                <p className={smallLabel}>Question {idx + 1}</p>
                                <h2 className="text-lg sm:text-xl font-semibold mt-1 text-gray-900 dark:text-white">
                                    {r.interview_questions?.question ?? "Untitled question"}
                                </h2>
                            </div>
                            {fb && style && (
                                <span
                                    className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold ${style.bg} ${style.text}`}
                                >
                                    {fb.star_score}/5
                                </span>
                            )}
                        </div>

                        {/* Score bar */}
                        {fb && style && (
                            <div className="mb-5">
                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                                    <div
                                        className={`animate-bar-grow h-full rounded-full ${style.bar}`}
                                        style={{
                                            width: `${(fb.star_score / 5) * 100}%`,
                                            animationDelay: `${base + 300}ms`,
                                        }}
                                    />
                                </div>
                                <p className={`mt-1 text-xs font-medium ${style.text}`}>{style.label}</p>
                            </div>
                        )}

                        {/* Answer */}
                        <div className="rounded-lg bg-gray-50 p-4 mb-5 dark:bg-black/30 dark:border dark:border-white/10">
                            <p className={`${smallLabel} mb-1`}>Your answer</p>
                            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                                {r.response_text}
                            </p>
                        </div>

                        {/* Feedback */}
                        {fb ? (
                            <div className="space-y-3">
                                <div
                                    className="animate-fade-up rounded-lg border-l-4 border-green-500 bg-green-50 p-4 dark:bg-green-500/10"
                                    style={{ animationDelay: `${base + 400}ms` }}
                                >
                                    <p className="text-sm font-semibold text-green-800 dark:text-green-400 mb-1">
                                        Strengths
                                    </p>
                                    <p className="text-gray-800 dark:text-gray-200">{fb.strengths}</p>
                                </div>

                                <div
                                    className="animate-fade-up rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4 dark:bg-amber-500/10"
                                    style={{ animationDelay: `${base + 550}ms` }}
                                >
                                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-1">
                                        Weaknesses
                                    </p>
                                    <p className="text-gray-800 dark:text-gray-200">{fb.weaknesses}</p>
                                </div>

                                <div
                                    className="animate-fade-up rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4 dark:bg-blue-500/10"
                                    style={{ animationDelay: `${base + 700}ms` }}
                                >
                                    <p className="text-sm font-semibold text-blue-800 dark:text-blue-400 mb-1">
                                        Improvement tips
                                    </p>
                                    <p className="text-gray-800 dark:text-gray-200">{fb.improvement_tips}</p>
                                </div>
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
                className="inline-block mt-2 rounded-lg bg-gray-900 px-5 py-2.5 font-medium text-white transition hover:bg-gray-700 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
                Back to Dashboard
            </a>
        </div>
    );
}