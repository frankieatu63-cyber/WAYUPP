import { Check, Globe } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HTML_LANG, LOCALES, pathFor } from "@/i18n/config";
import { dictionaries } from "@/i18n";
import { useLocale } from "@/i18n/LocaleProvider";

/**
 * Header language menu. Each option is a plain link to the same page in that language, so
 * switching is a normal navigation and every language URL is crawlable.
 */
export function LanguageSwitcher() {
  const { locale, page, t } = useLocale();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t.langSwitcher}
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border-strong px-3 text-sm font-medium uppercase text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Globe className="h-4 w-4" aria-hidden />
          {locale}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {LOCALES.map((l) => (
          <DropdownMenuItem key={l} asChild>
            <a
              href={pathFor(l, page)}
              hrefLang={HTML_LANG[l]}
              lang={HTML_LANG[l]}
              aria-current={l === locale ? "true" : undefined}
              className="flex cursor-pointer items-center justify-between gap-6"
            >
              {dictionaries[l].langName}
              {l === locale && <Check className="h-4 w-4 text-primary" aria-hidden />}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Always-visible language links for the footer (plain anchors: crawlable without JavaScript). */
export function LanguageLinks() {
  const { locale, page, t } = useLocale();
  return (
    <nav aria-label={t.langSwitcher}>
      <ul className="flex flex-wrap gap-x-4 gap-y-1">
        {LOCALES.map((l) => (
          <li key={l}>
            <a
              href={pathFor(l, page)}
              hrefLang={HTML_LANG[l]}
              lang={HTML_LANG[l]}
              aria-current={l === locale ? "true" : undefined}
              className={`transition-colors hover:text-primary ${
                l === locale ? "font-semibold text-foreground" : ""
              }`}
            >
              {dictionaries[l].langName}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
