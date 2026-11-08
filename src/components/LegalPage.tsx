import type { ReactNode } from "react";

import { SENTENCE_END, type LegalKey } from "@/i18n/config";
import { useLocale } from "@/i18n/LocaleProvider";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { CONTACT_EMAIL } from "./site-nav";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  const { t } = useLocale();
  return (
    <>
      <SiteHeader />
      <main className="pt-36 pb-24">
        <article className="container-wide max-w-3xl">
          <p className="eyebrow">{t.legal.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-normal text-foreground md:text-6xl">{title}</h1>
          <div className="mt-12 space-y-6 leading-relaxed text-muted-foreground [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:text-foreground">
            {children}
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

/** A legal page (privacy policy or terms) rendered from the current language's dictionary. */
export function LegalDocument({ page }: { page: LegalKey }) {
  const { locale, t } = useLocale();
  // Chinese is written without a space before the e-mail address.
  const gap = locale === "zh" ? "" : " ";
  const end = SENTENCE_END[locale];
  const email = (
    <a className="text-primary underline" href={`mailto:${CONTACT_EMAIL}`}>
      {CONTACT_EMAIL}
    </a>
  );

  if (page === "privacy") {
    const doc = t.legal.privacy;
    return (
      <LegalPage title={doc.title}>
        <p>{doc.intro}</p>
        {doc.sections.map((s) => (
          <section key={s.h} className="contents">
            <h2>{s.h}</h2>
            <p>{s.p}</p>
          </section>
        ))}
        <h2>{doc.rightsTitle}</h2>
        <p>
          {doc.rightsText}
          {gap}
          {email}
          {end}
        </p>
      </LegalPage>
    );
  }

  const doc = t.legal.terms;
  return (
    <LegalPage title={doc.title}>
      <p>
        {doc.intro}
        {gap}
        {email}
        {end}
      </p>
      {doc.sections.map((s) => (
        <section key={s.h} className="contents">
          <h2>{s.h}</h2>
          <p>{s.p}</p>
        </section>
      ))}
    </LegalPage>
  );
}
