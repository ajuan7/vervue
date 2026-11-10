import { Button } from "@/components/ui/button";

// Tells next.js not to pre-render the route
export const instant = false;

export default async function CompletePage({
    params,
}: {
    params: Promise<{ sessionId: string }>;
}) {
    const { sessionId } = await params;

    return (
        <div className="max-w-xl mx-auto px-5 py-16 sm:py-24 text-center">
            {/* Animated checkmark */}
            <div className="animate-pop-in mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 ring-8 ring-green-50 dark:bg-green-500/15 dark:ring-green-500/10">
                <svg
                    viewBox="0 0 24 24"
                    className="h-12 w-12 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path className="animate-check-draw" d="M6 12.5l4 4 8-9" />
                </svg>
            </div>

            <h1
                className="animate-fade-up mt-8 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white"
                style={{ animationDelay: "250ms" }}
            >
                Interview complete
            </h1>

            <p
                className="animate-fade-up mt-3 text-gray-600 dark:text-gray-300"
                style={{ animationDelay: "400ms" }}
            >
                Nice work, you answered every question. See your scores and feedback on the summary.
            </p>

            <div
                className="animate-fade-up mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
                style={{ animationDelay: "550ms" }}
            >
                <Button asChild className="w-full sm:w-fit">
                    <a href={`/interview/${sessionId}/summary`}>View Summary</a>
                </Button>

                <a
                    href="/dashboard"
                    className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                    Back to Dashboard
                </a>
            </div>
        </div>
    );
}