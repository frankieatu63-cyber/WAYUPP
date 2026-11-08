import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

import { HomePage } from "@/components/Pages";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/i18n/config";
import { pageHead } from "@/i18n/head";

// `/en`, `/fr`, `/zh`. Anything else under a single segment is a 404.
export const Route = createFileRoute("/$lang/")({
  beforeLoad: ({ params }) => {
    // `/es` would duplicate `/`: send it there permanently.
    if (params.lang === DEFAULT_LOCALE) throw redirect({ to: "/", statusCode: 301 });
    if (!isLocale(params.lang)) throw notFound();
  },
  head: ({ params }) => (isLocale(params.lang) ? pageHead(params.lang, "home") : {}),
  component: LangHome,
});

function LangHome() {
  const { lang } = Route.useParams();
  return <HomePage locale={lang as Locale} />;
}
