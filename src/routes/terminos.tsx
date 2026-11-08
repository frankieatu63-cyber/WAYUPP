import { createFileRoute } from "@tanstack/react-router";

import { LegalRoutePage } from "@/components/Pages";
import { pageHead } from "@/i18n/head";

export const Route = createFileRoute("/terminos")({
  head: () => pageHead("es", "terms"),
  component: () => <LegalRoutePage locale="es" page="terms" />,
});
