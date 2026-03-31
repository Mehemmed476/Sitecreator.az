"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Menu, X, Code2, ChevronDown } from "lucide-react";
import { getLocalizedText } from "@/lib/price-calculator";
import { usePriceCalculatorConfig } from "./usePriceCalculatorConfig";
import { useServicePagesConfig } from "./useServicePagesConfig";
import { getLocalizedServiceContent } from "@/lib/service-pages";

const navLinks = [
  { href: "/", key: "home" },
  { href: "/portfolio", key: "portfolio" },
  { href: "/blog", key: "blog" },
  { href: "/price-calculator", key: "packages" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

const menuAriaLabel: Record<"az" | "en" | "ru", string> = {
  az: "Menyunu aç",
  en: "Toggle menu",
  ru: "Открыть меню",
};

export function Navbar() {
  const locale = useLocale();
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const { config } = usePriceCalculatorConfig();
  const { config: servicesConfig } = useServicePagesConfig();
  const serviceItems = useMemo(
    () =>
      servicesConfig.services.map((service) => ({
        id: service.id,
        title: getLocalizedServiceContent(service, locale as "az" | "en" | "ru").cardTitle,
        href: `/services/${service.slugs[locale as "az" | "en" | "ru"]}`,
      })),
    [locale, servicesConfig.services]
  );
  const servicesActive = pathname.startsWith("/services");
  const homeLink = navLinks[0];
  const secondaryNavLinks = navLinks.slice(1);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className="chrome-panel sticky top-0 z-50 w-full border-b border-black/5 dark:border-white/5
        transition-all duration-300"
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight
            transition-colors duration-200 hover:text-primary"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg
            bg-gradient-to-br from-primary to-secondary text-white">
            <Code2 className="h-5 w-5" />
          </div>
          <span className="hidden sm:inline">
            Site<span className="text-primary">creator</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          <Link
            href={homeLink.href}
            className={`relative rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
              pathname === "/"
                ? "bg-primary/5 text-primary"
                : "text-muted hover:bg-surface-hover hover:text-foreground"
            }`}
          >
            {t(homeLink.key)}
            {pathname === "/" && (
              <span className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-primary" />
            )}
          </Link>

          <div className="relative" ref={servicesRef}>
            <button
              type="button"
              onClick={() => setServicesOpen((current) => !current)}
              className={`relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                servicesActive
                  ? "bg-primary/5 text-primary"
                  : "text-muted hover:bg-surface-hover hover:text-foreground"
              }`}
            >
              {t("services")}
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
              />
              {servicesActive && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-primary" />
              )}
            </button>

            {servicesOpen ? (
              <div className="site-card-strong absolute left-0 top-full z-50 mt-3 w-[320px] rounded-2xl border border-border p-3 shadow-elevated">
                <Link
                  href="/services"
                  onClick={() => setServicesOpen(false)}
                  className="block rounded-xl px-4 py-3 transition-colors duration-200 hover:bg-surface-hover"
                >
                  <p className="text-sm font-semibold text-foreground">{t("services")}</p>
                  <p className="mt-1 text-xs leading-5 text-muted">Bütün xidmət səhifələrinə bax</p>
                </Link>

                <div className="my-2 h-px bg-border" />

                <div className="space-y-1">
                  {serviceItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setServicesOpen(false)}
                      className="block rounded-xl px-4 py-3 transition-colors duration-200 hover:bg-surface-hover"
                    >
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {secondaryNavLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.key}
                href={link.href}
                className={`relative px-3.5 py-2 text-sm font-medium rounded-lg
                  transition-all duration-200
                  ${
                    isActive
                      ? "text-primary bg-primary/5"
                      : "text-muted hover:text-foreground hover:bg-surface-hover"
                  }`}
              >
                {link.key === "packages"
                  ? getLocalizedText(locale as "az" | "en" | "ru", config.copy.navLabel)
                  : t(link.key)}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2
                    h-0.5 w-5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="site-control flex h-10 w-10 items-center justify-center rounded-full
              transition-all duration-200
              hover:border-primary md:hidden cursor-pointer"
            aria-label={menuAriaLabel[locale as "az" | "en" | "ru"]}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
        <div
          className={`overflow-hidden transition-all duration-300 md:hidden
          ${mobileOpen ? "max-h-[36rem] border-t border-black/5 dark:border-white/5" : "max-h-0"}`}
        >
        <div className="chrome-panel-solid flex flex-col gap-1 px-4 py-3">
          <Link
            href={homeLink.href}
            onClick={() => setMobileOpen(false)}
            className={`rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
              pathname === "/"
                ? "bg-primary/5 text-primary"
                : "text-muted hover:bg-surface-hover hover:text-foreground"
            }`}
          >
            {t(homeLink.key)}
          </Link>

          <button
            type="button"
            onClick={() => setMobileServicesOpen((current) => !current)}
            className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
              servicesActive
                ? "bg-primary/5 text-primary"
                : "text-muted hover:bg-surface-hover hover:text-foreground"
            }`}
          >
            <span>{t("services")}</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`}
            />
          </button>

          {mobileServicesOpen ? (
            <div className="site-card-soft ml-4 space-y-1 rounded-2xl p-2">
              <Link
                href="/services"
                onClick={() => {
                  setMobileServicesOpen(false);
                  setMobileOpen(false);
                }}
                className="block rounded-lg px-4 py-3 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-surface-hover"
              >
                {t("services")}
              </Link>

              {serviceItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => {
                    setMobileServicesOpen(false);
                    setMobileOpen(false);
                  }}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-muted transition-colors duration-200 hover:bg-surface-hover hover:text-foreground"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          ) : null}

          {secondaryNavLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.key}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 text-sm font-medium rounded-lg
                  transition-all duration-200
                  ${
                    isActive
                      ? "text-primary bg-primary/5"
                      : "text-muted hover:text-foreground hover:bg-surface-hover"
                  }`}
              >
                {link.key === "packages"
                  ? getLocalizedText(locale as "az" | "en" | "ru", config.copy.navLabel)
                  : t(link.key)}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
