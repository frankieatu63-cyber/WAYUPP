import { ArrowUpRight, Instagram, Linkedin } from "lucide-react";

import logo from "@/assets/wayup-logo.png";
import { pathFor, sectionPath } from "@/i18n/config";
import { useLocale } from "@/i18n/LocaleProvider";
import { LanguageLinks } from "./LanguageSwitcher";
import { NAV_LINKS, SOCIAL_LINKS } from "./site-nav";

export function SiteFooter() {
  const { locale, t } = useLocale();
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-background">
      <div className="container-wide grid gap-14 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <a href={pathFor(locale)} className="inline-flex items-center gap-3" aria-label={t.header.homeLabel}>
            <img src={logo} alt="Way Up" width={68} height={68} className="h-[4.25rem] w-[4.25rem] rounded-full" />
            <span className="font-serif text-2xl text-foreground">Way Up</span>
          </a>
          <p className="mt-6 max-w-sm leading-relaxed text-muted-foreground">
            {t.footer.tagline}
          </p>
          <div className="mt-8 flex gap-3">
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border-strong text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border-strong text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>

        <nav aria-label={t.footer.navLabel} className="md:col-span-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            {t.footer.navTitle}
          </p>
          <ul className="mt-4">
            {NAV_LINKS.map((l) => (
              <li key={l.key} className="border-b border-border">
                <a
                  href={sectionPath(locale, l.anchor)}
                  className="group flex items-center justify-between py-3.5 text-foreground transition-colors hover:text-primary"
                >
                  {t.nav[l.key]}
                  <ArrowUpRight className="h-4 w-4 opacity-40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            {t.footer.legalTitle}
          </p>
          <ul className="mt-4 space-y-3">
            <li>
              <a
                href={pathFor(locale, "privacy")}
                className="text-foreground transition-colors hover:text-primary"
              >
                {t.footer.privacy}
              </a>
            </li>
            <li>
              <a
                href={pathFor(locale, "terms")}
                className="text-foreground transition-colors hover:text-primary"
              >
                {t.footer.terms}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-wide flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <p>
            © {year} Way Up. {t.footer.rights}
          </p>
          <LanguageLinks />
          <p>{t.footer.madeIn}</p>
        </div>
      </div>
    </footer>
  );
}
