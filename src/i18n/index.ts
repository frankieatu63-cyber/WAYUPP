import { en } from "./en";
import { es, type Dictionary } from "./es";
import { fr } from "./fr";
import { zh } from "./zh";
import type { Locale } from "./config";

export type { Dictionary };

export const dictionaries: Record<Locale, Dictionary> = { es, en, fr, zh };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
