import { createFileRoute } from "@tanstack/react-router";

import { handleAdminOverview } from "@/server/wayapp/admin";

export const Route = createFileRoute("/api/admin/overview")({
  server: { handlers: { GET: ({ request }) => handleAdminOverview(request) } },
});
