import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/LocaleProvider";
import { Reveal, easeLux } from "./Reveal";

export function Faq() {
  const { t } = useLocale();
  const copy = t.faq;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="preguntas" className="border-t border-border bg-paper py-24 md:py-36">
      <div className="container-wide grid gap-14 lg:grid-cols-12 lg:gap-20">
        <Reveal className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h2 className="mt-4 text-4xl font-normal text-foreground text-balance-tight md:text-6xl">
              {copy.title}
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
              {copy.intro}
            </p>
            <Button asChild variant="outline" size="lg" className="mt-10">
              <a href="#contacto">
                {copy.cta}
                <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
              </a>
            </Button>
          </div>
        </Reveal>

        <div className="lg:col-span-7">
          <ul className="border-t border-border">
            {copy.items.map((f, i) => {
              const isOpen = open === i;
              return (
                <li key={f.q} className="border-b border-border">
                  <Reveal delay={i * 0.05} y={16}>
                    <h3 className="font-sans tracking-normal">
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-${i}`}
                        className="group flex w-full items-center gap-6 py-7 text-left"
                      >
                        <span className="font-serif text-sm text-muted-foreground">0{i + 1}</span>
                        <span
                          className={`flex-1 text-lg font-medium transition-colors md:text-xl ${
                            isOpen ? "text-primary" : "text-foreground group-hover:text-primary"
                          }`}
                        >
                          {f.q}
                        </span>
                        <motion.span
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          transition={{ duration: 0.4, ease: easeLux }}
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
                            isOpen
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border-strong text-foreground"
                          }`}
                        >
                          <Plus className="h-4 w-4" />
                        </motion.span>
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-${i}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: easeLux }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-2xl pb-8 pl-11 leading-relaxed text-muted-foreground">
                            {f.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
