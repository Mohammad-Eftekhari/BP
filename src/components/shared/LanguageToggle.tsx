"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import type { TDictionary } from "@/lib/i18n/en";
import { ELocale, LOCALE_COOKIE, type TLocale } from "@/lib/locale";

type TLanguageToggleProps = {
  copy: TDictionary;
  locale: TLocale;
};

export function LanguageToggle({ copy, locale }: TLanguageToggleProps) {
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
      aria-label={
        nextLocale === ELocale.fa ? copy.language.switchToPersian : copy.language.switchToEnglish
      }
      onClick={switchLocale}
    >
      {nextLocale === ELocale.fa ? copy.language.persianShort : copy.language.englishShort}
    </Button>
  );
}
