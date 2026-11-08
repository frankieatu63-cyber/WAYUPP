import { logDatabaseError, query } from "./db";
import { extraAllowedOrigins, getEnv } from "./env";
import { isLocalHost, json } from "./http";
import { SYSTEM_PROMPT } from "./prompt";
import { isOverLimit } from "./rate-limit";

export type ChatMessage = { role: "user" | "assistant"; content: string };

const MAX_BODY_BYTES = 64 * 1024;
const MAX_MESSAGES = 16;
const MAX_USER_CHARS = 2_000;
const MAX_ASSISTANT_CHARS = 8_000;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * El chat vive ahora en el mismo origen que la web, así que el navegador envía `Origin` igual al
 * del propio sitio. Aceptamos ese origen, los de WAYAPP_ALLOWED_ORIGINS y, solo en local, localhost.
 */
export function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const requestUrl = new URL(request.url);
    const parsed = new URL(origin);
    const allowed = new Set([requestUrl.origin, ...extraAllowedOrigins()]);
    if (isLocalHost(requestUrl)) {
      allowed.add("http://localhost:3000").add("http://127.0.0.1:3000");
      allowed.add("http://localhost:5173").add("http://127.0.0.1:5173");
    }
    if (parsed.protocol !== "https:" && !isLocalHost(parsed)) return false;
    return allowed.has(parsed.origin);
  } catch {
    return false;
  }
}

export function validateMessages(value: unknown): ChatMessage[] | null {
  if (!value || typeof value !== "object" || !("messages" in value)) return null;
  const messages = (value as { messages?: unknown }).messages;
  if (!Array.isArray(messages) || messages.length < 1 || messages.length > MAX_MESSAGES) return null;
  const clean: ChatMessage[] = [];
  for (const item of messages) {
    if (!item || typeof item !== "object") return null;
    const message = item as { role?: unknown; content?: unknown };
    if (message.role !== "user" && message.role !== "assistant") return null;
    if (typeof message.content !== "string" || !message.content.trim()) return null;
    const limit = message.role === "user" ? MAX_USER_CHARS : MAX_ASSISTANT_CHARS;
    if (message.content.length > limit) return null;
    clean.push({ role: message.role, content: message.content.trim() });
  }
  return clean.at(-1)?.role === "user" ? clean : null;
}

function clientIp(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

function newVisitorToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}

export async function handleChat(request: Request): Promise<Response> {
  if (!isAllowedOrigin(request)) return json({ error: "Origen no permitido." }, 403);
  if (request.headers.get("content-type")?.split(";")[0]?.trim() !== "application/json") {
    return json({ error: "Tipo de contenido no permitido." }, 415);
  }

  // Antiabuso primero: si Redis no responde, NO se llama al proveedor de IA (falla cerrado).
  try {
    if (await isOverLimit(clientIp(request))) {
      return json({ error: "Has enviado demasiadas consultas. Espera unos minutos." }, 429);
    }
  } catch {
    return json({ error: "El servicio está temporalmente protegido. Inténtalo más tarde." }, 503);
  }

  const groqKey = getEnv("GROQ_API_KEY");
  if (!groqKey) return json({ error: "El servicio de IA aún no está configurado." }, 503);

  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return json({ error: "La solicitud es demasiado grande." }, 413);
  }
  let body: unknown;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
      return json({ error: "La solicitud es demasiado grande." }, 413);
    }
    body = JSON.parse(raw);
  } catch {
    return json({ error: "No se ha podido leer la solicitud." }, 400);
  }

  const messages = validateMessages(body);
  if (!messages) return json({ error: "El formato de la conversación no es válido." }, 400);

  const requestedId = (body as { conversationId?: unknown }).conversationId;
  if (
    requestedId !== undefined &&
    requestedId !== null &&
    (typeof requestedId !== "string" || !UUID_RE.test(requestedId))
  ) {
    return json({ error: "Identificador de conversación no válido." }, 400);
  }

  // Identidad anónima del visitante: token aleatorio en cookie HttpOnly; en BD solo su hash.
  const cookieHeader = request.headers.get("cookie") ?? "";
  const visitorMatch = cookieHeader.match(/(?:^|;[ ]*)wayapp_visitor=([a-f0-9]{64})(?:;|$)/i);
  const visitorToken = visitorMatch?.[1] ?? newVisitorToken();
  const visitorHash = await sha256Hex(visitorToken);

  let conversationId: string;
  try {
    if (typeof requestedId === "string") {
      const existing = await query<{ id: string }>(
        "UPDATE conversations SET updated_at = NOW() WHERE id = $1 AND visitor_token_hash = $2 RETURNING id",
        [requestedId, visitorHash],
      );
      const found = existing.rows[0];
      if (!found) return json({ error: "Conversación no encontrada." }, 404);
      conversationId = found.id;
    } else {
      const title =
        messages.find((m) => m.role === "user")?.content.slice(0, 120) ?? "Nueva conversación";
      const created = await query<{ id: string }>(
        "INSERT INTO conversations (title, visitor_token_hash) VALUES ($1, $2) RETURNING id",
        [title, visitorHash],
      );
      const row = created.rows[0];
      if (!row) throw new Error("conversation insert returned no row");
      conversationId = row.id;
    }
    const latest = messages.at(-1);
    if (latest) {
      await query("INSERT INTO messages (conversation_id, role, content) VALUES ($1, 'user', $2)", [
        conversationId,
        latest.content,
      ]);
    }
  } catch (error) {
    logDatabaseError("conversation persistence failed", error);
    return json({ error: "No se ha podido guardar la conversación. Inténtalo más tarde." }, 503);
  }

  let upstream: Response;
  try {
    upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${groqKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: getEnv("GROQ_MODEL") ?? "openai/gpt-oss-120b",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
        temperature: 0.6,
        max_completion_tokens: 1200,
        include_reasoning: false,
      }),
      signal: AbortSignal.timeout(85_000),
      cache: "no-store",
    });
  } catch {
    return json({ error: "No se ha podido conectar con el proveedor de IA." }, 502);
  }
  if (!upstream.ok || !upstream.body) {
    return upstream.status === 429
      ? json({ error: "El servicio de IA está temporalmente ocupado." }, 429)
      : json({ error: "El proveedor de IA no ha podido completar la respuesta." }, 502);
  }

  const encoder = new TextEncoder();
  const upstreamBody = upstream.body;
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstreamBody.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";
      const emit = (event: unknown) => controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const payload = trimmed.slice(5).trim();
            if (!payload || payload === "[DONE]") continue;
            try {
              const chunk = JSON.parse(payload) as {
                choices?: Array<{ delta?: { content?: string } }>;
              };
              const text = chunk.choices?.[0]?.delta?.content;
              if (typeof text === "string" && text) {
                assistantText += text;
                emit({ type: "delta", content: text });
              }
            } catch {
              /* Se ignoran trozos malformados del proveedor; nunca se reenvían en bruto. */
            }
          }
        }
        if (assistantText.trim()) {
          await query("INSERT INTO messages (conversation_id, role, content) VALUES ($1, 'assistant', $2)", [
            conversationId,
            assistantText.slice(0, MAX_ASSISTANT_CHARS),
          ]);
          await query("UPDATE conversations SET updated_at = NOW() WHERE id = $1", [conversationId]);
        }
        emit({ type: "done" });
        controller.close();
      } catch (error) {
        logDatabaseError("assistant persistence or stream failed", error);
        emit({ type: "error", message: "La respuesta se ha interrumpido. Inténtalo de nuevo." });
        controller.close();
      } finally {
        reader.releaseLock();
      }
    },
  });

  const secure = new URL(request.url).protocol === "https:";
  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Content-Type-Options": "nosniff",
      "X-Accel-Buffering": "no",
      "X-WayApp-Conversation-Id": conversationId,
      "Set-Cookie":
        `wayapp_visitor=${visitorToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000` +
        (secure ? "; Secure" : ""),
    },
  });
}
