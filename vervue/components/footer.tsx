import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";

export function Footer() {
  return (
    <footer className="w-full flex flex-wrap items-center justify-center border-t mx-auto text-center text-xs gap-x-8 gap-y-4 px-5 py-16">
      <p>
        © 2026 Vervue. Built by{" "}
        <Link href="https://juanicodevsolutions.com" className="underline underline-offset-4">
          JuanicoDevSolutions
        </Link>
        .
      </p>
      <ThemeSwitcher />
    </footer>
  );
}