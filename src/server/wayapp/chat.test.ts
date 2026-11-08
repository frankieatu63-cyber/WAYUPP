import { afterEach, describe, expect, it } from "vitest";

import { isAllowedOrigin, validateMessages } from "./chat";
import { isAdminEmail } from "./env";

const post = (origin: string | null, url = "https://wayup.es/api/chat") =>
  new Request(url, { method: "POST", headers: origin ? { origin } : {} });

describe("validateMessages", () => {
  it("acepta una conversación válida y recorta espacios", () => {
    expect(validateMessages({ messages: [{ role: "user", content: " hola " }] })).toEqual([
      { role: "user", content: "hola" },
    ]);
  });

  it("exige que el último mensaje sea del usuario", () => {
    expect(validateMessages({ messages: [{ role: "assistant", content: "x" }] })).toBeNull();
  });

  it("rechaza roles no permitidos (p. ej. system) y contenidos vacíos", () => {
    expect(validateMessages({ messages: [{ role: "system", content: "x" }] })).toBeNull();
    expect(validateMessages({ messages: [{ role: "user", content: "   " }] })).toBeNull();
  });

  it("limita la longitud del usuario a 2.000 caracteres y a 16 mensajes", () => {
    expect(validateMessages({ messages: [{ role: "user", content: "a".repeat(2001) }] })).toBeNull();
    expect(validateMessages({ messages: [{ role: "user", content: "a".repeat(2000) }] })).not.toBeNull();
    const many = Array.from({ length: 17 }, () => ({ role: "user", content: "x" }));
    expect(validateMessages({ messages: many })).toBeNull();
  });
});

describe("isAllowedOrigin", () => {
  afterEach(() => {
    delete process.env["WAYAPP_ALLOWED_ORIGINS"];
  });

  it("acepta el propio origen de la web y rechaza el resto", () => {
    expect(isAllowedOrigin(post("https://wayup.es"))).toBe(true);
    expect(isAllowedOrigin(post("https://evil.com"))).toBe(false);
    expect(isAllowedOrigin(post(null))).toBe(false);
    expect(isAllowedOrigin(post("http://wayup.es"))).toBe(false);
  });

  it("acepta orígenes extra configurados", () => {
    process.env["WAYAPP_ALLOWED_ORIGINS"] = "https://www.wayup.es";
    expect(isAllowedOrigin(post("https://www.wayup.es"))).toBe(true);
  });

  it("solo admite localhost cuando la propia petición es local", () => {
    expect(isAllowedOrigin(post("http://localhost:3000"))).toBe(false);
    expect(isAllowedOrigin(post("http://localhost:3000", "http://localhost:3000/api/chat"))).toBe(true);
  });
});

describe("allowlist de administradores", () => {
  afterEach(() => {
    delete process.env["WAYAPP_ADMIN_EMAILS"];
  });

  it("compara sin distinguir mayúsculas y deniega todo si está vacía", () => {
    process.env["WAYAPP_ADMIN_EMAILS"] = "A@x.com, b@y.com";
    expect(isAdminEmail("a@X.com")).toBe(true);
    expect(isAdminEmail("c@x.com")).toBe(false);
    delete process.env["WAYAPP_ADMIN_EMAILS"];
    expect(isAdminEmail("a@x.com")).toBe(false);
  });
});
