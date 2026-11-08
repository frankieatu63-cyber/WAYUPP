import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

import { LegalRoutePage } from "@/components/Pages";
import { DEFAULT_LOCALE, isLocale, legalPageFromSlug, pathFor, type Locale } from "@/i18n/config";
import { pageHead } from "@/i18n/head";

// Localized legal pages: `/en/privacy`, `/fr/conditions`, `/zh/terms`, ...
export const Route = createFileRoute("/$lang/$slug")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.lang)) throw notFound();
    if (params.lang === DEFAULT_LOCALE) {
      // `/es/privacidad` duplicates `/privacidad`: send it there permanently.
      const page = legalPageFromSlug(DEFAULT_LOCALE, params.slug);
      if (page) throw redirect({ href: pathFor(DEFAULT_LOCALE, page), statusCode: 301 });
      throw notFound();
    }
    if (!legalPageFromSlug(params.lang, params.slug)) throw notFound();
  },
  head: ({ params }) => {
    if (!isLocale(params.lang)) return {};
    const page = legalPageFromSlug(params.lang, params.slug);
    return page ? pageHead(params.lang, page) : {};
  },
  component: LangLegal,
});

function LangLegal() {
  const { lang, slug } = Route.useParams();
  const locale = lang as Locale;
  const page = legalPageFromSlug(locale, slug);
  if (!page) throw notFound();
  return <LegalRoutePage locale={locale} page={page} />;
}
