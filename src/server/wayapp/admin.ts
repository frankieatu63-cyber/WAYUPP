import { query } from "./db";
import { requireAdmin } from "./admin-auth";
import { isGoogleAuthConfigured } from "./auth";
import { json, unauthorized } from "./http";

export function handleAuthStatus(): Response {
  return json({ googleConfigured: isGoogleAuthConfigured() });
}

export async function handleAdminMe(request: Request): Promise<Response> {
  const admin = await requireAdmin(request);
  return admin ? json({ authenticated: true, admin }) : unauthorized();
}

export async function handleAdminOverview(request: Request): Promise<Response> {
  const admin = await requireAdmin(request);
  if (!admin) return unauthorized();
  try {
    const [summary, conversations, leads] = await Promise.all([
      query(`
        SELECT
          (SELECT COUNT(*)::int FROM conversations) AS conversations,
          (SELECT COUNT(*)::int FROM leads) AS leads,
          (SELECT COUNT(*)::int FROM conversations WHERE created_at >= NOW() - INTERVAL '7 days') AS conversations_7d
      `),
      query(`
        SELECT c.id, c.title, c.created_at, c.updated_at, COUNT(m.id)::int AS message_count
        FROM conversations c
        LEFT JOIN messages m ON m.conversation_id = c.id
        GROUP BY c.id
        ORDER BY c.updated_at DESC
        LIMIT 12
      `),
      query(`
        SELECT id, name, email, company, status, created_at
        FROM leads
        ORDER BY created_at DESC
        LIMIT 8
      `),
    ]);
    return json({
      admin,
      stats: summary.rows[0],
      conversations: conversations.rows,
      leads: leads.rows,
    });
  } catch {
    return json(
      { error: "No se ha podido cargar el panel. Comprueba que las migraciones de base de datos estén aplicadas." },
      503,
    );
  }
}

export async function handleAdminConversation(request: Request): Promise<Response> {
  const admin = await requireAdmin(request);
  if (!admin) return unauthorized();
  const id = new URL(request.url).searchParams.get("id");
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) return json({ error: "Identificador no válido." }, 400);
  try {
    const result = await query(
      "SELECT role, content, created_at FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC LIMIT 200",
      [id],
    );
    return json({ messages: result.rows });
  } catch {
    return json({ error: "No se ha podido recuperar la conversación." }, 503);
  }
}
