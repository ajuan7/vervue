"use client";

import Link from "next/link";
import { Suspense } from "react";

import { AuthButton } from "@/components/auth-button";
import { buttonVariants } from "@/components/ui/button";

export function Nav() {
  return (
    <nav className="w-full border-b border-neutral-200 flex items-center">
        <div className="max-w-5xl w-full mx-auto p-3 px-5 flex items-center justify-between gap-2 text-sm min-w-0">
        
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 shrink-0">
          <Link href="/" className="text-lg font-bold shrink-0">
            VERVUE
          </Link>

          <Link
            href="/dashboard"
            className={buttonVariants({ variant: "outline", size: "sm"})}
          >
            Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Suspense>
            <AuthButton />
          </Suspense>
        </div>

      </div>
    </nav>
  );
}
