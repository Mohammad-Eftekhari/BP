"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ELocale, LOCALE_COOKIE, type TLocale } from "@/lib/locale";

type TLanguageToggleProps = {
  locale: TLocale;
};

export function LanguageToggle({ locale }: TLanguageToggleProps) {
  const router = useRouter();
  const nextLocale = locale === ELocale.fa ? ELocale.en : ELocale.fa;

  function switchLocale() {
    const secure = window.location.protocol === "https:" ? ";secure" : "";
    document.cookie = `${LOCALE_COOKIE}=${nextLocale};path=/;max-age=31536000;samesite=lax${secure}`;
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-label={nextLocale === ELocale.fa ? "تغییر به فارسی" : "Switch to English"}
      onClick={switchLocale}
    >
      {nextLocale === ELocale.fa ? "فا" : "EN"}
    </Button>
  );
}
