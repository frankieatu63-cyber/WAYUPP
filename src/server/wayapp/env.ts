/**
 * Lectura de variables de entorno del servidor.
 *
 * Se accede de forma perezosa (en cada llamada) y nunca al importar el módulo: así, si falta
 * alguna variable de WAY.APP, el resto de la web de WAY UP sigue funcionando y solo fallan
 * los endpoints de WAY.APP.
 */
type EnvBag = Record<string, string | undefined>;

export function getEnv(name: string): string | undefined {
  const bag = (globalThis as unknown as { process?: { env?: EnvBag } }).process?.env;
  const value = bag?.[name]?.trim();
  return value ? value : undefined;
}

export function adminEmails(): string[] {
  return (getEnv("WAYAPP_ADMIN_EMAILS") ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string): boolean {
  return adminEmails().includes(email.trim().toLowerCase());
}

export function extraAllowedOrigins(): string[] {
  return (getEnv("WAYAPP_ALLOWED_ORIGINS") ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}
