import { motion } from "framer-motion";
import { Building2, CalendarCheck, MapPin, Search, Star } from "lucide-react";
import { useLocale } from "@/i18n/LocaleProvider";
import { easeLux } from "./Reveal";

/** Animated "Google Maps" mock: the business appears right where people search. */
export function LocalSearchCard() {
  const { t } = useLocale();
  const c = t.searchCard;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: 1.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 1.1, ease: easeLux, delay: 0.5 }}
      className="relative mx-auto w-full max-w-md rounded-[2rem] border border-border bg-paper p-4 shadow-lift sm:p-5"
    >
      {/* Search bar */}
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3">
        <span className="font-serif text-lg font-semibold text-primary">G</span>
        <TypedQuery text={c.query} />
        <Search className="ml-auto h-4 w-4 text-muted-foreground" />
      </div>

      {/* Map */}
      <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-3 p-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="rounded-lg bg-background/70" />
          ))}
        </div>
        <div className="absolute inset-x-0 top-[38%] h-3 bg-paper" />
        <div className="absolute inset-y-0 left-[36%] w-3 bg-paper" />
        <div className="absolute inset-y-0 left-[70%] w-2 bg-paper" />

        <MapPin className="absolute left-[18%] top-[18%] h-4 w-4 text-muted-foreground/60" />
        <MapPin className="absolute right-[12%] top-[60%] h-4 w-4 text-muted-foreground/60" />
        <MapPin className="absolute left-[60%] top-[12%] h-4 w-4 text-muted-foreground/60" />

        {/* Main pin */}
        <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2">
          <span className="absolute inset-0 -m-10 rounded-full bg-primary/20 animate-pin-pulse" />
          <span className="absolute inset-0 -m-6 rounded-full border border-primary/25 bg-primary/10" />
          <motion.span
            initial={{ scale: 0, y: -30 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 14, delay: 1.3 }}
            className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-cta"
          >
            <MapPin className="h-5 w-5" />
          </motion.span>
        </div>

        {/* Business chip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeLux, delay: 1.7 }}
          className="absolute bottom-3 left-3 right-3 flex items-center gap-3 rounded-xl border border-border bg-paper p-3 shadow-soft sm:right-auto sm:min-w-[15rem]"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
            <Building2 className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{c.business}</p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-primary text-primary" /> {c.rating}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Agenda */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: easeLux, delay: 2 }}
        className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-background p-4"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-soft text-violet">
          <CalendarCheck className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">{c.agendaTitle}</p>
          <p className="text-xs text-muted-foreground">{c.agendaText}</p>
        </div>
        <span className="ml-auto whitespace-nowrap rounded-full bg-success/10 px-2.5 py-1 text-[0.7rem] font-semibold text-success">
          {c.appointment}
        </span>
      </motion.div>

      <p className="mt-4 text-center text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary">
        {c.tagline}
      </p>
    </motion.div>
  );
}

function TypedQuery({ text }: { text: string }) {
  return (
    <span className="truncate text-sm text-foreground/80" aria-label={text}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 + i * 0.03, duration: 0.01 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}
