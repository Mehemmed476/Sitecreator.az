"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Locale, routing } from "@/i18n/routing";
import { useTransition, useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";

const localeNames: Record<Locale, string> = {
  az: "AZ",
  en: "EN",
  ru: "RU",
};

const localeFlagEmoji: Record<Locale, string> = {
  az: "🇦🇿",
  en: "🇬🇧",
  ru: "🇷🇺",
};

const switcherAriaLabel: Record<Locale, string> = {
  az: "Dil seçimi",
  en: "Switch language",
  ru: "Выбор языка",
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function resolveLocalizedContentPath(
    newLocale: Locale,
    type: "blog" | "services",
    endpoint: "/api/insights/alternates" | "/api/service-pages/alternates"
  ) {
    const match = pathname.match(new RegExp(`^/${type}/([^/?#]+)$`));
    if (!match) {
      return null;
    }

    const response = await fetch(
      `${endpoint}?slug=${encodeURIComponent(match[1])}&locale=${locale}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json().catch(() => null)) as
      | { alternates?: Partial<Record<Locale | "x-default", string>> }
      | null;

    return data?.alternates?.[newLocale] ?? null;
  }

  function switchLocale(newLocale: Locale) {
    setIsOpen(false);
    startTransition(async () => {
      const localizedBlogPath = await resolveLocalizedContentPath(
        newLocale,
        "blog",
        "/api/insights/alternates"
      );

      if (localizedBlogPath) {
        window.location.assign(localizedBlogPath);
        return;
      }

      const localizedServicePath = await resolveLocalizedContentPath(
        newLocale,
        "services",
        "/api/service-pages/alternates"
      );

      if (localizedServicePath) {
        window.location.assign(localizedServicePath);
        return;
      }

      router.replace(pathname, { locale: newLocale });
    });
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="header-language-control site-control flex items-center gap-1.5 rounded-full px-3 py-2
          text-foreground hover:border-primary
          transition-all duration-300 text-sm font-medium cursor-pointer
          disabled:opacity-50"
        aria-label={switcherAriaLabel[locale]}
      >
        <Globe className="control-chip-icon h-4 w-4" />
        <span className="text-foreground">
          {localeFlagEmoji[locale]} {localeNames[locale]}
        </span>
        <ChevronDown
          className={`control-chip-icon h-3.5 w-3.5 transition-transform duration-200
            ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 py-1.5 min-w-[120px]
            header-language-menu site-card-strong border border-border rounded-xl shadow-elevated
            z-50 animate-fade-in-up"
          style={{ animationDuration: "0.15s" }}
        >
          {routing.locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm
                transition-colors duration-150 cursor-pointer
                ${loc === locale
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-foreground hover:bg-surface-hover"
                }`}
            >
              <span className="text-base">{localeFlagEmoji[loc]}</span>
              <span>{localeNames[loc]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
