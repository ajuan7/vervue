import { MessageBox } from "@/components/message-box";

// Tells next.js not to pre-render the route 
export const instant = false;

export  default async function CompletePage({ params }: { params: { sessionId: string } }) {
    const { sessionId } = await params;

    return (
        <div className="max-w-xl mx-auto py-10 text-center">
            <MessageBox
                variant="success"
                title="Interview Complete!"
                description="You've answered all the questions."
            />

            <a
                href={`/interview/${sessionId}/summary`}
                className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded"
            >
                View Summary
            </a>
        </div>
    );
}
