
## Project rules
- Homepage is one scrolling page: each section is a component in `src/components/` and nav links use `/#section` anchors so they work from any route. Why: the brief asked for a single smoothly scrolling site.
- Animations use framer-motion via the shared `Reveal`/`easeLux` helpers in `src/components/Reveal.tsx`. Why: consistent motion language across sections.
- Contact email and social URLs live only in `src/components/site-nav.ts`. Why: one place to swap placeholders for real details.
- WAY.APP (chat, API y admin) vive en `src/server/wayapp/` + `src/routes/api/` + `src/components/wayapp/`. Sus estilos usan solo clases `.wa-*` y tokens `--wa-*`; no añadir estilos globales. Las variables de entorno se leen solo con `getEnv()` y nunca al importar el módulo. Why: no puede romper la web de marketing si falta configuración.
