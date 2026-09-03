import { createClient } from "@/lib/supabase/server";

export type SessionRow = {
    id: string;
    role: string;
    started_at: string;
    completed_at: string | null;
};

type ResponseWithFeedback = {
    session_id: string;
    feedback: { star_score: number }[] | null;
};

export type DashboardSession = SessionRow & {
    avgScore: number | null;
    nextQuestion: number | null;
};

export async function getDashboardData(userId: string) {
    const supabase = await createClient();

    const { data: sessions, error: sessionsErr } = await supabase
        .from("interview_sessions")
        .select("id, role, started_at, completed_at")
        .eq("user_id", userId)
        .order("started_at", { ascending: false })
        .returns<SessionRow[]>();

    if (sessionsErr) throw new Error(sessionsErr.message);
    if (!sessions) return { sessions: [] as DashboardSession[], overallAvg: null };

    const completedIds = sessions.filter((s) => s.completed_at).map((s) => s.id);
    const inProgressIds = sessions.filter((s) => !s.completed_at).map((s) => s.id);

    const scoresBySession = new Map<string, number>();

    if (completedIds.length > 0) {
        const { data: responses } = await supabase
            .from("responses")
            .select(`session_id, feedback:feedback ( star_score )`)
            .in("session_id", completedIds)
            .returns<ResponseWithFeedback[]>();

        const grouped = new Map<string, number[]>();
        for (const r of responses ?? []) {
            const score = r.feedback?.[0]?.star_score;
            if (score === undefined) continue;
            const existing = grouped.get(r.session_id) ?? [];
            existing.push(score);
            grouped.set(r.session_id, existing);
        }

        for (const [sessionId, scores] of grouped) {
            scoresBySession.set(
                sessionId,
                scores.reduce((sum, s) => sum + s, 0) / scores.length
            );
        }
    }

    const nextQuestionBySession = new Map<string, number>();

    if (inProgressIds.length > 0) {
        const { data: inProgressResponses } = await supabase
            .from("responses")
            .select("session_id")
            .in("session_id", inProgressIds);

        const counts = new Map<string, number>();
        for (const r of inProgressResponses ?? []) {
            counts.set(r.session_id, (counts.get(r.session_id) ?? 0) + 1);
        }
        for (const id of inProgressIds) {
            nextQuestionBySession.set(id, (counts.get(id) ?? 0) + 1);
        }
    }

    const dashboardSessions: DashboardSession[] = sessions.map((s) => ({
        ...s,
        avgScore: scoresBySession.get(s.id) ?? null,
        nextQuestion: nextQuestionBySession.get(s.id) ?? null,
    }));

    const allScores = Array.from(scoresBySession.values());
    const overallAvg =
        allScores.length > 0
            ? allScores.reduce((sum, s) => sum + s, 0) / allScores.length
            : null;

    return { sessions: dashboardSessions, overallAvg };
}