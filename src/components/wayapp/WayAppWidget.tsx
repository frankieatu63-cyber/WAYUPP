import { useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import logo from "@/assets/wayapp-logo.png";

import { WayAppChat } from "./WayAppChat";

/** Evento global para abrir el chat desde cualquier sitio: `window.dispatchEvent(new Event("wayapp:open"))`. */
export const WAYAPP_OPEN_EVENT = "wayapp:open";

export function openWayApp() {
  window.dispatchEvent(new Event(WAYAPP_OPEN_EVENT));
}

/**
 * Widget flotante de WAY.APP: lanzador + saludo + panel. Se monta una sola vez en la raíz de la web.
 * Sustituye al antiguo <script src=".../embed.js"> y al iframe /embed: ahora es parte de la propia app.
 */
export function WayAppWidget() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [greeting, setGreeting] = useState(true);

  const close = useCallback(() => {
    setOpen(false);
    setExpanded(false);
  }, []);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(WAYAPP_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(WAYAPP_OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // El panel de administración no lleva asistente.
  if (pathname.startsWith("/admin")) return null;

  return (
    <div className="wa-root">
      {open && (
        <div
          className={"wa-panel" + (expanded ? " wa-expanded" : "")}
          role="dialog"
          aria-label="Asistente digital WAY.APP"
        >
          <WayAppChat onClose={close} onExpand={() => setExpanded((v) => !v)} expanded={expanded} />
        </div>
      )}
      {!open && (
        <div className="wa-floating">
          <button type="button" className="wa-fab" onClick={() => setOpen(true)} aria-label="Abrir chat con WAY.APP">
            <img src={logo} alt="" />
            <span className="wa-fab-dot" />
          </button>
          {greeting && (
            <div role="status" className="wa-greeting">
              <div className="wa-greeting-head">
                <strong>¡Hola! Soy Way.App</strong>
                <button
                  type="button"
                  className="wa-greeting-close"
                  onClick={() => setGreeting(false)}
                  aria-label="Cerrar saludo"
                >
                  ✕
                </button>
              </div>
              <small>¿Hablamos? Pregúntame lo que quieras</small>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
