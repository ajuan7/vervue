import { Button } from "@/components/ui/button";
import { ScoreBar } from "./score-bar";
import type { DashboardSession } from "@/lib/interview/getDashboardData";

export function SessionRow({ session }: { session: DashboardSession }) {
    const isCompleted = !!session.completed_at;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px_120px_140px_150px] gap-2 sm:gap-4 items-center py-5">
            <span className="font-medium">{session.role}</span>

            <span className="text-sm text-muted-foreground">
                {new Date(session.started_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                })}
            </span>

            <span className="text-sm">
                <span
                    className={`inline-flex items-center gap-1.5 ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}
                >
                    <span
                        className={`h-1.5 w-1.5 rounded-full ${isCompleted ? "bg-foreground" : "bg-border"}`}
                    />
                    {isCompleted ? "Completed" : "In progress"}
                </span>
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
                <a
                    href={
                        isCompleted
                            ? `/interview/${session.id}/summary`
                            : `/interview/${session.id}/question/${session.nextQuestion ?? 1}`
                    }
                >
                    {isCompleted ? "View summary" : "Continue"}
                </a>
            </Button>
        </div>
    );
}