import { createFileRoute } from "@tanstack/react-router";

import { handleHealth } from "@/server/wayapp/health";

// GET /api/health — estado de IA, base de datos, esquema y rate limit (solo booleanos).
export const Route = createFileRoute("/api/health")({
  server: { handlers: { GET: () => handleHealth() } },
});
