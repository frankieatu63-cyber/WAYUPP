# WAY.APP dentro de WAY UP

WAY.APP (asistente de IA, chat, persistencia y panel de administración) vive ahora **dentro** de este
proyecto. Ya no hay un segundo despliegue, ni un `<script>` externo, ni un iframe: un solo repositorio,
un solo despliegue y un solo dominio.

## Antes y ahora

| | Antes | Ahora |
|---|---|---|
| Widget | `<script src=".../embed.js">` → iframe a `/embed` de otra app | Componente React `WayAppWidget` montado en `__root.tsx` |
| Lanzador del hero | `#wayapp-hero-widget` rellenado por el script | `WayAppHeroLauncher` (React, sin problemas de hidratación) |
| API | Funciones Vercel / Worker en otro dominio | Rutas de servidor de TanStack Start en `/api/*`, mismo origen |
| Admin | `/admin` de la otra app | `/admin` de WAY UP |
| Despliegues | 2 | 1 |

## Mapa de archivos

```
src/server/wayapp/        Lógica de servidor (solo se ejecuta en el servidor)
  chat.ts                 Validación, origen, rate limit, persistencia y streaming con Groq
  prompt.ts               Instrucciones del asistente (aquí se edita lo que "sabe")
  db.ts                   Consultas a Neon por HTTP (sin pool; válido en Workers y Node)
  rate-limit.ts           Límite por IP en Upstash; falla cerrado
  auth.ts / admin-auth.ts Better Auth + Google + allowlist de administradores
  admin.ts / health.ts    Handlers del panel y de la sonda de estado
  env.ts                  Lectura perezosa de variables (nunca rompe el resto de la web)
src/routes/api/           /api/chat · /api/health · /api/auth/* · /api/admin/*
src/routes/admin.tsx      Página /admin (noindex)
src/components/wayapp/    WayAppWidget · WayAppChat · WayAppHeroLauncher · WayAppAdmin · wayapp.css
db/migrations/            0001_wayapp.sql
```

Abrir el chat desde cualquier botón de la web: `window.dispatchEvent(new Event("wayapp:open"))`
(o `openWayApp()` exportada desde `WayAppWidget.tsx`).

Los estilos de WAY.APP están aislados (`.wa-*`, `--wa-*`) y no tocan los de WAY UP.

## Variables de entorno

Ver `.env.example`. Todas son de servidor. En Cloudflare: `npx wrangler secret put NOMBRE` o el panel.
`GET /api/health` indica con booleanos qué falta.

## Puesta en marcha local

```sh
npm install                # instala better-auth y @neondatabase/serverless y actualiza package-lock.json
cp .env.example .env       # rellenar
npm run dev:env            # igual que `dev`, pero cargando .env
```

La primera vez que arranque `dev` o `build`, el plugin de TanStack **regenera `src/routeTree.gen.ts`**
con las rutas nuevas (`/admin`, `/api/*`). Haz commit de ese archivo regenerado.

## Pasar a producción (orden recomendado)

1. **Preview primero.** Despliega esta rama como preview con las variables definidas.
2. **Base de datos.** Puedes reutilizar la misma base Neon de WayAppDef: la migración es `IF NOT EXISTS`,
   así que es segura y conservas el histórico. Si es nueva, aplica `db/migrations/0001_wayapp.sql` en el SQL Editor de Neon.
3. **Google OAuth.** En Google Cloud, añade como URI de redirección autorizada
   `https://<tu-dominio>/api/auth/callback/google` (y la del preview si vas a probar el login ahí).
   Pon `BETTER_AUTH_URL=https://<tu-dominio>`.
4. **Comprueba** `https://<preview>/api/health` → debe devolver `{"ready": true}`.
5. **Pruebas funcionales:** abrir el chat desde el botón flotante y desde el hero; enviar un mensaje y ver el streaming;
   comprobar que la conversación aparece en `/admin`; entrar a `/admin` con un correo **no** autorizado (debe fallar);
   repetir mensajes hasta recibir el 429 del límite.
6. **Corte.** Publica en producción. Los administradores deberán iniciar sesión de nuevo (la cookie es de otro dominio).
7. **Retirada.** Cuando todo esté verificado, apaga el Worker `wayappdef.francopdimauro.workers.dev` / el proyecto Vercel
   y archiva el repositorio WayAppDef como referencia. Antes de retirarlo, guarda sus variables de entorno.
   Rota `GROQ_API_KEY` si ha estado copiada en más sitios de los necesarios.

**Reversión:** el antiguo despliegue sigue funcionando mientras no lo apagues; para volver atrás basta con
revertir el commit de integración en WAY UP (restituye el `<script>` en `__root.tsx`).

## Puntos que hay que verificar en el primer despliegue

Esta integración se ha escrito y probado la lógica del servidor con dependencias simuladas, pero **no se ha podido
compilar ni ejecutar la web completa** (sin acceso a npm). Verifica, por este orden:

- `npm run build` y `npm run test` pasan (el test de rutas incluye `/admin` y `/api/*`; necesita el `routeTree.gen.ts` regenerado).
- **Variables en el runtime.** El código lee `process.env`. En Cloudflare funciona con el flag `nodejs_compat`
  (el preset de Nitro para Cloudflare lo suele incluir). Si `/api/health` dice que falta todo, es esto.
- **Better Auth sobre Workers** es la pieza con más riesgo: usa el `Pool` de `@neondatabase/serverless`, creado por petición.
  Si falla el login en el preview, los logs lo dirán; el chat no depende de él (usa Neon por HTTP).
- **Streaming**: confirma que la respuesta llega por trozos y no de golpe en tu hosting.

## Seguridad (se mantiene lo de WayAppDef)

Secretos solo en servidor · validación y límites de tamaño · control de `Origin` · rate limit distribuido que **falla cerrado**
(si Redis cae, no se llama a la IA) · token de visitante en cookie HttpOnly y solo su hash en base de datos ·
admin con sesión + correo verificado + allowlist comprobados en cada endpoint · `/admin` y `/api/` excluidos en `robots.txt`.
Mejoras sobre el original: la cookie `Secure` se decide por el protocolo real de la petición (no por `NODE_ENV`) y se usa la IP
de Cloudflare (`cf-connecting-ip`) para el límite.

## Pendiente (no incluido)

- Formulario de captación de leads, base de conocimiento y retención/purga: figuraban como "siguiente fase" en WayAppDef.
- Textos del widget solo en español (el asistente sí responde en el idioma del visitante). WAY UP tiene es/en/fr/zh en `src/i18n/`.
- La política de privacidad debe mencionar el chat con IA y la conservación de conversaciones antes de abrirlo al público.
