import { createFileRoute } from "@tanstack/react-router";

import { handleAdminMe } from "@/server/wayapp/admin";

export const Route = createFileRoute("/api/admin/me")({
  server: { handlers: { GET: ({ request }) => handleAdminMe(request) } },
});
