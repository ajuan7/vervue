import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

async function InstrumentsData() {
  const supabase = await createClient();
  const { data: feedback, error } = await supabase.from("interview_questions").select();

  if (error) {
    return <p>Error loading interview questions: {error.message}</p>;
  }

  return <pre>{JSON.stringify(feedback, null, 2)}</pre>;
}

export default function Instruments() {
  return (
    <Suspense fallback={<div>Loading interview questions...</div>}>
      <InstrumentsData />
    </Suspense>
  );
}