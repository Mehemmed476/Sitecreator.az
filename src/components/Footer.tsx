"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Code2,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  AtSign,
  Clock3,
} from "lucide-react";
import { useSiteSettings } from "./useSiteSettings";
import { getLocalizedText } from "@/lib/price-calculator";
import { usePriceCalculatorConfig } from "./usePriceCalculatorConfig";
import { useServicePagesConfig } from "./useServicePagesConfig";
import { getLocalizedServiceContent } from "@/lib/service-pages";

const footerNavLinks = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/portfolio", key: "portfolio" },
  { href: "/blog", key: "blog" },
  { href: "/price-calculator", key: "packages" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

function normalizeInstagramHref(value: string) {
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://instagram.com/${value.replace(/^@/, "")}`;
}

export function Footer() {
  const locale = useLocale();
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const { settings } = useSiteSettings();
  const { config } = usePriceCalculatorConfig();
  const { config: servicesConfig } = useServicePagesConfig();
  const serviceItems = servicesConfig.services.slice(0, 5).map((service) => ({
    title: getLocalizedServiceContent(service, locale as "az" | "en" | "ru").cardTitle,
    href: `/services/${service.slugs[locale as "az" | "en" | "ru"]}`,
  }));

  const contactItems = [
    {
      key: "email",
      icon: Mail,
      content: (
        <a href={`mailto:${settings.email}`} className="transition-colors hover:text-primary">
          {settings.email}
        </a>
      ),
    },
    {
      key: "phone",
      icon: Phone,
      content: (
        <a href={`tel:${settings.phone}`} className="transition-colors hover:text-primary">
          {settings.phone}
        </a>
      ),
    },
    {
      key: "whatsapp",
      icon: MessageCircle,
      content: (
        <a
          href={`https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}`}
          target="_blank"
          rel="noreferrer"
          className="transition-colors hover:text-primary"
        >
          {settings.whatsapp}
        </a>
      ),
    },
    {
      key: "instagram",
      icon: AtSign,
      content: (
        <a
          href={normalizeInstagramHref(settings.instagram)}
          target="_blank"
          rel="noreferrer"
          className="transition-colors hover:text-primary"
        >
          {settings.instagram}
        </a>
      ),
    },
    {
      key: "hours",
      icon: Clock3,
      content: <span>{settings.businessHours}</span>,
    },
    {
      key: "address",
      icon: MapPin,
      content: <span>{settings.address}</span>,
    },
  ];

  return (
    <footer className="footer-panel border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-bold">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg
                  bg-gradient-to-br from-primary to-secondary text-white"
              >
                <Code2 className="h-5 w-5" />
              </div>
              <span>
                Site<span className="text-primary">creator</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted">{t("description")}</p>
          </div>

          <div>
            <h3 className="site-kicker mb-4 text-sm font-semibold">
              {t("quickLinks")}
            </h3>
            <ul className="space-y-2.5">
              {footerNavLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors duration-200 hover:text-primary"
                  >
                    {link.key === "packages"
                      ? getLocalizedText(locale as "az" | "en" | "ru", config.copy.navLabel)
                      : nav(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="site-kicker mb-4 text-sm font-semibold">
              {t("services")}
            </h3>
            <ul className="space-y-2.5">
              {serviceItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-muted transition-colors duration-200 hover:text-primary">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="site-kicker mb-4 text-sm font-semibold">
              {t("contactInfo")}
            </h3>
            <ul className="space-y-3">
              {contactItems.map(({ key, icon: Icon, content }) => (
                <li
                  key={key}
                  className="flex items-start gap-2.5 text-sm text-muted"
                >
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div className="min-w-0 break-words">{content}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center">
          <p className="text-sm text-muted">{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
