import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export const instant = false;

export default async function SessionPage({ params }: { params: { sessionId: string } }) {
  // Create Supabase server client tied to cookies
  const supabase = await createClient();

  // Fetch the session from the database
  const { data: session, error } = await supabase
    .from("interview_sessions")
    .select("*")
    .eq("id", params.sessionId)
    .single();

  // If session doesn't exist, redirect to start page
  if (!session || error) {
    redirect("/interview/start");
  }

  return (
    <main className="max-w-3xl mx-auto py-10 flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Interview Session</h1>

      <div className="space-y-2">
        <p><strong>Role:</strong> {session.role}</p>
        <p><strong>Created:</strong> {new Date(session.created_at).toLocaleString()}</p>
      </div>

      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">Progress</h2>
        <p>0 questions answered</p>
      </div>

      <Button
        className="w-fit"
        onClick={() => redirect(`/interview/${params.sessionId}/question`)}
      >
        Start Interview
      </Button>
    </main>
  );
}
