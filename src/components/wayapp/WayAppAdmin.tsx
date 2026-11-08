import { Link } from "@tanstack/react-router";
import { createAuthClient } from "better-auth/react";
import { Activity, ArrowLeft, LockKeyhole, LogOut, MessageSquare, RefreshCw, ShieldCheck, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// Mismo origen que la web: no hace falta baseURL.
const authClient = createAuthClient();

type Overview = {
  admin: { id: string; email: string; name: string };
  stats: { conversations: number; leads: number; conversations_7d: number };
  conversations: Array<{ id: string; title: string; created_at: string; updated_at: string; message_count: number }>;
  leads: Array<{ id: string; name: string; email: string; company: string | null; status: string; created_at: string }>;
};

export function WayAppAdmin() {
  const { data: session, isPending } = authClient.useSession();
  const userId = session?.user?.id;
  const [googleConfigured, setGoogleConfigured] = useState<boolean | null>(null);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/status", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: { googleConfigured?: boolean }) => setGoogleConfigured(Boolean(data.googleConfigured)))
      .catch(() => setGoogleConfigured(false));
  }, []);

  const loadOverview = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/overview", { credentials: "same-origin", cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se ha podido cargar el panel.");
      setOverview(data as Overview);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) void loadOverview();
  }, [userId, loadOverview]);

  async function signIn() {
    setError("");
    try {
      await authClient.signIn.social({ provider: "google", callbackURL: "/admin" });
    } catch {
      setError("No se ha podido iniciar sesión. Comprueba la configuración OAuth de Google.");
    }
  }

  async function signOut() {
    await authClient.signOut();
    setOverview(null);
  }

  return (
    <div className="wa-root wa-admin">
      <header className="wa-admin-topbar">
        <Link to="/" className="wa-admin-brand">
          <span className="wa-admin-mark">W.</span>
          <span>
            WAY.APP <small>ADMIN</small>
          </span>
        </Link>
        <Link to="/" className="wa-admin-back">
          <ArrowLeft size={15} /> Volver a WAY UP
        </Link>
      </header>
      <main className="wa-admin-main">
        {isPending ? (
          <div className="wa-admin-loading">Comprobando sesión segura…</div>
        ) : !session?.user ? (
          <section className="wa-admin-login">
            <div className="wa-admin-login-icon">
              <LockKeyhole size={22} />
            </div>
            <p className="wa-admin-kicker">ZONA PRIVADA</p>
            <h1>
              Acceso de <em>administración.</em>
            </h1>
            <p>
              Este espacio está reservado al equipo autorizado de WAY UP. La identidad se verifica en el
              servidor y solo se admiten cuentas incluidas en la lista privada de administradores.
            </p>
            {googleConfigured === false && (
              <div className="wa-admin-notice">
                El acceso con Google aún no está configurado. Faltan las credenciales OAuth de Google o el
                secreto de sesión en el entorno del servidor.
              </div>
            )}
            {error && <div className="wa-admin-error">{error}</div>}
            <button type="button" className="wa-admin-primary" onClick={() => void signIn()} disabled={!googleConfigured}>
              <ShieldCheck size={17} /> Continuar con Google
            </button>
            <span className="wa-admin-footnote">Acceso protegido · No hay registro público</span>
          </section>
        ) : (
          <section>
            <div className="wa-admin-heading">
              <div>
                <p className="wa-admin-kicker">CENTRO DE CONTROL</p>
                <h1>
                  Panel <em>WAY.APP.</em>
                </h1>
                <p className="wa-admin-subtitle">Sesión verificada: {session.user.email}</p>
              </div>
              <div className="wa-admin-actions">
                <button type="button" className="wa-admin-secondary" onClick={() => void loadOverview()} disabled={loading}>
                  <RefreshCw size={15} /> Actualizar
                </button>
                <button type="button" className="wa-admin-secondary" onClick={() => void signOut()}>
                  <LogOut size={15} /> Salir
                </button>
              </div>
            </div>
            {error && <div className="wa-admin-error">{error}</div>}
            <div className="wa-admin-stats">
              <article>
                <span><MessageSquare size={17} /></span>
                <strong>{overview?.stats.conversations ?? "—"}</strong>
                <small>Conversaciones</small>
              </article>
              <article>
                <span><Users size={17} /></span>
                <strong>{overview?.stats.leads ?? "—"}</strong>
                <small>Contactos captados</small>
              </article>
              <article>
                <span><Activity size={17} /></span>
                <strong>{overview?.stats.conversations_7d ?? "—"}</strong>
                <small>Conversaciones · 7 días</small>
              </article>
            </div>
            <div className="wa-admin-columns">
              <section className="wa-admin-card">
                <div className="wa-admin-card-head">
                  <h2>Conversaciones recientes</h2>
                  <span>{overview?.conversations.length ?? 0}</span>
                </div>
                {loading && !overview ? (
                  <p className="wa-admin-empty">Cargando datos…</p>
                ) : overview?.conversations.length ? (
                  <div className="wa-admin-list">
                    {overview.conversations.map((item) => (
                      <article key={item.id}>
                        <div>
                          <strong>{item.title}</strong>
                          <small>
                            {new Date(item.updated_at).toLocaleString("es-ES")} · {item.message_count} mensajes
                          </small>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="wa-admin-empty">Todavía no hay conversaciones guardadas.</p>
                )}
              </section>
              <section className="wa-admin-card">
                <div className="wa-admin-card-head">
                  <h2>Contactos</h2>
                  <span>{overview?.leads.length ?? 0}</span>
                </div>
                {overview?.leads.length ? (
                  <div className="wa-admin-list">
                    {overview.leads.map((lead) => (
                      <article key={lead.id}>
                        <div>
                          <strong>{lead.name}</strong>
                          <small>
                            {lead.email}
                            {lead.company ? ` · ${lead.company}` : ""}
                          </small>
                        </div>
                        <span className="wa-admin-status">{lead.status}</span>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="wa-admin-empty">Aún no hay contactos. El formulario de captación llegará en la siguiente fase.</p>
                )}
              </section>
            </div>
            <p className="wa-admin-secure-note">
              <ShieldCheck size={15} /> Datos privados · Sesión y permisos comprobados en el servidor
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
