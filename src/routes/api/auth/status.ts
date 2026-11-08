import { createFileRoute } from "@tanstack/react-router";

import { handleAuthStatus } from "@/server/wayapp/admin";

export const Route = createFileRoute("/api/auth/status")({
  server: { handlers: { GET: () => handleAuthStatus() } },
});
