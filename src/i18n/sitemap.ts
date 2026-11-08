import { LOCALES, absoluteUrl, alternatesFor, pathFor, type PageKey } from "./config";

const PAGES: PageKey[] = ["home", "privacy", "terms"];

/** sitemap.xml listing every page in every language, each with its hreflang alternates. */
export function buildSitemap(): string {
  const urls = PAGES.flatMap((page) =>
    LOCALES.map((locale) => {
      const links = alternatesFor(page)
        .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}"/>`)
        .join("\n");
      return `  <url>\n    <loc>${absoluteUrl(pathFor(locale, page))}</loc>\n${links}\n  </url>`;
    }),
  ).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`;
}
