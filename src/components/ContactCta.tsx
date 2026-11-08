import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { useRef } from "react";

import logo from "@/assets/wayup-logo.png";
import { Button } from "@/components/ui/button";
import { ScrollScale } from "./Reveal";
import { useLocale } from "@/i18n/LocaleProvider";
import { auditMailto, CONTACT_EMAIL } from "./site-nav";

export function ContactCta() {
  const { t } = useLocale();
  const copy = t.contact;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // The watermark logo turns slowly as the card passes through the viewport.
  const logoRotate = useTransform(scrollYProgress, [0, 1], [reduce ? 12 : -10, reduce ? 12 : 30]);

  return (
    <section ref={ref} id="contacto" className="py-24 md:py-32">
      <div className="container-wide">
        <ScrollScale>
          <div className="grain relative overflow-hidden rounded-[2.5rem] [clip-path:inset(0_round_2.5rem)] bg-primary px-6 py-16 text-primary-foreground sm:px-12 md:px-16 md:py-24">
            <motion.img
              src={logo}
              alt=""
              aria-hidden
              width={420}
              height={420}
              loading="lazy"
              style={{ rotate: logoRotate }}
              className="pointer-events-none absolute -right-20 -top-16 h-72 w-72 rounded-full opacity-10 md:h-[26rem] md:w-[26rem]"
            />
            <div className="relative grid gap-12 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <p className="eyebrow [--eyebrow-color:var(--primary-foreground)] opacity-75">{copy.eyebrow}</p>
                <h2 className="mt-4 text-4xl font-normal text-primary-foreground text-balance-tight md:text-7xl">
                  {copy.title}
                </h2>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/80">
                  {copy.text}
                </p>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <Button asChild variant="paper" size="xl">
                    <a href={auditMailto(copy.mailSubject)}>
                      {copy.ctaPrimary}
                      <ArrowUpRight className="transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                    </a>
                  </Button>
                  <Button asChild variant="outline-paper" size="xl">
                    <a href={`mailto:${CONTACT_EMAIL}`}>{copy.ctaSecondary}</a>
                  </Button>
                </div>
              </div>
              <div className="lg:col-span-4 lg:justify-self-end">
                <ul className="space-y-4 text-sm text-primary-foreground/85">
                  <li className="flex items-center gap-3">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${CONTACT_EMAIL}`} className="hover:underline">
                      {CONTACT_EMAIL}
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <MapPin className="h-4 w-4" />
                    {copy.location}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </ScrollScale>
      </div>
    </section>
  );
}
