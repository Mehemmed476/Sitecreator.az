import type { LucideIcon } from "lucide-react";
import { AtSign, Clock3, Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import type { SiteSettings } from "@/lib/site-settings";

type Translator = (key: string) => string;

export function normalizeInstagramHref(value: string) {
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  return `https://instagram.com/${value.replace(/^@/, "")}`;
}

export function buildWhatsAppHref(value: string) {
  const digits = value.replace(/[^\d]/g, "");
  return digits ? `https://wa.me/${digits}` : undefined;
}

export function hasValue(value: string) {
  return value.trim().length > 0;
}

export type ContactCard = {
  key: string;
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
};

export type QuickAction = {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
  primary: boolean;
};

export function buildContactCards(
  t: Translator,
  settings: SiteSettings,
  pendingInfo: string
): { cards: ContactCard[]; businessHoursValue: string } {
  const businessHoursValue = hasValue(settings.businessHours)
    ? settings.businessHours
    : pendingInfo;

  return {
    businessHoursValue,
    cards: [
      {
        key: "phone",
        icon: Phone,
        label: t("details.phone"),
        value: hasValue(settings.phone) ? settings.phone : pendingInfo,
        href: hasValue(settings.phone) ? `tel:${settings.phone}` : undefined,
      },
      {
        key: "hours",
        icon: Clock3,
        label: t("details.hours"),
        value: businessHoursValue,
      },
      {
        key: "whatsapp",
        icon: MessageSquare,
        label: t("details.whatsapp"),
        value: hasValue(settings.whatsapp) ? settings.whatsapp : pendingInfo,
        href: hasValue(settings.whatsapp) ? buildWhatsAppHref(settings.whatsapp) : undefined,
        external: true,
      },
      {
        key: "instagram",
        icon: AtSign,
        label: t("details.instagram"),
        value: hasValue(settings.instagram) ? settings.instagram : pendingInfo,
        href: hasValue(settings.instagram)
          ? normalizeInstagramHref(settings.instagram)
          : undefined,
        external: true,
      },
      {
        key: "email",
        icon: Mail,
        label: t("details.email"),
        value: hasValue(settings.email) ? settings.email : pendingInfo,
        href: hasValue(settings.email) ? `mailto:${settings.email}` : undefined,
      },
      {
        key: "address",
        icon: MapPin,
        label: t("details.address"),
        value: hasValue(settings.address) ? settings.address : pendingInfo,
      },
    ],
  };
}

export function buildQuickActions(
  t: Translator,
  settings: SiteSettings
): QuickAction[] {
  return [
    hasValue(settings.whatsapp)
      ? {
          key: "whatsapp",
          label: t("ctaWhatsApp"),
          href: buildWhatsAppHref(settings.whatsapp)!,
          icon: MessageSquare,
          primary: true,
        }
      : null,
    hasValue(settings.phone)
      ? {
          key: "phone",
          label: t("ctaCall"),
          href: `tel:${settings.phone}`,
          icon: Phone,
          primary: false,
        }
      : null,
    hasValue(settings.email)
      ? {
          key: "email",
          label: t("ctaEmail"),
          href: `mailto:${settings.email}`,
          icon: Mail,
          primary: false,
        }
      : null,
  ].filter((action): action is QuickAction => Boolean(action?.href));
}
