import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Quote } from "lucide-react";

import caseGym from "@/assets/case-gym.jpg";
import caseReformas from "@/assets/case-reformas.jpg";
import caseClinica from "@/assets/case-clinica.jpg";
import { Reveal, SectionHeading, easeLux } from "./Reveal";
const SHOW_CASES = false;
type Metric = { label: string; before: string; after: string };
type CaseStudy = {
  sector: string;
  name: string;
  city: string;
  image: string;
  quote: string;
  author: string;
  metrics: Metric[];
};

const CASES: CaseStudy[] = [
  {
    sector: "Centro de acondicionamiento deportivo",
    name: "Performance Lab",
    city: "Salamanca",
    image: caseGym,
    quote:
      "Antes vivíamos del boca a boca. Ahora la agenda se llena sola y, lo mejor, sabemos gestionar las campañas nosotros mismos.",
    author: "Director del centro",
    metrics: [
      { label: "Solicitudes al mes", before: "6", after: "41" },
      { label: "Posición en Google Maps", before: "Top 20", after: "Top 3" },
      { label: "Coste por cliente", before: "38 €", after: "14 €" },
    ],
  },
  {
    sector: "Reformas integrales",
    name: "Reformas Tormes",
    city: "Salamanca",
    image: caseReformas,
    quote:
      "El agente de WhatsApp responde en minutos y filtra a quien de verdad quiere reformar. Cerramos el triple de presupuestos.",
    author: "Gerente",
    metrics: [
      { label: "Llamadas al mes", before: "9", after: "34" },
      { label: "Presupuestos cerrados", before: "12 %", after: "31 %" },
      { label: "Tiempo de respuesta", before: "24 h", after: "5 min" },
    ],
  },
  {
    sector: "Clínica de fisioterapia",
    name: "Fisio Plaza",
    city: "Valladolid",
    image: caseClinica,
    quote:
      "Pasamos de depender del teléfono a tener citas reservadas online cada día. Y entendemos cada número del panel.",
    author: "Fisioterapeuta y fundadora",
    metrics: [
      { label: "Citas online al mes", before: "0", after: "120" },
      { label: "Reseñas en Google", before: "14", after: "186" },
      { label: "Citas no presentadas", before: "22 %", after: "6 %" },
    ],
  },
];

const variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
};

export function Cases() {
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const item = CASES[index]!;

  const go = useCallback((d: number) => {
    setState(([i]) => [(i + d + CASES.length) % CASES.length, d]);
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => go(1), 8000);
    return () => clearInterval(t);
  }, [paused, go, index]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) go(1);
    else if (info.offset.x > 60) go(-1);
  };
  if (!SHOW_CASES) return null;
  return (
    <section
      id="casos"
      className="grain overflow-hidden bg-ink py-24 text-ink-foreground md:py-36"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container-wide relative">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            tone="inverse"
            eyebrow="Casos de éxito"
            title="Negocios reales. Resultados que se notan."
          />
          <Reveal delay={0.1} className="flex items-center gap-3">
            <span className="mr-2 font-serif text-lg text-ink-foreground/60">
              <span className="text-ink-foreground">0{index + 1}</span> / 0{CASES.length}
            </span>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Caso anterior"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-ink-foreground/25 transition-colors hover:border-ink-foreground hover:bg-ink-foreground hover:text-ink"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Caso siguiente"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </Reveal>
        </div>

        <div className="relative mt-14" aria-live="polite">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.article
              key={item.name}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: easeLux }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={onDragEnd}
              className="grid cursor-grab gap-0 overflow-hidden rounded-3xl border border-ink-foreground/10 bg-ink-foreground/[0.04] active:cursor-grabbing lg:grid-cols-12"
            >
              <div className="relative aspect-[4/3] lg:col-span-5 lg:aspect-auto">
                <img
                  src={item.image}
                  alt={`${item.sector} en ${item.city}`}
                  width={1280}
                  height={960}
                  loading="lazy"
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute left-5 top-5 flex items-center gap-1.5 rounded-full bg-paper/90 px-3 py-1.5 text-xs font-semibold text-ink backdrop-blur">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  {item.city}
                </div>
              </div>

              <div className="flex flex-col p-8 md:p-12 lg:col-span-7">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-soft/80">
                  {item.sector}
                </p>
                <h3 className="mt-2 text-3xl font-normal text-ink-foreground md:text-4xl">
                  {item.name}
                </h3>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {item.metrics.map((m, i) => (
                    <motion.div
                      key={m.label}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.08, duration: 0.6, ease: easeLux }}
                      className="rounded-2xl border border-ink-foreground/10 bg-ink-foreground/[0.04] p-5"
                    >
                      <p className="text-xs text-ink-foreground/60">{m.label}</p>
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-sm text-ink-foreground/45 line-through decoration-ink-foreground/30">
                          {m.before}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 self-center text-primary-soft/70" />
                        <span className="font-serif text-3xl text-ink-foreground">{m.after}</span>
                      </div>
                      <div className="mt-3 flex gap-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em]">
                        <span className="text-ink-foreground/40">Antes</span>
                        <span className="text-ink-foreground/25">·</span>
                        <span className="text-primary-soft">Después</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <blockquote className="mt-auto pt-10">
                  <Quote className="h-6 w-6 text-primary-soft/60" />
                  <p className="mt-4 font-serif text-xl leading-snug text-ink-foreground/90 md:text-2xl">
                    “{item.quote}”
                  </p>
                  <footer className="mt-4 text-sm text-ink-foreground/55">
                    {item.author}, {item.name}
                  </footer>
                </blockquote>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {CASES.map((c, i) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setState([i, i > index ? 1 : -1])}
              aria-label={`Ver caso ${i + 1}: ${c.name}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === index ? "w-10 bg-primary-soft" : "w-4 bg-ink-foreground/25 hover:bg-ink-foreground/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
