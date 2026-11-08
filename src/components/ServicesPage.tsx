import { motion } from "framer-motion";
import { ArrowUpRight, BriefcaseBusiness, CheckCircle2, Mail } from "lucide-react";

import { servicesCopy } from "@/i18n/services";
import { useLocale } from "@/i18n/LocaleProvider";
import { ScrollProgress } from "./Reveal";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { CONTACT_EMAIL } from "./site-nav";

/** Services & pricing page, in the language of the surrounding `LocaleProvider`. */
export function ServicesPage() {
  const { locale } = useLocale();
  const copy = servicesCopy[locale];
  return <>
    <ScrollProgress/><SiteHeader/>
    <main className="pt-20">
      <section className="grain relative overflow-hidden bg-secondary/40 px-5 py-20 text-center md:py-28">
        <div className="container-wide relative">
          <motion.p initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="eyebrow">Way Up · 360°</motion.p>
          <motion.h1 initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.08}} className="mt-4 font-serif text-4xl text-foreground md:text-7xl">{copy.title}</motion.h1>
          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.18}} className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground md:text-2xl">{copy.intro}</motion.p>
          <div className="mx-auto mt-8 h-1 w-16 rounded-full bg-primary"/>
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <div className="mb-10 flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary"><BriefcaseBusiness className="h-7 w-7"/></div>
            <div><h2 className="font-serif text-3xl md:text-5xl">{copy.section}</h2><p className="mt-2 text-muted-foreground md:text-lg">{copy.sectionIntro}</p></div>
          </div>
          <motion.article initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={{duration:.65}} className="grain rounded-[2rem] border border-border bg-card p-6 shadow-sm md:p-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div><span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold tracking-widest text-primary">SERVICIO 01</span><h3 className="mt-5 font-serif text-3xl md:text-5xl">{copy.service}</h3><p className="mt-2 text-muted-foreground">{copy.sub}</p></div>
              <div className="shrink-0 border-l-2 border-primary/20 pl-6"><div className="font-serif text-5xl font-semibold text-primary md:text-6xl">{copy.price}</div><div className="mt-1 text-right text-muted-foreground">{copy.unit}</div></div>
            </div>
            <p className="mt-8 max-w-3xl text-base leading-relaxed md:text-lg">{copy.desc}</p>
            <div className="my-7 h-px bg-border"/>
            <ul className="space-y-4">{copy.points.map((point,i)=><li key={i} className="flex gap-3 text-sm leading-relaxed md:text-base"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary"/><span>{point}</span></li>)}</ul>
            <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(copy.button+" · "+copy.service)}`} className="group mt-8 flex items-center justify-center gap-3 rounded-full bg-primary px-6 py-4 text-center font-medium text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5">{copy.button}<ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"/></a>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{copy.note}</p>
          </motion.article>
          <motion.article initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={{duration:.65,delay:.08}} className="grain mt-8 rounded-[2rem] border border-border bg-card p-6 shadow-sm md:p-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div><span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold tracking-widest text-primary">SERVICIO 02</span><h3 className="mt-5 font-serif text-3xl md:text-5xl">{copy.service2}</h3><p className="mt-2 text-muted-foreground">{copy.sub2}</p></div>
              <div className="shrink-0 border-l-2 border-primary/20 pl-6"><div className="font-serif text-5xl font-semibold text-primary md:text-6xl">{copy.price2}</div><div className="mt-1 text-right text-muted-foreground">{copy.unit2}</div></div>
            </div>
            <p className="mt-8 max-w-3xl text-base leading-relaxed md:text-lg">{copy.desc2}</p>
            <div className="my-7 h-px bg-border"/>
            <ul className="space-y-4">{copy.points2.map((point,i)=><li key={i} className="flex gap-3 text-sm leading-relaxed md:text-base"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary"/><span>{point}</span></li>)}</ul>
            <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(copy.button+" · "+copy.service2)}`} className="group mt-8 flex items-center justify-center gap-3 rounded-full bg-primary px-6 py-4 text-center font-medium text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5">{copy.button}<ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"/></a>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{copy.note2}</p>
          </motion.article>
          <motion.article initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={{duration:.65,delay:.16}} className="grain mt-8 rounded-[2rem] border border-border bg-card p-6 shadow-sm md:p-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div><span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold tracking-widest text-primary">SERVICIO 03</span><h3 className="mt-5 font-serif text-3xl md:text-5xl">{copy.service3}</h3><p className="mt-2 text-muted-foreground">{copy.sub3}</p></div>
              <div className="shrink-0 border-l-2 border-primary/20 pl-6"><div className="font-serif text-5xl font-semibold text-primary md:text-6xl">{copy.price3}</div><div className="mt-1 text-right text-muted-foreground">{copy.unit3}</div></div>
            </div>
            <p className="mt-8 max-w-3xl text-base leading-relaxed md:text-lg">{copy.desc3}</p>
            <div className="my-7 h-px bg-border"/>
            <ul className="space-y-4">{copy.points3.map((point,i)=><li key={i} className="flex gap-3 text-sm leading-relaxed md:text-base"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary"/><span>{point}</span></li>)}</ul>
            <a href={"mailto:"+CONTACT_EMAIL+"?subject="+encodeURIComponent(copy.button+" · "+copy.service3)} className="group mt-8 flex items-center justify-center gap-3 rounded-full bg-primary px-6 py-4 text-center font-medium text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5">{copy.button}<ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"/></a>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{copy.note3}</p>
          </motion.article>
          <div className="mt-8 flex flex-col gap-5 rounded-[2rem] bg-secondary/50 p-6 md:flex-row md:items-center md:justify-between md:p-10"><div><h3 className="font-serif text-2xl md:text-3xl">{copy.contact}</h3><p className="mt-2 text-sm text-muted-foreground">{copy.contactText}</p></div><a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground">{copy.cta}<Mail className="h-4 w-4"/></a></div>
          <p className="mt-10 text-center text-xs font-semibold tracking-[.2em] text-primary">{copy.footer}</p>
        </div>
      </section>
    </main><SiteFooter/>
  </>;
}
