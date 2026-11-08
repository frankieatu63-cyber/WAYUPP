import { describe, expect, it } from "vitest";

import {
  LOCALES,
  alternatesFor,
  legalPageFromSlug,
  localeFromPathname,
  pathFor,
  sectionPath,
} from "@/i18n/config";
import { dictionaries } from "@/i18n";
import { pageHead } from "@/i18n/head";
import { buildSitemap } from "@/i18n/sitemap";

/** Flattens a dictionary into `path -> string` so languages can be compared key by key. */
function flatten(value: unknown, prefix = ""): Record<string, string> {
  if (typeof value === "string") return { [prefix]: value };
  if (typeof value === "boolean" || value === null || value === undefined) return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(value as object)) {
    Object.assign(out, flatten(v, prefix ? `${prefix}.${k}` : k));
  }
  return out;
}

describe("URL scheme", () => {
  it("keeps Spanish at the unprefixed URLs and prefixes the other languages", () => {
    expect(pathFor("es")).toBe("/");
    expect(pathFor("es", "privacy")).toBe("/privacidad");
    expect(pathFor("es", "terms")).toBe("/terminos");
    expect(pathFor("en")).toBe("/en");
    expect(pathFor("fr", "privacy")).toBe("/fr/confidentialite");
    expect(pathFor("zh", "terms")).toBe("/zh/terms");
    expect(sectionPath("en", "servicios")).toBe("/en#servicios");
    expect(sectionPath("es", "servicios")).toBe("/#servicios");
  });

  it("reads the language from a path and resolves legal slugs back to pages", () => {
    expect(localeFromPathname("/")).toBe("es");
    expect(localeFromPathname("/privacidad")).toBe("es");
    expect(localeFromPathname("/fr/conditions")).toBe("fr");
    expect(localeFromPathname("/xx")).toBe("es");
    expect(legalPageFromSlug("fr", "confidentialite")).toBe("privacy");
    expect(legalPageFromSlug("en", "privacidad")).toBeNull();
  });
});

describe("SEO", () => {
  it("lists every language plus x-default as hreflang alternates", () => {
    const alts = alternatesFor("home");
    expect(alts).toHaveLength(LOCALES.length + 1);
    expect(alts.at(-1)).toEqual({ hreflang: "x-default", href: "https://wayup.es/" });
  });

  it("gives each page its own canonical URL and translated title", () => {
    const en = pageHead("en", "home");
    expect(en.links).toContainEqual({ rel: "canonical", href: "https://wayup.es/en" });
    expect(en.meta).toContainEqual({ title: dictionaries.en.meta.homeTitle });
    expect(pageHead("es", "privacy").links).toContainEqual({
      rel: "canonical",
      href: "https://wayup.es/privacidad",
    });
  });

  it("puts every page of every language in the sitemap", () => {
    const xml = buildSitemap();
    expect(xml.match(/<loc>/g)).toHaveLength(LOCALES.length * 3);
    expect(xml).toContain("<loc>https://wayup.es/fr/confidentialite</loc>");
  });
});

describe("Dictionaries", () => {
  // The hero headline is split into a different number of chunks in each language.
  const comparable = (l: (typeof LOCALES)[number]) =>
    Object.keys(flatten(dictionaries[l]))
      .filter((k) => !k.startsWith("hero.headline."))
      .sort();
  const reference = comparable("es");

  it.each(LOCALES.filter((l) => l !== "es"))("%s has exactly the same keys as Spanish", (l) => {
    expect(comparable(l)).toEqual(reference);
  });

  it.each(LOCALES)("%s has a hero headline", (l) => {
    expect(dictionaries[l].hero.headline.length).toBeGreaterThan(0);
  });

  it.each(LOCALES.filter((l) => l !== "es"))("%s has no empty strings", (l) => {
    const empty = Object.entries(flatten(dictionaries[l])).filter(([, v]) => v.trim() === "");
    expect(empty).toEqual([]);
  });
});
