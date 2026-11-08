import { createFileRoute } from "@tanstack/react-router";

import { LegalRoutePage } from "@/components/Pages";
import { pageHead } from "@/i18n/head";

export const Route = createFileRoute("/privacidad")({
  head: () => pageHead("es", "privacy"),
  component: () => <LegalRoutePage locale="es" page="privacy" />,
});
