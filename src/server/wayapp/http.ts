const BASE_HEADERS = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
} as const;

export function json(data: unknown, status = 200): Response {
  return Response.json(data, { status, headers: BASE_HEADERS });
}

export function unauthorized(): Response {
  return json({ error: "No autorizado." }, 401);
}

export function isLocalHost(url: URL): boolean {
  return url.hostname === "localhost" || url.hostname === "127.0.0.1";
}
