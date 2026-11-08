import { motion } from "framer-motion";
import { ArrowUpRight, Bot, MapPin, Megaphone, type LucideIcon } from "lucide-react";

import { useLocale } from "@/i18n/LocaleProvider";
import { Reveal, SectionHeading } from "./Reveal";

/** Icons for each service, in the same order as `t.services.items`. */
const SERVICE_ICONS: LucideIcon[] = [Megaphone, MapPin, Bot];

export function Services() {
  const { t } = useLocale();
  const copy = t.services;
  const SERVICES = copy.items.map((item, i) => ({ ...item, icon: SERVICE_ICONS[i]! }));
  return (
    <section id="servicios" className="py-24 md:py-36">
      <div className="container-wide">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading eyebrow={copy.eyebrow} title={copy.title} />
          <Reveal delay={0.1}>
            <p className="max-w-sm text-muted-foreground md:text-right">
              {copy.intro}
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="group relative flex h-full flex-col rounded-3xl border border-border bg-card p-8 shadow-soft transition-[border-color,box-shadow] duration-500 hover:border-primary/40 hover:shadow-lift md:p-10"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary transition-colors duration-500 group-hover:bg-primary group-hover:text-primary-foreground">
                    <s.icon className="h-6 w-6" strokeWidth={1.6} />
                  </span>
                  <span className="font-serif text-sm text-muted-foreground">0{i + 1}</span>
                </div>
                <h3 className="mt-10 text-2xl font-normal leading-tight text-foreground md:text-[1.75rem]">
                  {s.title}
                </h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">{s.description}</p>
                <ul className="mt-8 space-y-3 border-t border-border pt-6">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-3 text-sm text-foreground/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {p}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contacto"
                  className="mt-auto inline-flex items-center gap-2 pt-10 text-sm font-semibold text-primary"
                >
                  {copy.cta}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
