import { Button } from "@/components/ui/button";
import { ScoreBar } from "./score-bar";
import type { DashboardSession } from "@/lib/interview/getDashboardData";

function StatusPill({ isCompleted }: { isCompleted: boolean }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${isCompleted ? "bg-foreground" : "bg-border"}`}
            />
            {isCompleted ? "Completed" : "In progress"}
        </span>
    );
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function SessionRow({ session }: { session: DashboardSession }) {
    const isCompleted = !!session.completed_at;
    const href = isCompleted
        ? `/interview/${session.id}/summary`
        : `/interview/${session.id}/question/${session.nextQuestion ?? 1}`;

    return (
        <>
            {/* Desktop / tablet aligned table rows*/}
            <div className="hidden sm:grid grid-cols-[1fr_140px_120px_140px_150px] gap-4 items-center py-5">
                <span className="font-medium">{session.role}</span>
                <span className="text-sm text-muted-foreground">
                    {formatDate(session.started_at)}
                </span>
                <span className="text-sm">
                    <StatusPill isCompleted={isCompleted} />
                </span>
                <span>
                    {isCompleted && session.avgScore !== null ? (
                        <ScoreBar score={session.avgScore} />
                    ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                    )}
                </span>
                <Button
                    asChild
                    variant={isCompleted ? "outline" : "default"}
                    size="sm"
                    className="justify-self-end"
                >
                    <a href={href}>{isCompleted ? "View summary" : "Continue"}</a>
                </Button>
            </div>

            {/* Mobile version stacked cards */}
            <div className="sm:hidden py-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                    <span className="font-medium">{session.role}</span>
                    <StatusPill isCompleted={isCompleted} />
                </div>

                <div className="flex items-center justify-between text-sm">
                    <div>
                        <p className="text-muted-foreground text-xs mb-0.5">Date</p>
                        <p>{formatDate(session.started_at)}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-xs mb-0.5">Score</p>
                        {isCompleted && session.avgScore !== null ? (
                            <ScoreBar score={session.avgScore} />
                        ) : (
                            <span className="text-muted-foreground">—</span>
                        )}
                    </div>
                </div>

                <Button
                    asChild
                    variant={isCompleted ? "outline" : "default"}
                    size="sm"
                    className="w-full"
                >
                    <a href={href}>{isCompleted ? "View summary" : "Continue"}</a>
                </Button>
            </div>
        </>
    );
}