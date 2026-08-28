import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {

    // Create Supabase client tied to the user cookies
    // Ensure the auth state is correctly read
    const supabase = await createClient();

    // Get the role from the body of request
    const { role } = await req.json();

    // Fetch the authenticated user
    // If no user found, block session
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    // Insert new session for the user using ID
    const { data, error } = await supabase
        .from("interview_sessions")
        .insert({
            user_id: user.id,
            role,
        })
        .select("id")
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Return the new session ID to redirect user
    return NextResponse.json({ sessionId: data.id });
}
