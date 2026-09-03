import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Fraunces } from "next/font/google";
import { getDashboardData } from "@/lib/interview/getDashboardData";
import { StatStrip } from "@/components/interview/stat-strip";
import { SessionRow } from "@/components/interview/session-row";

export const instant = false;

const fraunces = Fraunces({
    subsets: ["latin"],
    weight: ["500"],
    style: ["italic"],
});

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");

    const { sessions, overallAvg } = await getDashboardData(user.id);
    const completedCount = sessions.filter((s) => s.completed_at).length;

    return (
        <div className="w-full py-10">
            <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
                <h1 className={`${fraunces.className} text-4xl italic tracking-tight`}>
                    Your interviews
                </h1>
                <Button asChild>
                    <a href="/interview/start">Start new interview</a>
                </Button>
            </div>

            {sessions.length > 0 && (
                <StatStrip
                    total={sessions.length}
                    completed={completedCount}
                    overallAvg={overallAvg}
                />
            )}

            {sessions.length === 0 && (
                <div className="border border-border py-16 text-center">
                    <p className="text-muted-foreground mb-6">
                        You haven&apos;t started an interview yet.
                    </p>
                    <Button asChild>
                        <a href="/interview/start">Start your first interview</a>
                    </Button>
                </div>
            )}

            {sessions.length > 0 && (
                <div>
                  <div className="hidden sm:grid grid-cols-[1fr_140px_120px_140px_150px] gap-4 pb-3 text-sm text-muted-foreground border-b border-border">
                      <span>Role</span>
                      <span>Date</span>
                      <span>Status</span>
                      <span>Score</span>
                      <span />
                  </div>
                  <div className="divide-y divide-border">
                      {sessions.map((session) => (
                          <SessionRow key={session.id} session={session} />
                      ))}
                  </div>
                </div>
            )}
        </div>
    );
}