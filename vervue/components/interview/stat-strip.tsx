export function StatStrip({
    total,
    completed,
    overallAvg,
}: {
    total: number;
    completed: number;
    overallAvg: number | null;
}) {
    return (
        <div className="flex border-y border-border mb-10">
            <div className="flex-1 py-5 px-1">
                <p className="text-3xl font-medium tabular-nums">{total}</p>
                <p className="text-sm text-muted-foreground mt-1">Total sessions</p>
            </div>
            <div className="flex-1 py-5 px-6 border-l border-border">
                <p className="text-3xl font-medium tabular-nums">{completed}</p>
                <p className="text-sm text-muted-foreground mt-1">Completed</p>
            </div>
            <div className="flex-1 py-5 px-6 border-l border-border">
                <p className="text-3xl font-medium tabular-nums">
                    {overallAvg !== null ? overallAvg.toFixed(1) : "—"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Average score</p>
            </div>
        </div>
    );
}