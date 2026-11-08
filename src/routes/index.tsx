import { createFileRoute } from "@tanstack/react-router";

import { HomePage } from "@/components/Pages";
import { pageHead } from "@/i18n/head";

// Spanish, the default language, stays at the site root.
export const Route = createFileRoute("/")({
  head: () => pageHead("es", "home"),
  component: () => <HomePage locale="es" />,
});
