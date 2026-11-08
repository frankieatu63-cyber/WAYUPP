import { buildHead, type Locale, type PageKey } from "./config";
import { getDictionary } from "./index";

/** `<head>` content (title, description, canonical, hreflang, Open Graph) for a page in a language. */
export function pageHead(locale: Locale, page: PageKey) {
  const t = getDictionary(locale);
  if (page === "home") {
    return buildHead({
      locale,
      page,
      title: t.meta.homeTitle,
      description: t.meta.homeDescription,
    });
  }
  return buildHead({
    locale,
    page,
    title: `${t.legal[page].title} — Way Up`,
    description: page === "privacy" ? t.meta.privacyDescription : t.meta.termsDescription,
  });
}
