export const portfolioLocales = ["az", "en", "ru"] as const;

export type PortfolioLocale = (typeof portfolioLocales)[number];

export interface PortfolioLocaleContent {
  description: string;
  projectUrl?: string;
}

export type PortfolioTranslations = Record<PortfolioLocale, PortfolioLocaleContent>;

export interface PortfolioRecord {
  _id: string;
  title: string;
  imageUrl: string;
  techStack: string[];
  translations: PortfolioTranslations;
  createdAt?: string;
}

export function createEmptyPortfolioTranslations(): PortfolioTranslations {
  return {
    az: { description: "", projectUrl: "" },
    en: { description: "", projectUrl: "" },
    ru: { description: "", projectUrl: "" },
  };
}

function normalizeLocaleContent(
  value: unknown,
  fallback?: Partial<PortfolioLocaleContent>
): PortfolioLocaleContent {
  const source = value && typeof value === "object" ? (value as Record<string, unknown>) : {};

  const description =
    typeof source.description === "string"
      ? source.description.trim()
      : typeof fallback?.description === "string"
        ? fallback.description.trim()
        : "";

  const projectUrl =
    typeof source.projectUrl === "string"
      ? source.projectUrl.trim()
      : typeof fallback?.projectUrl === "string"
        ? fallback.projectUrl.trim()
        : "";

  return {
    description,
    projectUrl: projectUrl || undefined,
  };
}

export function normalizePortfolioTranslations(
  value: unknown,
  fallback?: Partial<Record<PortfolioLocale, Partial<PortfolioLocaleContent>>> & {
    defaultDescription?: string;
    defaultProjectUrl?: string;
  }
): PortfolioTranslations {
  const source = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const defaultDescription = fallback?.defaultDescription?.trim() ?? "";
  const defaultProjectUrl = fallback?.defaultProjectUrl?.trim() ?? "";

  return {
    az: normalizeLocaleContent(source.az, {
      description: fallback?.az?.description ?? defaultDescription,
      projectUrl: fallback?.az?.projectUrl ?? defaultProjectUrl,
    }),
    en: normalizeLocaleContent(source.en, fallback?.en),
    ru: normalizeLocaleContent(source.ru, fallback?.ru),
  };
}

export function getPortfolioTranslation(
  portfolio: { translations: PortfolioTranslations },
  locale: PortfolioLocale
): PortfolioLocaleContent {
  const requested = portfolio.translations[locale];
  if (requested.description || requested.projectUrl) {
    return requested;
  }

  for (const candidate of portfolioLocales) {
    const translation = portfolio.translations[candidate];
    if (translation.description || translation.projectUrl) {
      return translation;
    }
  }

  return requested;
}
