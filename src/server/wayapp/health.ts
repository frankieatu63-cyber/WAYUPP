import { query } from "./db";
import { getEnv } from "./env";
import { isGoogleAuthConfigured } from "./auth";

/** Sonda pública de estado. Solo devuelve booleanos: nunca secretos, URLs ni errores internos. */
export async function handleHealth(): Promise<Response> {
  const checks = {
    aiProvider: Boolean(getEnv("GROQ_API_KEY")),
    googleOAuth: isGoogleAuthConfigured(),
    database: false,
    applicationSchema: false,
    rateLimitStore: false,
  };

  try {
    const result = await query<Record<string, boolean>>(`
      SELECT
        to_regclass('public.conversations') IS NOT NULL AS conversations,
        to_regclass('public.messages') IS NOT NULL AS messages,
        to_regclass('public.leads') IS NOT NULL AS leads,
        to_regclass('public.user') IS NOT NULL AS auth_user,
        to_regclass('public.session') IS NOT NULL AS auth_session,
        to_regclass('public.account') IS NOT NULL AS auth_account,
        to_regclass('public.verification') IS NOT NULL AS auth_verification
    `);
    checks.database = true;
    const row = result.rows[0];
    checks.applicationSchema = Boolean(
      row &&
        row["conversations"] && row["messages"] && row["leads"] &&
        row["auth_user"] && row["auth_session"] && row["auth_account"] && row["auth_verification"],
    );
  } catch {
    /* Sonda deliberadamente no diagnóstica. */
  }

  const redisUrl = (getEnv("KV_REST_API_URL") ?? getEnv("UPSTASH_REDIS_REST_URL"))?.replace(/\/$/, "");
  const redisToken = getEnv("KV_REST_API_TOKEN") ?? getEnv("UPSTASH_REDIS_REST_TOKEN");
  if (redisUrl && redisToken) {
    try {
      const response = await fetch(redisUrl + "/ping", {
        headers: { Authorization: "Bearer " + redisToken },
        signal: AbortSignal.timeout(2000),
        cache: "no-store",
      });
      if (response.ok) {
        const payload = (await response.json()) as { result?: unknown };
        checks.rateLimitStore = payload.result === "PONG";
      }
    } catch {
      /* Idem. */
    }
  }

  const ready =
    checks.aiProvider && checks.database && checks.applicationSchema && checks.rateLimitStore;
  return Response.json(
    { status: ready ? "ready" : "degraded", ready, checks },
    {
      status: ready ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "no-referrer",
      },
    },
  );
}
