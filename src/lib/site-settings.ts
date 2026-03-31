export type SiteSettings = {
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  businessHours: string;
  address: string;
};

export const defaultSiteSettings: SiteSettings = {
  email: "info@sitecreator.az",
  phone: "+994 50 123 45 67",
  whatsapp: "+994 50 123 45 67",
  instagram: "https://instagram.com/sitecreator",
  businessHours: "Mon - Fri, 09:00 - 18:00",
  address: "Baku, Azerbaijan",
};

function toText(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;

  const normalized = value.trim();
  return normalized || fallback;
}

export function sanitizeSiteSettings(input: unknown): SiteSettings {
  const source =
    input && typeof input === "object"
      ? (input as Partial<Record<keyof SiteSettings, unknown>>)
      : {};

  return {
    email: toText(source.email, defaultSiteSettings.email),
    phone: toText(source.phone, defaultSiteSettings.phone),
    whatsapp: toText(source.whatsapp, defaultSiteSettings.whatsapp),
    instagram: toText(source.instagram, defaultSiteSettings.instagram),
    businessHours: toText(
      source.businessHours,
      defaultSiteSettings.businessHours
    ),
    address: toText(source.address, defaultSiteSettings.address),
  };
}
