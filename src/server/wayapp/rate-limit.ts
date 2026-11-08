import { getEnv } from "./env";

const WINDOW_SECONDS = 600;
const MAX_REQUESTS_PER_WINDOW = 20;

/**
 * Límite distribuido por IP en Upstash Redis (REST). Devuelve `true` si la IP se ha pasado del límite.
 * Lanza si Redis no está disponible: el llamador debe FALLAR CERRADO y no llamar al proveedor de IA.
 */
export async function isOverLimit(ip: string): Promise<boolean> {
  const url = (getEnv("KV_REST_API_URL") ?? getEnv("UPSTASH_REDIS_REST_URL"))?.replace(/\/$/, "");
  const token = getEnv("KV_REST_API_TOKEN") ?? getEnv("UPSTASH_REDIS_REST_TOKEN");
  if (!url || !token) throw new Error("Rate limiter is not configured");

  const key = `wayapp:chat:ip:${ip.replace(/[^a-zA-Z0-9:._-]/g, "_")}`;
  const script =
    "local n = redis.call('INCR', KEYS[1]); if n == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]); end; return n";
  const response = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify([["EVAL", script, "1", key, String(WINDOW_SECONDS)]]),
    signal: AbortSignal.timeout(2500),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Rate limiter unavailable");
  const result = (await response.json()) as Array<{ result?: number; error?: string }>;
  const count = Number(result?.[0]?.result);
  if (!Number.isFinite(count)) throw new Error("Invalid rate limiter response");
  return count > MAX_REQUESTS_PER_WINDOW;
}
