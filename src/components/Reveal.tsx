import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

export const easeLux = [0.22, 1, 0.36, 1] as const;

/** Thin cobalt→violet reading bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-cta"
    />
  );
}

/** Scroll-linked "settle in": the block grows from slightly smaller and rounder as it reaches the viewport centre. */
export function ScrollScale({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [reduce ? 1 : 0.4, 1]);
  return (
    <motion.div ref={ref} style={{ scale, opacity }} className={className}>
      {children}
    </motion.div>
  );
}

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string | undefined;
};

/** Fade + slide-in + soft focus when the element enters the viewport. */
export function Reveal({ children, delay = 0, y = 28, className }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y, filter: reduce ? "blur(0px)" : "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: easeLux, delay }}
    >
      {children}
    </motion.div>
  );
}

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  className?: string | undefined;
  tone?: "default" | "inverse";
};

export function SectionHeading({
  eyebrow,
  title,
  intro,
  className,
  tone = "default",
}: SectionHeadingProps) {
  const inverse = tone === "inverse";
  const reduce = useReducedMotion();
  return (
    <Reveal className={className}>
      <p className={`flex items-center gap-3 ${inverse ? "eyebrow [--eyebrow-color:var(--primary-soft)]" : "eyebrow"}`}>
        {/* Hairline draws in before the label, echoing the hero eyebrow */}
        <motion.span
          aria-hidden
          className="h-px w-8 origin-left bg-current"
          initial={{ scaleX: reduce ? 1 : 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: easeLux, delay: 0.15 }}
        />
        {eyebrow}
      </p>
      {/* Title rises out of a mask, like the hero headline */}
      <span className="block overflow-hidden pb-[0.12em]">
        <motion.h2
          initial={{ y: reduce ? 0 : "60%" }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1, ease: easeLux, delay: 0.05 }}
          className={`mt-4 max-w-3xl text-4xl font-normal text-balance-tight md:text-6xl ${
            inverse ? "text-ink-foreground" : "text-foreground"
          }`}
        >
          {title}
        </motion.h2>
      </span>
      {intro && (
        <p
          className={`mt-6 max-w-xl text-base leading-relaxed md:text-lg ${
            inverse ? "text-ink-foreground/70" : "text-muted-foreground"
          }`}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}
