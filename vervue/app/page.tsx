import { Button } from "@/components/ui/button";
import { ScoreBar } from "@/components/interview/score-bar";
import { Fraunces } from "next/font/google";

const fraunces = Fraunces({
    subsets: ["latin"],
    weight: ["500"],
    style: ["italic"],
});

const steps = [
    {
        number: "1",
        title: "Pick a role",
        description:
            "Choose the role you're interviewing for and get a question set built around it.",
    },
    {
        number: "2",
        title: "Answer six questions",
        description:
            "Respond in your own words, one question at a time — just like the real thing.",
    },
    {
        number: "3",
        title: "Get scored feedback",
        description:
            "See strengths, weaknesses, and concrete tips for every answer, right after you finish.",
    },
];

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col items-center geistSans antialiased">
            <div className="w-full max-w-5xl px-5 py-16 sm:py-24 flex flex-col gap-24">

                {/* Hero */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div>
                        <h1
                            className={`${fraunces.className} text-4xl sm:text-5xl italic tracking-tight leading-tight`}
                        >
                            Practice the interview before it counts.
                        </h1>
                        <p className="text-muted-foreground mt-6 text-lg max-w-md">
                            Answer real role-based questions, then get specific AI feedback
                            on what worked and what to fix — before you&apos;re in the room.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 mt-8">
                            <Button asChild size="lg">
                                <a href="/auth/sign-up">Start practicing</a>
                            </Button>
                            <Button asChild variant="outline" size="lg">
                                <a href="/auth/login">Sign in</a>
                            </Button>
                        </div>
                    </div>

                    {/* Product preview card */}
                    <div className="border border-border p-6 sm:p-7">
                        <p className="font-medium">Software Engineer</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Question 2 of 6
                        </p>

                        <p className="mt-5 text-sm">Explain how REST APIs work.</p>

                        <p className="mt-4 text-xs text-muted-foreground">Your answer</p>
                        <p className="text-sm mt-1 line-clamp-2 text-muted-foreground">
                            A REST API is an architectural style that allows two systems
                            to communicate over the internet using HTTP.
                        </p>

                        <div className="mt-5 pt-5 border-t border-border">
                            <p className="text-xs text-muted-foreground mb-2">AI score</p>
                            <ScoreBar score={2} />
                            <p className="text-sm mt-3 text-muted-foreground line-clamp-2">
                                Your definition is accurate, but the answer is too brief —
                                it never explains how REST actually works.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Stat strip */}
                <section className="flex border-y border-border">
                    <div className="flex-1 py-5 px-1">
                        <p className="text-3xl font-medium tabular-nums">6</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Questions per session
                        </p>
                    </div>
                    <div className="flex-1 py-5 px-3 sm:px-6 border-l border-border">
                        <p className="text-3xl font-medium tabular-nums">3</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Feedback dimensions
                        </p>
                    </div>
                    <div className="flex-1 py-5 px-3 sm:px-6 border-l border-border">
                        <p className="text-3xl font-medium tabular-nums">5</p>
                        <p className="text-sm text-muted-foreground mt-1">Point scoring</p>
                    </div>
                </section>

                {/* How it works */}
                <section>
                    <h2
                        className={`${fraunces.className} text-2xl sm:text-3xl italic tracking-tight mb-10`}
                    >
                        How it works
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
                        {steps.map((step) => (
                            <div key={step.number}>
                                <p className="text-sm text-muted-foreground tabular-nums mb-2">
                                    {step.number}
                                </p>
                                <p className="font-medium mb-2">{step.title}</p>
                                <p className="text-sm text-muted-foreground">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Final CTA */}
                <section className="border-t border-border pt-16 pb-4 text-center">
                    <h2
                        className={`${fraunces.className} text-2xl sm:text-3xl italic tracking-tight mb-6`}
                    >
                        Your next interview starts here.
                    </h2>
                    <Button asChild size="lg">
                        <a href="/auth/sign-up">Start practicing</a>
                    </Button>
                </section>

            </div>
        </main>
    );
}