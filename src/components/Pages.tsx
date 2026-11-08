import type { LegalKey, Locale } from "@/i18n/config";
import { LocaleProvider } from "@/i18n/LocaleProvider";

import { SiteHeader } from "./SiteHeader";
import { Hero } from "./Hero";
import { Services } from "./Services";
import { Method } from "./Method";
// import { Cases } from "./Cases";
import { About } from "./About";
import { Faq } from "./Faq";
import { ContactCta } from "./ContactCta";
import { SiteFooter } from "./SiteFooter";
import { ScrollProgress } from "./Reveal";
import { LegalDocument } from "./LegalPage";

/** The one-page home, in any language. Each language route renders this with its own locale. */
export function HomePage({ locale }: { locale: Locale }) {
  return (
    <LocaleProvider locale={locale} page="home">
      <ScrollProgress />
      <SiteHeader />
      <main>
        <Hero />
        <Services />
        <Method />
        {/* <Cases /> */}
        <About />
        <Faq />
        <ContactCta />
      </main>
      <SiteFooter />
    </LocaleProvider>
  );
}

export function LegalRoutePage({ locale, page }: { locale: Locale; page: LegalKey }) {
  return (
    <LocaleProvider locale={locale} page={page}>
      <LegalDocument page={page} />
    </LocaleProvider>
  );
}
