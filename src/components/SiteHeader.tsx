import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";

import logo from "@/assets/wayup-logo.png";
import { Button } from "@/components/ui/button";
import { pathFor, sectionPath } from "@/i18n/config";
import { useLocale } from "@/i18n/LocaleProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NAV_LINKS } from "./site-nav";
import { easeLux } from "./Reveal";

export function SiteHeader() {
  const { locale, t } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "border-b border-border bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-wide flex h-20 items-center justify-between gap-3 xl:gap-5">
        <a href={pathFor(locale)} className="flex min-w-0 shrink-0 items-center gap-2.5 xl:gap-3" aria-label={t.header.homeLabel}>
          <img src={logo} alt="Way Up" width={52} height={52} className="h-11 w-11 rounded-full xl:h-12 xl:w-12" />
          <span className="inline-flex min-w-0 items-center">
            <span className="flex items-center gap-1.5 xl:gap-2">
              <svg aria-hidden="true" viewBox="0 0 36 44" className="h-6 w-5 shrink-0 text-primary xl:h-7 xl:w-6">
                <defs>
                  <linearGradient id="wayup-balloon" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#4f8df7" />
                    <stop offset="100%" stopColor="#0645c8" />
                  </linearGradient>
                </defs>
                <path d="M18 2.5C9.3 2.5 3 9.1 3 17.1c0 8.4 7.3 15.1 12.1 20.1L18 41l2.9-3.8C25.7 32.2 33 25.5 33 17.1 33 9.1 26.7 2.5 18 2.5Z" fill="url(#wayup-balloon)" />
                <path d="M10 8.5c-2.1 2-3.2 4.7-3.2 7.8M18 37.2l-2.1-2.7h4.2L18 37.2Z" fill="none" stroke="currentColor" strokeOpacity=".55" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M14.5 36.2 12 40h12l-2.5-3.8" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M15 40v2h6v-2" fill="none" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              <span className="whitespace-nowrap font-serif text-[0.78rem] font-semibold tracking-tight text-[#0645c8] xl:text-sm">Eleva tu negocio.</span>
            </span>
          </span>
        </a>

        <nav aria-label={t.header.mainNav} className="hidden xl:block shrink-0">
          <ul className="flex items-center gap-0.5 2xl:gap-1">
            {NAV_LINKS.map((l) => (
              <li key={l.key}>
                <a
                  href={sectionPath(locale, l.anchor)}
                  className="group relative rounded-full px-2.5 py-2 text-xs font-medium text-foreground/75 transition-colors hover:text-foreground 2xl:px-3 2xl:text-sm"
                >
                  {t.nav[l.key]}
                  <span className="absolute inset-x-4 bottom-1 h-px origin-left scale-x-0 bg-primary transition-transform duration-500 ease-out group-hover:scale-x-100" />
                </a>
              </li>
            ))}
            <li>
              <a
                href="/servicios-y-tarifas"
                className="group relative rounded-full px-2.5 py-2 text-xs font-medium text-foreground/75 transition-colors hover:text-foreground xl:px-3 xl:text-sm"
              >
                {locale === "es" ? "Servicios y tarifas" : locale === "en" ? "Services & pricing" : locale === "fr" ? "Services et tarifs" : "服务与价格"}
                <span className="absolute inset-x-4 bottom-1 h-px origin-left scale-x-0 bg-primary transition-transform duration-500 ease-out group-hover:scale-x-100" />
              </a>
            </li>
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 xl:gap-2">
          <LanguageSwitcher />
          <Button asChild variant="ink" size="default" className="hidden md:inline-flex">
            <a href="#contacto">
              <span>{t.header.cta}</span>
              <ArrowUpRight className="transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
            </a>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-strong text-foreground xl:hidden"
            aria-expanded={open}
            aria-label={open ? t.header.closeMenu : t.header.openMenu}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label={t.header.mobileNav}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "100dvh", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: easeLux }}
            className="overflow-hidden bg-background xl:hidden"
          >
            <ul className="container-wide flex flex-col pt-6">
              {NAV_LINKS.map((l, i) => (
                <motion.li
                  key={l.key}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.6, ease: easeLux }}
                  className="border-b border-border"
                >
                  <a
                    href={sectionPath(locale, l.anchor)}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-5 font-serif text-3xl text-foreground"
                  >
                    {t.nav[l.key]}
                    <ArrowUpRight className="h-5 w-5 text-primary" />
                  </a>
                </motion.li>
              ))}
              <motion.li
                key="services-pricing"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + NAV_LINKS.length * 0.06, duration: 0.6, ease: easeLux }}
                className="border-b border-border"
              >
                <a href="/servicios-y-tarifas" onClick={() => setOpen(false)} className="flex items-center justify-between py-5 font-serif text-3xl text-foreground">
                  {locale === "es" ? "Servicios y tarifas" : locale === "en" ? "Services & pricing" : locale === "fr" ? "Services et tarifs" : "服务与价格"}
                  <ArrowUpRight className="h-5 w-5 text-primary" />
                </a>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6, ease: easeLux }}
                className="pt-8"
              >
                <Button asChild variant="hero" size="xl" className="w-full">
                  <a href="#contacto" onClick={() => setOpen(false)}>
                    {t.header.cta}
                  </a>
                </Button>
              </motion.li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
