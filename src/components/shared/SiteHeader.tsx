import Link from "next/link";

import { SignOutButton } from "@/components/shared/SignOutButton";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { EAppRoutes } from "@/constants/routes";
import { getCurrentUser } from "@/lib/auth/server";

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href={EAppRoutes.home} className="text-sm font-semibold">
          Application starter
        </Link>
        <nav className="flex items-center gap-2" aria-label="Account">
          <ThemeToggle />
          {user ? (
            <>
              <Link
                href={EAppRoutes.dashboard}
                className="rounded-md px-2 py-1 text-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Dashboard
              </Link>
              <Link
                href={EAppRoutes.profile}
                className="rounded-md px-2 py-1 text-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Profile
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link
                href={EAppRoutes.signIn}
                className="rounded-md px-2 py-1 text-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Sign in
              </Link>
              <Link
                href={EAppRoutes.signUp}
                className="rounded-md px-2 py-1 text-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Create account
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
