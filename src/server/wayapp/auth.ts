import { Pool } from "@neondatabase/serverless";
import { betterAuth } from "better-auth";

import { extraAllowedOrigins, getEnv, isAdminEmail } from "./env";

/**
 * Better Auth con Google OAuth y allowlist de administradores.
 *
 * Se crea una instancia por petición (patrón recomendado en Workers: los pools/conexiones no
 * deben compartirse entre peticiones). Solo la usan /admin y /api/auth/*, de tráfico muy bajo.
 * `origin` es el origen de la petición actual; BETTER_AUTH_URL tiene prioridad si está definido.
 */
export function createAuth(origin: string) {
  const secret = getEnv("BETTER_AUTH_SECRET");
  if (!secret || secret.length < 32) {
    throw new Error("BETTER_AUTH_SECRET must be configured with at least 32 characters.");
  }
  const connectionString = getEnv("NEON_DATABASE_URL") ?? getEnv("NEON_POSTGRES_URL");
  if (!connectionString) throw new Error("Neon database is not configured (NEON_DATABASE_URL).");

  const baseURL = getEnv("BETTER_AUTH_URL") ?? origin;
  const clientId = getEnv("GOOGLE_CLIENT_ID");
  const clientSecret = getEnv("GOOGLE_CLIENT_SECRET");

  return betterAuth({
    database: new Pool({ connectionString, max: 1 }),
    baseURL,
    secret,
    trustedOrigins: [...new Set([baseURL, origin, ...extraAllowedOrigins()])],
    socialProviders: clientId && clientSecret ? { google: { clientId, clientSecret } } : {},
    emailAndPassword: { enabled: false },
    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            // Nadie fuera de la allowlist puede crear cuenta.
            if (!isAdminEmail(user.email)) return false;
            return { data: user };
          },
        },
      },
    },
    advanced: {
      useSecureCookies: baseURL.startsWith("https://"),
      defaultCookieAttributes: {
        httpOnly: true,
        sameSite: "lax",
        secure: baseURL.startsWith("https://"),
      },
    },
  });
}

export function isGoogleAuthConfigured(): boolean {
  return Boolean(
    getEnv("GOOGLE_CLIENT_ID") &&
      getEnv("GOOGLE_CLIENT_SECRET") &&
      (getEnv("BETTER_AUTH_SECRET")?.length ?? 0) >= 32,
  );
}
