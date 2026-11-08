import { createFileRoute } from "@tanstack/react-router";

import { handleAdminConversation } from "@/server/wayapp/admin";

export const Route = createFileRoute("/api/admin/conversation")({
  server: { handlers: { GET: ({ request }) => handleAdminConversation(request) } },
});
