import Link from "next/link";

import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { SignOutButton } from "@/components/shared/SignOutButton";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { EAppRoutes } from "@/constants/routes";
import { getCurrentUser } from "@/lib/auth/server";
import { getLocale } from "@/lib/get-locale";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function SiteHeader() {
  const [user, locale] = await Promise.all([getCurrentUser(), getLocale()]);
  const copy = getDictionary(locale);

  return (
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href={EAppRoutes.home} className="text-sm font-semibold">
          {copy.nav.home}
        </Link>
        <nav className="flex items-center gap-2" aria-label={copy.nav.account}>
          <LanguageToggle copy={copy} locale={locale} />
          <ThemeToggle label={copy.theme.toggle} />
          {user ? (
            <>
              <Link
                href={EAppRoutes.dashboard}
                className="rounded-md px-2 py-1 text-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {copy.nav.dashboard}
              </Link>
              <Link
                href={EAppRoutes.profile}
                className="rounded-md px-2 py-1 text-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {copy.nav.profile}
              </Link>
              <SignOutButton label={copy.nav.signOut} />
            </>
          ) : (
            <>
              <Link
                href={EAppRoutes.signIn}
                className="rounded-md px-2 py-1 text-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {copy.nav.signIn}
              </Link>
              <Link
                href={EAppRoutes.signUp}
                className="rounded-md px-2 py-1 text-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {copy.nav.signUp}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
