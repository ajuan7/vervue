import { redirect } from "next/navigation";
export const instant = false;
export default async function FeedbackPage({
    params,
}: {
    params: Promise<{ sessionId: string }>;
}) {
    const { sessionId } = await params;
    redirect(`/interview/${sessionId}/summary`);
}