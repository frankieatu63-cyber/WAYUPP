import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Check } from "lucide-react";

import cityStreet from "@/assets/hero-city-street.jpg";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/LocaleProvider";
import { LocalSearchCard } from "./LocalSearchCard";
import { WayAppHeroLauncher } from "./wayapp/WayAppHeroLauncher";
import { easeLux } from "./Reveal";

export function Hero() {
  const { t } = useLocale();
  const h = t.hero;
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  // Parallax: the street drifts slower than the page; the copy lifts and softens as you leave.
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, reduce ? 1 : 0.25]);

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative isolate overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28"
    >
      {/* Urban backdrop: soft Salamanca street, washed into the cream paper */}
      <motion.div
        aria-hidden
        style={{ y: bgY }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <motion.img
          src={cityStreet}
          alt=""
          width={1920}
          height={1088}
          fetchPriority="high"
          initial={{ opacity: 0, scale: reduce ? 1 : 1.06 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 2.2, ease: easeLux }}
          className="h-full w-full object-cover object-[70%_center] saturate-[0.7]"
        />
        <div className="absolute inset-0 bg-hero-veil" />
        <div className="absolute inset-0 bg-paper-glow opacity-80" />
      </motion.div>
      {/* Keeps the bottom edge cream while the photo drifts down */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-background" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container-wide grid items-center gap-16 lg:grid-cols-12 lg:gap-12"
      >
        <div className="lg:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeLux }}
            className="eyebrow flex items-center gap-3"
          >
            <span className="h-px w-8 bg-primary" />
            {h.eyebrow}
          </motion.p>

          <h1 className="mt-6 text-[2.75rem] font-normal text-foreground text-balance-tight sm:text-6xl lg:text-[5.25rem]">
            {h.headline.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-top">
                <motion.span
                  className={`inline-block ${w.accent ? "italic text-primary" : ""}`}
                  initial={{ y: reduce ? 0 : "110%", opacity: reduce ? 0 : 1 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, ease: easeLux, delay: 0.1 + i * 0.05 }}
                >
                  {w.word}
                </motion.span>
                {h.wordGap && i < h.headline.length - 1 && "\u00A0"}
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: easeLux, delay: 0.8 }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            {h.subtitle}
          </motion.p>

          {/* Lanzador de WAY.APP dentro de la columna izquierda del hero (abre el chat integrado). */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeLux, delay: 0.9 }}
            className="mt-7 max-w-xl"
          >
            <WayAppHeroLauncher />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: easeLux, delay: 0.95 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button asChild variant="hero" size="xl">
              <a href="#contacto">
                {h.ctaPrimary}
                <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
              </a>
            </Button>
            <Button asChild variant="outline" size="xl">
              <a href="#contacto">{h.ctaSecondary}</a>
            </Button>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground"
          >
            {h.trust.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                {item}
              </li>
            ))}
          </motion.ul>
        </div>

        <div className="lg:col-span-5">
          <LocalSearchCard />
        </div>
      </motion.div>
    </section>
  );
}
