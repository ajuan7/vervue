import type { Metadata } from "next";

export const metadata = { title: "Interview" };

export default function InterviewLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}