import { ELocale, type TLocale } from "@/lib/locale";

import { en, type TDictionary } from "./en";
import { fa } from "./fa";

const dictionaries: Record<TLocale, TDictionary> = {
  en,
  fa,
};

export function getDictionary(locale: TLocale): TDictionary {
  return dictionaries[locale] ?? dictionaries[ELocale.en];
}

export type { TDictionary };
