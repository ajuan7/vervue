"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RoleSelector } from "@/components/interview/role-selector";
import { Button } from "@/components/ui/button";

export default function InterviewStartPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function startInterview() {
    if (!role) return;

    setLoading(true);

    const res = await fetch("/api/interview/start", {
      method: "POST",
      body: JSON.stringify({ role }),
    });

    const data = await res.json();

    if (data.sessionId) {
      router.push(`/interview/${data.sessionId}/question`);
    }
  }

  return (
    <main className="max-w-3xl mx-auto py-10 flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Start Interview</h1>

      <RoleSelector onSelect={setRole} />

      <Button
        disabled={!role || loading}
        onClick={startInterview}
        className="w-fit"
      >
        {loading ? "Starting..." : "Start Interview"}
      </Button>
    </main>
  );
}
