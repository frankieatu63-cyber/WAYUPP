import { createAuth } from "./auth";
import { isAdminEmail } from "./env";

export type AdminIdentity = { id: string; email: string; name: string };

/** Sesión válida + correo verificado + correo en la allowlist del servidor. Si no, `null`. */
export async function requireAdmin(request: Request): Promise<AdminIdentity | null> {
  try {
    const auth = createAuth(new URL(request.url).origin);
    const session = await auth.api.getSession({ headers: request.headers });
    const user = session?.user;
    if (!user?.id || !user.email || !user.emailVerified) return null;
    if (!isAdminEmail(user.email)) return null;
    return { id: user.id, email: user.email.toLowerCase(), name: user.name || user.email };
  } catch {
    return null;
  }
}
