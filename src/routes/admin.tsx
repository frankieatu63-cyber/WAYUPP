import { createFileRoute } from "@tanstack/react-router";

import { WayAppAdmin } from "@/components/wayapp/WayAppAdmin";

// Panel privado de WAY.APP. La seguridad real está en el servidor (/api/admin/*); esto es solo la interfaz.
export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "WAY.APP · Administración" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: WayAppAdmin,
});
