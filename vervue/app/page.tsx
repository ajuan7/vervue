import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { buttonVariants } from "@/components/ui/button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {

  return (
    <main className="min-h-screen flex flex-col items-center geistSans antialiased">      
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
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
      </div>
    </main>
  );
}
