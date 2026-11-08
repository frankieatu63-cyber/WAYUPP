import { createFileRoute } from "@tanstack/react-router";

import { handleChat } from "@/server/wayapp/chat";
import { json } from "@/server/wayapp/http";

// POST /api/chat — conversación con WAY.APP (streaming NDJSON).
export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      GET: () => json({ status: "ok" }),
      POST: ({ request }) => handleChat(request),
    },
  },
});
