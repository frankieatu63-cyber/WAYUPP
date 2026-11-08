# Way Up Growth Agency

Act as a Senior Front-End Developer, expert UX/UI designer, and luxury web designer (inspired by Apple, Nike, and Adidas aesthetic standards). Your task is to build the new corporate website for "Way Up", a digital marketing agency that bridges traditional and digital growth under the core concept of "Digital Sovereignty" (Soberanía Digital) for clients.

### 1. Tech Stack & Performance Requirements

- Framework: React (with TypeScript and Vite).

- Styling: Tailwind CSS for clean, modern, and responsive design.

- Animations & Interactivity: Framer Motion (for fluid text transitions, smooth scroll-in animations, and subtle micro-interactions on buttons and cards).

- Icons: Lucide React.

### 2. Design Guidelines & Visual Aesthetics ("High-End Minimalism")

- Color Palette:

  - Main Background: Clean neutral / Corporate off-white or soft cream (e.g., `#FDFBF7` or `#F9F8F6`).

  - Typography & Headings: Deep charcoal black or dark navy blue for high legibility.

  - Brand Accents: Vibrant cobalt blue (`#2563EB`) and subtle institutional violet/purple accents for key CTAs.

- Typography: Large-format editorial serif headers combined with clean, geometric sans-serif body fonts.

- Spacing: Generous whitespace, structured cards with subtle borders, smooth rounded corners, and soft, understated shadows.

### 3. Structure & Website Sections

Build a Single Page Application (SPA) or a smoothly scrolling multi-section website containing the following key sections:

- **A. Navigation (Sticky Header):**

  - "Way Up" typographic logo on the left.

  - Central navigation links: Servicios, Método, Sobre nosotros, Contacto.

  - Primary CTA button on the right: "Solicitar auditoría gratuita" with an interactive hover effect.

- **B. Hero Section (Inicio):**

  - High-impact headline (large font, left-aligned, in Spanish): "Más clientes para tu negocio, sin depender de una agencia para siempre".

  - Subtitle: "Te hacemos una página que convierta visitas en llamadas y que te encuentren en Google. Así recibes clientes de verdad, y nosotros te acompañamos hasta que puedas seguir creciendo por tu cuenta."

  - Dual CTAs: "Pide tu diagnóstico gratuito" and "Hablar con Way Up".

- **C. Core Pillars / Services Block ("Lo que construimos contigo"):**

  - Grid of 3 interactive cards with clean, minimalist icons (Content in Spanish):

    1. Estrategia & Publicidad 360° (Offline/online campaigns, branding, custom lead gen).

    2. Landing Pages & SEO Local (High-conversion websites and Google Maps dominance).

    3. Automatización & Agentes IA (Intelligent systems to handle, qualify, and close clients 24/7).

- **D. Service Model: The 3 Phases of Digital Sovereignty (Method Section):**

  - An interactive Tab component or step-by-step sequence (Stepper) detailing the client's transformational journey (Content in Spanish):

    - **Fase 1: Impulso Inicial (Dependencia controlada)** -> Agency takes immediate operational control, quick wins, and initial setup.

    - **Fase 2: Mentoría, Formación y Entrega de Herramientas (Empowerment)** -> Academy modules, tool arsenal, templates, and "how-to" guidance.

    - **Fase 3: Autonomía y Sostenibilidad (Dominio del Nicho)** -> Client breaks dependency chains, manages independent campaigns, and rules their digital kingdom.

- **E. Social Proof / Success Stories (Interactive):**

  - Interactive carousel or slider showcasing real client case studies (local businesses, sports conditioning centers, etc.) with before-and-after metrics to build absolute trust.

- **F. FAQ Section / Working Process:**

  - Clean, expandable accordion answering common questions about timelines, training, and client autonomy.

- **G. Professional Footer:**

  - Quick navigation links, legal notices (Privacy, Terms), and social media links (LinkedIn, Instagram).

### 4. Code Quality & Modularity

- Modularize the code into clean components inside `src/components/`.

- Implement smooth text transitions and fade-in/slide-in effects using Framer Motion for section shifts and accordions.

- The design must be 100% responsive, meticulously optimized for mobile, tablet, and desktop viewports.

- **IMPORTANT**: All user-facing text, headings, buttons, and labels MUST be written in correct Spanish (Castellano) as provided above.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Ejecutar en local (Way Up)

Requisitos: Node.js 20 o superior (probado con 22) y npm.

```sh
npm install
npm run dev        # servidor de desarrollo (URL que imprime Vite)
npm run build      # build de producción
npm run test       # tests de rutas
```

WAY.APP (asistente de IA + panel `/admin`) está integrado en este proyecto: ver `docs/WAYAPP-INTEGRACION.md`.
Para desarrollo con backend, copia `.env.example` a `.env` y usa `npm run dev:env`.

Notas:
- Los logos viven ahora en `src/assets/wayup-logo.png` (disco crema, usado en cabecera, pie y marca de agua del bloque de contacto) y `src/assets/wayup-logo-cobalt.png` (disco cobalto, disponible pero sin uso en el código original). Antes se cargaban desde URLs internas de Lovable (`/__l5e/assets-v1/...`) que no funcionan fuera de Lovable.
- Email de contacto y enlaces de LinkedIn/Instagram: `src/components/site-nav.ts`. Los enlaces sociales son los genéricos del original (`linkedin.com`, `instagram.com`): sustitúyelos por los perfiles reales.
