"use client";

import Link from "next/link";
import { Suspense } from "react";

import { AuthButton } from "@/components/auth-button";
import { buttonVariants } from "@/components/ui/button";

export function Nav() {
  return (
    <nav className="w-full border-b border-neutral-200 h-16 flex items-center">
      <div className="max-w-5xl w-full mx-auto p-3 px-5 flex items-center justify-between text-sm">
        
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-bold">
            VERVUE
          </Link>

          <Link
            href="/dashboard"
            className={buttonVariants({ variant: "outline" })}
          >
            Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Suspense>
            <AuthButton />
          </Suspense>
        </div>

      </div>
    </nav>
  );
}
