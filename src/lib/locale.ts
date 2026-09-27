export const ELocale = {
  en: "en",
  fa: "fa",
} as const;

export type TLocale = (typeof ELocale)[keyof typeof ELocale];

export const LOCALE_COOKIE = "locale";

export function isLocale(value: string | undefined): value is TLocale {
  return value === ELocale.en || value === ELocale.fa;
}

export function directionForLocale(locale: TLocale): "ltr" | "rtl" {
  return locale === ELocale.fa ? "rtl" : "ltr";
}
