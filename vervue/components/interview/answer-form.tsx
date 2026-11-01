"use client";

import { useEffect, useRef, useState } from "react";

function formatTime(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function AnswerForm({
    action,
    secondsLeft,
}: {
    action: (formData: FormData) => void | Promise<void>;
    secondsLeft: number;
}) {
    const formRef = useRef<HTMLFormElement>(null);
    const submittedRef = useRef(false);
    const [remaining, setRemaining] = useState(secondsLeft);

    useEffect(() => {
        // Count down to a fixed deadline so a throttled background tab doesn't drift
        const deadline = Date.now() + secondsLeft * 1000;

        const id = setInterval(() => {
            const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
            setRemaining(left);

            if (left === 0 && !submittedRef.current) {
                submittedRef.current = true;
                clearInterval(id);

                const form = formRef.current;
                if (form) {
                    form.noValidate = true; // lets an empty answer through
                    form.requestSubmit();
                }
            }
        }, 500);

        return () => clearInterval(id);
    }, [secondsLeft]);

    return (
        <form
            ref={formRef}
            action={action}
            onSubmit={() => {
                submittedRef.current = true;
            }}
        >
            <p
                className={`text-sm mb-2 tabular-nums ${
                    remaining <= 30 ? "text-red-600" : "text-gray-500"
                }`}
            >
                Time left: {formatTime(remaining)}
            </p>

            <textarea
                name="answer"
                required
                className="w-full border rounded p-3 mb-4"
                rows={5}
            />

            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Submit Answer
            </button>
        </form>
    );
}