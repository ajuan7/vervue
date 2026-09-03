export function ScoreBar({ score }: { score: number }) {
    const rounded = Math.round(score);
    return (
        <div className="flex items-center gap-2">
            <div className="flex gap-[3px]">
                {Array.from({ length: 5 }).map((_, i) => (
                    <span
                        key={i}
                        className={`h-3 w-1.5 ${i < rounded ? "bg-foreground" : "bg-border"}`}
                    />
                ))}
            </div>
            <span className="text-sm tabular-nums text-muted-foreground">
                {score.toFixed(1)}
            </span>
        </div>
    );
}