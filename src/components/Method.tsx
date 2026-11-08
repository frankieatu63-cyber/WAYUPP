import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Crown, GraduationCap, Rocket, type LucideIcon } from "lucide-react";

import { useLocale } from "@/i18n/LocaleProvider";
import { Reveal, SectionHeading, easeLux } from "./Reveal";

type Phase = {
  id: string;
  icon: LucideIcon;
  label: string;
  title: string;
  tag: string;
  duration: string;
  autonomy: number;
  description: string;
  deliverables: string[];
};

/** Non-text data of each phase, in the same order as `t.method.phases`. */
const PHASE_META = [
  { id: "fase-1", icon: Rocket, autonomy: 20 },
  { id: "fase-2", icon: GraduationCap, autonomy: 60 },
  { id: "fase-3", icon: Crown, autonomy: 100 },
];

export function Method() {
  const { t } = useLocale();
  const copy = t.method;
  const PHASES: Phase[] = copy.phases.map((p, i) => ({ ...p, ...PHASE_META[i]! }));
  const [active, setActive] = useState(0);
  const phase = PHASES[active]!;

  return (
    <section id="metodo" className="relative border-y border-border bg-paper py-24 md:py-36">
      <div className="container-wide">
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={
            <>
              {copy.titleBefore}
              <em className="text-primary">{copy.titleAccent}</em>
              {copy.titleAfter}
            </>
          }
          intro={copy.intro}
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-12 lg:gap-10">
          {/* Stepper */}
          <Reveal className="lg:col-span-5">
            <div role="tablist" aria-label={copy.tablistLabel} className="relative flex flex-col gap-3">
              {PHASES.map((p, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={p.id}
                    role="tab"
                    id={`${p.id}-tab`}
                    aria-selected={isActive}
                    aria-controls={`${p.id}-panel`}
                    onClick={() => setActive(i)}
                    className={`group relative flex items-start gap-5 overflow-hidden rounded-2xl border p-5 text-left transition-colors duration-500 md:p-6 ${
                      isActive
                        ? "border-primary/40 bg-card shadow-soft"
                        : "border-border bg-transparent hover:border-border-strong hover:bg-card/60"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="phase-indicator"
                        className="absolute inset-y-0 left-0 w-1 bg-primary"
                        transition={{ duration: 0.5, ease: easeLux }}
                      />
                    )}
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border font-serif text-lg transition-colors duration-500 ${
                        isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border-strong text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                        {p.label} · {p.tag}
                      </span>
                      <span
                        className={`mt-1 block font-serif text-xl leading-snug transition-colors ${
                          isActive ? "text-foreground" : "text-foreground/70"
                        }`}
                      >
                        {p.title}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Panel */}
          <Reveal className="lg:col-span-7" delay={0.1}>
            <div className="relative h-full min-h-[30rem] overflow-hidden rounded-3xl border border-border bg-background p-8 md:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={phase.id}
                  id={`${phase.id}-panel`}
                  role="tabpanel"
                  aria-labelledby={`${phase.id}-tab`}
                  initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
                  transition={{ duration: 0.55, ease: easeLux }}
                  className="flex h-full flex-col"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                      <phase.icon className="h-6 w-6" strokeWidth={1.6} />
                    </span>
                    <span className="rounded-full border border-border-strong px-4 py-1.5 text-xs font-semibold text-foreground/80">
                      {phase.duration}
                    </span>
                  </div>

                  <p className="eyebrow mt-8">
                    {phase.label} — {phase.tag}
                  </p>
                  <h3 className="mt-3 text-3xl font-normal leading-tight text-foreground md:text-4xl">
                    {phase.title}
                  </h3>
                  <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
                    {phase.description}
                  </p>

                  <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                    {phase.deliverables.map((d, i) => (
                      <motion.li
                        key={d}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: easeLux }}
                        className="flex items-start gap-3 text-sm text-foreground/85"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {d}
                      </motion.li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-10">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      <span>{copy.autonomy}</span>
                      <span className="font-serif text-lg normal-case tracking-normal text-foreground">
                        {phase.autonomy}%
                      </span>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className="h-full rounded-full bg-gradient-cta"
                        initial={{ width: 0 }}
                        animate={{ width: `${phase.autonomy}%` }}
                        transition={{ duration: 1, ease: easeLux, delay: 0.2 }}
                      />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
