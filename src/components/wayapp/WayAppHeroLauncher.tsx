import { openWayApp } from "./WayAppWidget";

/** Tarjeta del hero que abre el chat. Antes la montaba embed.js dentro de #wayapp-hero-widget. */
export function WayAppHeroLauncher() {
  return (
    <div className="wa-root">
      <button
        type="button"
        className="wa-hero-launcher"
        onClick={openWayApp}
        aria-label="Abrir el asistente WAY.APP"
      >
        <span className="wa-hero-mark" aria-hidden="true">
          W.
        </span>
        <span className="wa-hero-copy">
          <span className="wa-hero-title">Habla con WAY.APP</span>
          <span className="wa-hero-subtitle">Tu asistente digital está aquí para ayudarte a crecer.</span>
        </span>
        <span className="wa-hero-action">Empezar ↗</span>
      </button>
    </div>
  );
}
