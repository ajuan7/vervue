import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const DAILY_SESSION_LIMIT = 5;

function shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export async function POST(req: Request) {

    // Create Supabase client tied to the user cookies
    // Ensure the auth state is correctly read
    const supabase = await createClient();

    // Get the role from the body of request
    const { role } = await req.json();

    // Guard check if null
    if (!role || typeof role !== "string") {
        return NextResponse.json({ error: "A valid role is required" }, { status: 400 });
    }
    
    // Fetch the authenticated user
    // If no user found, block session
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Each completed session triggers up to 6 Gemini API calls, so cap how many
    // sessions a single user can start in a rolling 24h window before we spend
    // on their behalf.
    const rateLimitWindowStart = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: recentSessionCount, error: rateLimitErr } = await supabase
        .from("interview_sessions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("started_at", rateLimitWindowStart);

    if (rateLimitErr) {
        return NextResponse.json({ error: rateLimitErr.message }, { status: 500 });
    }
    if ((recentSessionCount ?? 0) >= DAILY_SESSION_LIMIT) {
        return NextResponse.json(
            { error: `You've reached the limit of ${DAILY_SESSION_LIMIT} interview sessions per day. Please try again later.` },
            { status: 429 }
        );
    }

    // Fetch every question id for this role
    const { data: questions, error: questionsErr } = await supabase
        .from("interview_questions")
        .select("id")
        .eq("role", role);

    // Guard for invalid or no questions
    if (!questions || questions.length === 0) {
        return NextResponse.json(
            { error: "No questions found for this role" },
            { status: 400 }
        );
    }

    // Randomly pick 6 and lock that order into the session
    const questionIds = shuffle(questions).slice(0, 6).map((q) => q.id);

    const { data, error } = await supabase
        .from("interview_sessions")
        .insert({
            user_id: user.id,
            role,
            question_ids: questionIds,
        })
        .select("id")
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Return the new session ID to redirect user
    return NextResponse.json({ sessionId: data.id });
}
