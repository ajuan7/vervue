"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Refetches the page every few seconds so feedback shows up once its ready
export function AutoRefresh({ everyMs = 3000, maxTries = 10 }) {
    const router = useRouter();

    useEffect(() => {
        let tries = 0;
        const id = setInterval(() => {
            tries += 1;
            router.refresh();
            if (tries >= maxTries) clearInterval(id);
        }, everyMs);
        return () => clearInterval(id);
    }, [router, everyMs, maxTries]);

    return null;
}