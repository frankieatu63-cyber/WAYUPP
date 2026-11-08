import { createFileRoute } from "@tanstack/react-router";

import { createAuth } from "@/server/wayapp/auth";

// /api/auth/* — Better Auth (login con Google, sesión, callback OAuth, cierre de sesión).
// `/api/auth/status` tiene su propia ruta, que tiene prioridad sobre este comodín.
const authHandler = ({ request }: { request: Request }) =>
  createAuth(new URL(request.url).origin).handler(request);

export const Route = createFileRoute("/api/auth/$")({
  server: { handlers: { GET: authHandler, POST: authHandler } },
});
