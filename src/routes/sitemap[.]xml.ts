import { createFileRoute } from "@tanstack/react-router";

import { buildSitemap } from "@/i18n/sitemap";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(buildSitemap(), {
          headers: { "Content-Type": "application/xml; charset=utf-8" },
        }),
    },
  },
});
