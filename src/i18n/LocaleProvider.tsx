import { createContext, useContext, useMemo, type ReactNode } from "react";

import type { Locale, PageKey } from "./config";
import { getDictionary, type Dictionary } from "./index";

type LocaleContextValue = { locale: Locale; page: PageKey; t: Dictionary };

const LocaleContext = createContext<LocaleContextValue | null>(null);

/** Makes the language, the current page and its dictionary available to every component below. */
export function LocaleProvider({
  locale,
  page,
  children,
}: {
  locale: Locale;
  page: PageKey;
  children: ReactNode;
}) {
  const value = useMemo(() => ({ locale, page, t: getDictionary(locale) }), [locale, page]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside <LocaleProvider>");
  return ctx;
}
