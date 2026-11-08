import { neon } from "@neondatabase/serverless";

import { getEnv } from "./env";

export type QueryResult<T> = { rows: T[]; rowCount: number };

/**
 * Consultas a Neon por HTTP: sin conexiones persistentes ni pool, por lo que funciona igual en
 * Cloudflare Workers, Vercel y Node. Cada llamada es una sola sentencia SQL.
 */
export async function query<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<QueryResult<T>> {
  const url = getEnv("NEON_DATABASE_URL") ?? getEnv("NEON_POSTGRES_URL");
  if (!url) throw new Error("Neon database is not configured (NEON_DATABASE_URL).");
  const sql = neon(url, { fullResults: true });
  const result = await sql.query(text, params);
  return { rows: result.rows as T[], rowCount: result.rowCount ?? result.rows.length };
}

/** Registra solo diagnósticos estructurales de PostgreSQL; nunca SQL, credenciales ni mensajes. */
export function logDatabaseError(context: string, error: unknown) {
  const value = error && typeof error === "object" ? (error as Record<string, unknown>) : {};
  console.error("[wayapp:db] " + context, {
    code: typeof value["code"] === "string" ? value["code"] : undefined,
    table: typeof value["table"] === "string" ? value["table"] : undefined,
    column: typeof value["column"] === "string" ? value["column"] : undefined,
    constraint: typeof value["constraint"] === "string" ? value["constraint"] : undefined,
  });
}
