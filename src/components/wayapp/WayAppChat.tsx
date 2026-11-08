import { ArrowRight, Maximize2, Minimize2, RotateCcw, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import logo from "@/assets/wayapp-logo.png";

type Msg = { role: "user" | "assistant"; text: string };
type StreamEvent = { type: string; content?: string; message?: string };

const STARTERS = [
  "Quiero mejorar la presencia digital de mi negocio",
  "¿Qué puede hacer WAY UP por mi empresa?",
  "Necesito una página web profesional",
  "Quiero conseguir más clientes",
];

export function WayAppLogo() {
  return <img className="wa-logo" src={logo} alt="" draggable={false} />;
}

export function WayAppWordmark() {
  return (
    <span className="wa-wordmark">
      WAY<span>.</span>APP
    </span>
  );
}

type ChatProps = {
  onClose?: (() => void) | undefined;
  onExpand?: (() => void) | undefined;
  expanded?: boolean | undefined;
};

export function WayAppChat({ onClose, onExpand, expanded = false }: ChatProps) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = transcriptRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || busy) return;

    const history = [
      ...messages.slice(-15).map(({ role, text: content }) => ({ role, content })),
      { role: "user" as const, content: text },
    ];
    setMessages((m) => [...m, { role: "user", text }]);
    setValue("");
    setBusy(true);

    let assistantText = "";
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ messages: history, conversationId }),
      });
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(
          typeof errorBody.error === "string" ? errorBody.error : "No se ha podido conectar con WAY.APP.",
        );
      }
      const savedId = response.headers.get("X-WayApp-Conversation-Id");
      if (savedId) setConversationId(savedId);
      if (!response.body) throw new Error("El servidor no ha devuelto una respuesta en streaming.");

      const processLine = (line: string) => {
        const trimmed = line.trim();
        if (!trimmed) return;
        const event = JSON.parse(trimmed) as StreamEvent;
        if (event.type === "delta" && typeof event.content === "string") {
          assistantText += event.content;
          const snapshot = assistantText;
          setMessages((current) => {
            const last = current[current.length - 1];
            if (last?.role === "assistant") return [...current.slice(0, -1), { ...last, text: snapshot }];
            return [...current, { role: "assistant", text: snapshot }];
          });
        }
        if (event.type === "error") throw new Error(event.message || "La respuesta se ha interrumpido.");
      };

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { value: chunk, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) processLine(line);
      }
      buffer += decoder.decode();
      if (buffer.trim()) processLine(buffer);
      if (!assistantText.trim()) throw new Error("WAY.APP no ha recibido una respuesta. Inténtalo de nuevo.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ha ocurrido un error inesperado.";
      setMessages((current) => [...current, { role: "assistant", text: message }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="wa-shell">
      <header className="wa-header">
        <div className="wa-brand">
          <WayAppLogo />
          <WayAppWordmark />
        </div>
        <div className="wa-controls">
          {messages.length > 0 && (
            <button
              type="button"
              className="wa-icon-btn"
              title="Nueva conversación"
              aria-label="Nueva conversación"
              onClick={() => {
                setMessages([]);
                setConversationId(null);
              }}
            >
              <RotateCcw size={16} />
            </button>
          )}
          {onExpand && (
            <button
              type="button"
              className="wa-icon-btn wa-desktop-only"
              onClick={onExpand}
              title={expanded ? "Reducir" : "Ampliar"}
              aria-label={expanded ? "Reducir" : "Ampliar"}
            >
              {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          )}
          {onClose && (
            <button type="button" className="wa-icon-btn" onClick={onClose} title="Cerrar" aria-label="Cerrar">
              <X size={18} />
            </button>
          )}
        </div>
      </header>

      <div className="wa-transcript" ref={transcriptRef}>
        {messages.length === 0 ? (
          <div className="wa-welcome">
            <div className="wa-welcome-symbol">
              <Sparkles size={20} />
            </div>
            <p className="wa-eyebrow">TU ASISTENTE DIGITAL</p>
            <h2>
              Hola. Soy <em>WAY.APP.</em>
            </h2>
            <p>
              Estoy aquí para conocer tu negocio, resolver tus dudas y ayudarte a descubrir cómo puedes
              crecer en el mundo digital.
            </p>
            <div className="wa-starters">
              {STARTERS.map((s) => (
                <button type="button" key={s} onClick={() => void send(s)}>
                  {s}
                  <ArrowRight size={15} />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="wa-messages">
            {messages.map((m, i) => (
              <div className={`wa-message wa-${m.role}`} key={i}>
                {m.role === "assistant" && (
                  <div className="wa-assistant-label">
                    <WayAppLogo />
                    <span>WAY.APP</span>
                  </div>
                )}
                <div className="wa-bubble">{m.text}</div>
              </div>
            ))}
            {busy && (
              <div className="wa-thinking">
                <WayAppLogo />
                <span>WAY.APP está pensando…</span>
              </div>
            )}
          </div>
        )}
      </div>

      <form
        className="wa-composer"
        onSubmit={(e) => {
          e.preventDefault();
          void send(value);
        }}
      >
        <textarea
          value={value}
          maxLength={2000}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send(value);
            }
          }}
          placeholder="Escribe tu pregunta…"
          aria-label="Escribe tu pregunta"
        />
        <div className="wa-composer-bottom">
          <span>Enter para enviar · Shift + Enter para nueva línea</span>
          <button type="submit" className="wa-send" disabled={!value.trim() || busy} aria-label="Enviar">
            <Send size={17} />
          </button>
        </div>
      </form>
    </div>
  );
}
