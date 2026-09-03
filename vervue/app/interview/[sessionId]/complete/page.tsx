import { MessageBox } from "@/components/message-box";
import { Button } from "@/components/ui/button";

// Tells next.js not to pre-render the route 
export const instant = false;

export default async function CompletePage({ params }: { params: { sessionId: string } }) {
    const { sessionId } = await params;

    return (
        <div className="max-w-xl mx-auto px-5 py-16 sm:py-24 text-center">
            <MessageBox
                variant="success"
                title="Interview Complete!"
                description="You've answered all the questions."
            />

            <Button asChild className="mt-6 w-full sm:w-fit">
                <a href={`/interview/${sessionId}/summary`}>View Summary</a>
            </Button>
        </div>
    );
}
