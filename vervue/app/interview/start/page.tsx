"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RoleSelector } from "@/components/interview/role-selector";
import { Button } from "@/components/ui/button";

export default function InterviewStartPage() {
    const router = useRouter();
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function startInterview() {
        if (!role) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/interview/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role }),
            });

            const data = await res.json();

            if (!res.ok || !data.sessionId) {
                setError(data.error ?? "Couldn't start the interview. Try again.");
                setLoading(false);
                return;
            }

            router.push(`/interview/${data.sessionId}/question/1`);
        } catch (err) {
            console.error("START INTERVIEW ERROR:", err);
            setError("Something went wrong. Check your connection and try again.");
            setLoading(false);
        }
    }

    return (
        <main className="max-w-3xl mx-auto px-5 py-10 sm:py-16 flex flex-col gap-6 sm:gap-8">
            <h1 className="text-2xl sm:text-3xl font-bold">Start Interview</h1>

            <RoleSelector onSelect={setRole} />

            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}

            <Button
                disabled={!role || loading}
                onClick={startInterview}
                className="w-full sm:w-fit"
            >
                {loading ? "Starting..." : "Start Interview"}
            </Button>
        </main>
    );
}