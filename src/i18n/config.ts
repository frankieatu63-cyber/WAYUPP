/**
 * i18n configuration and URL scheme.
 *
 * Spanish is the default language and keeps the unprefixed URLs it already had (`/`,
 * `/privacidad`, `/terminos`), so nothing already indexed moves. The other languages live
 * under a language prefix: `/en`, `/fr`, `/zh`, with localized legal slugs (`/en/privacy`).
 */

export const LOCALES = ["es", "en", "fr", "zh"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";

/** Languages served under a URL prefix (everything except the default). */
export const PREFIXED_LOCALES = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

/**
 * Public origin of the site, used for canonical and hreflang URLs (these must be absolute).
 * TODO: confirm this is the real production domain.
 */
export const SITE_URL = "https://wayup.es";

/** Value for the `<html lang>` attribute and for hreflang. */
export const HTML_LANG: Record<Locale, string> = {
  es: "es",
  en: "en",
  fr: "fr",
  zh: "zh-Hans",
};

/** Value for the `og:locale` meta tag. */
export const OG_LOCALE: Record<Locale, string> = {
  es: "es_ES",
  en: "en_US",
  fr: "fr_FR",
  zh: "zh_CN",
};

/** Closing punctuation after the e-mail link at the end of a legal sentence. */
export const SENTENCE_END: Record<Locale, string> = {
  es: ".",
  en: ".",
  fr: ".",
  zh: "。",
};

export type PageKey = "home" | "privacy" | "terms";
export type LegalKey = Exclude<PageKey, "home">;

/** URL slug of each legal page, per language. */
export const LEGAL_SLUGS: Record<Locale, Record<LegalKey, string>> = {
  es: { privacy: "privacidad", terms: "terminos" },
  en: { privacy: "privacy", terms: "terms" },
  fr: { privacy: "confidentialite", terms: "conditions" },
  zh: { privacy: "privacy", terms: "terms" },
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Path (no origin, no hash) of a page in a given language. */
export function pathFor(locale: Locale, page: PageKey = "home"): string {
  const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  if (page === "home") return prefix === "" ? "/" : prefix;
  return `${prefix}/${LEGAL_SLUGS[locale][page]}`;
}

/** Path of a section of the home page, e.g. `/en#servicios`. */
export function sectionPath(locale: Locale, anchor: string): string {
  return `${pathFor(locale, "home")}#${anchor}`;
}

/** Resolves a legal slug (as it appears in the URL) back to its page, or null if unknown. */
export function legalPageFromSlug(locale: Locale, slug: string): LegalKey | null {
  const slugs = LEGAL_SLUGS[locale];
  if (slug === slugs.privacy) return "privacy";
  if (slug === slugs.terms) return "terms";
  return null;
}

/** Language of a URL path, judged by its first segment. Unprefixed paths are the default language. */
export function localeFromPathname(pathname: string): Locale {
  const first = pathname.split("/")[1] ?? "";
  return isLocale(first) && first !== DEFAULT_LOCALE ? first : DEFAULT_LOCALE;
}

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

/** hreflang alternates for a page: one per language, plus `x-default` pointing at the default. */
export function alternatesFor(page: PageKey): { hreflang: string; href: string }[] {
  return [
    ...LOCALES.map((l) => ({ hreflang: HTML_LANG[l], href: absoluteUrl(pathFor(l, page)) })),
    { hreflang: "x-default", href: absoluteUrl(pathFor(DEFAULT_LOCALE, page)) },
  ];
}

type HeadInput = { locale: Locale; page: PageKey; title: string; description: string };

/** Per-page `<head>` content: title, description, Open Graph, canonical and hreflang links. */
export function buildHead({ locale, page, title, description }: HeadInput) {
  const url = absoluteUrl(pathFor(locale, page));
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:locale", content: OG_LOCALE[locale] },
      ...LOCALES.filter((l) => l !== locale).map((l) => ({
        property: "og:locale:alternate",
        content: OG_LOCALE[l],
      })),
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: url },
      ...alternatesFor(page).map((a) => ({ rel: "alternate", hrefLang: a.hreflang, href: a.href })),
    ],
  };
}
