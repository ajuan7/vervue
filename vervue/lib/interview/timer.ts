export const TIME_LIMITS_SECONDS: Record<string, number> = {
    easy: 120,
    medium: 180,
    hard: 240,
};

export const DEFAULT_TIME_LIMIT_SECONDS = 180;

// Extra seconds allowed for network delay before an answer counts as late
export const GRACE_SECONDS = 15;

// Saved when time runs out with nothing typed
export const NO_ANSWER_TEXT = "(No answer given)";

export function getTimeLimit(difficulty: string | null): number {
    return (difficulty && TIME_LIMITS_SECONDS[difficulty]) || DEFAULT_TIME_LIMIT_SECONDS;
}

export function getElapsedSeconds(startedAt: string | null): number {
    if (!startedAt) return 0;
    return (Date.now() - new Date(startedAt).getTime()) / 1000;
}