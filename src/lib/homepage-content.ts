import azMessages from "../../messages/az.json";
import enMessages from "../../messages/en.json";
import ruMessages from "../../messages/ru.json";

export type HomepageLocale = "az" | "en" | "ru";

export type HomepageItem = {
  title: string;
  description: string;
};

export type HomepageLocaleContent = {
  heroBadge: string;
  heroTitle: string;
  heroTitleHighlight: string;
  heroDescription: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  servicesTitle: string;
  servicesDescription: string;
  serviceItems: HomepageItem[];
  whyUsTitle: string;
  whyUsDescription: string;
  whyUsItems: HomepageItem[];
  portalFeatureEyebrow: string;
  portalFeatureTitle: string;
  portalFeatureDescription: string;
  portalFeatureItems: HomepageItem[];
  portalFeaturePrimaryCta: string;
  portalFeatureSecondaryCta: string;
  marketEyebrow: string;
  marketTitle: string;
  marketIntro: string;
  marketBullets: string[];
  ctaTitle: string;
  ctaDescription: string;
  ctaButton: string;
  featuredTitle: string;
  featuredEmptyState: string;
};

export type HomepageContent = Record<HomepageLocale, HomepageLocaleContent>;

type MessagesShape = {
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    cta: string;
    ctaSecondary: string;
  };
  features: {
    sectionTitle: string;
    sectionDescription: string;
    items: HomepageItem[];
  };
  whyUs: {
    sectionTitle: string;
    sectionDescription: string;
    items: HomepageItem[];
  };
  featuredProjects: {
    title: string;
    noProjects: string;
  };
};

const marketCopy: Record<
  HomepageLocale,
  {
    eyebrow: string;
    title: string;
    intro: string;
    bullets: string[];
  }
> = {
  az: {
    eyebrow: "Axtarış niyyəti",
    title: "Bakı və Azərbaycan üzrə veb-sayt hazırlanması",
    intro:
      "Azərbaycan bazarında insanlar adətən veb-sayt hazırlanması, sayt yaradılması, e-ticarət saytı, SEO xidməti və korporativ sayt kimi açar sözlərlə axtarış edir. Buna görə saytımızda həm texniki SEO, həm də görünən məzmun səviyyəsində bu niyyətlərə cavab veririk.",
    bullets: [
      "Korporativ saytlar, landing page və e-ticarət saytlarının hazırlanması",
      "Axtarışa uyğun struktur, sürət optimizasiyası və texniki SEO",
      "Bakı və bütün Azərbaycan üzrə bizneslər üçün ölçülə bilən rəqəmsal həllər",
    ],
  },
  en: {
    eyebrow: "Search intent",
    title: "Website development services for Baku and Azerbaijan",
    intro:
      "Search intent in Azerbaijan usually clusters around website development, company websites, e-commerce websites, and SEO services. We shape both the technical structure and visible content of the site around those real business searches.",
    bullets: [
      "Corporate websites, landing pages, and e-commerce builds",
      "Search-friendly structure, speed optimization, and technical SEO",
      "Scalable digital systems for businesses in Baku and across Azerbaijan",
    ],
  },
  ru: {
    eyebrow: "Поисковый спрос",
    title: "Разработка сайтов для Баку и Азербайджана",
    intro:
      "На рынке Азербайджана пользователи часто ищут услуги по запросам разработка сайта, корпоративный сайт, интернет-магазин и SEO. Поэтому мы усиливаем и техническую основу, и видимый контент под эти поисковые намерения.",
    bullets: [
      "Корпоративные сайты, landing page и интернет-магазины",
      "Поисковая структура, оптимизация скорости и техническое SEO",
      "Масштабируемые цифровые решения для бизнеса в Баку и по всему Азербайджану",
    ],
  },
};

function createLocaleContent(
  messages: MessagesShape,
  locale: HomepageLocale
): HomepageLocaleContent {
  return {
    heroBadge: messages.hero.badge,
    heroTitle: messages.hero.title,
    heroTitleHighlight: messages.hero.titleHighlight,
    heroDescription: messages.hero.description,
    heroPrimaryCta: messages.hero.cta,
    heroSecondaryCta: messages.hero.ctaSecondary,
    servicesTitle: messages.features.sectionTitle,
    servicesDescription: messages.features.sectionDescription,
    serviceItems: messages.features.items.map((item) => ({ ...item })),
    whyUsTitle: messages.whyUs.sectionTitle,
    whyUsDescription: messages.whyUs.sectionDescription,
    whyUsItems: messages.whyUs.items.map((item) => ({ ...item })),
    portalFeatureEyebrow:
      locale === "az"
        ? "Client portal"
        : locale === "ru"
          ? "Клиентский портал"
          : "Client portal",
    portalFeatureTitle:
      locale === "az"
        ? "Təklifdən layihəyə qədər hər şey tək məkanda"
        : locale === "ru"
          ? "Всё от предложения до проекта в одном месте"
          : "Everything from proposal to project in one place",
    portalFeatureDescription:
      locale === "az"
        ? "Müştəri portalı ilə təklif, layihə statusu, mərhələlər və vacib qeydlər bir paneldə görünür. Komandanız da, müştəriniz də prosesə daha rahat nəzarət edir."
        : locale === "ru"
          ? "Клиентский портал объединяет предложение, статус проекта, этапы и важные заметки в одной панели. И ваша команда, и клиент видят процесс прозрачнее."
          : "The client portal keeps proposals, project status, milestones, and key notes in one view so both your team and your client can follow progress clearly.",
    portalFeatureItems:
      locale === "az"
        ? [
            {
              title: "Təklifə dərhal baxış",
              description:
                "Hazırlanan proposal, qiymət sətirləri və xidmət detalları portalda açılır.",
            },
            {
              title: "Layihə gedişatının izlənməsi",
              description:
                "Mərhələlər, status dəyişiklikləri və yekun büdcə müştəri üçün aydın görünür.",
            },
            {
              title: "Bir mərkəzdən əlaqə",
              description:
                "Müştəri login edib bütün vacib məlumatları bir yerdə görür və prosesi daha rahat izləyir.",
            },
          ]
        : locale === "ru"
          ? [
              {
                title: "Мгновенный просмотр предложения",
                description:
                  "Готовое коммерческое предложение, строки стоимости и детали услуг открываются прямо в портале.",
              },
              {
                title: "Отслеживание прогресса проекта",
                description:
                  "Этапы, изменения статуса и итоговый бюджет остаются прозрачными для клиента.",
              },
              {
                title: "Всё общение в одном месте",
                description:
                  "Клиент входит в портал и видит все ключевые детали проекта без лишней переписки.",
              },
            ]
          : [
              {
                title: "Instant proposal access",
                description:
                  "Your prepared proposal, pricing lines, and service details are available in one portal view.",
              },
              {
                title: "Project progress tracking",
                description:
                  "Milestones, status updates, and the final budget stay visible for the client at every step.",
              },
              {
                title: "One place for client visibility",
                description:
                  "Clients log in once and follow the full project flow without needing scattered updates.",
              },
            ],
    portalFeaturePrimaryCta:
      locale === "az"
        ? "Kalkulyatoru yoxla"
        : locale === "ru"
          ? "Открыть калькулятор"
          : "Open calculator",
    portalFeatureSecondaryCta:
      locale === "az"
        ? "Portal imkanları"
        : locale === "ru"
          ? "Возможности портала"
          : "Portal benefits",
    marketEyebrow: marketCopy[locale].eyebrow,
    marketTitle: marketCopy[locale].title,
    marketIntro: marketCopy[locale].intro,
    marketBullets: [...marketCopy[locale].bullets],
    ctaTitle: messages.hero.title,
    ctaDescription: messages.hero.description,
    ctaButton: messages.hero.cta,
    featuredTitle: messages.featuredProjects.title,
    featuredEmptyState: messages.featuredProjects.noProjects,
  };
}

export const defaultHomepageContent: HomepageContent = {
  az: createLocaleContent(azMessages as MessagesShape, "az"),
  en: createLocaleContent(enMessages as MessagesShape, "en"),
  ru: createLocaleContent(ruMessages as MessagesShape, "ru"),
};

function normalizeText(value: unknown, fallback: string) {
  return typeof value === "string" ? value.trim() : fallback;
}

function normalizeItems(value: unknown, fallback: HomepageItem[]) {
  if (!Array.isArray(value)) {
    return fallback.map((item) => ({ ...item }));
  }

  return value.map((item, index) => {
    const source = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const backup =
      fallback[index] ?? fallback[fallback.length - 1] ?? { title: "", description: "" };

    return {
      title: normalizeText(source.title, backup.title),
      description: normalizeText(source.description, backup.description),
    };
  });
}

function normalizeBullets(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) {
    return [...fallback];
  }

  return value.map((item, index) => normalizeText(item, fallback[index] ?? ""));
}

function sanitizeHomepageLocaleContent(
  input: unknown,
  fallback: HomepageLocaleContent
): HomepageLocaleContent {
  const source = input && typeof input === "object" ? (input as Record<string, unknown>) : {};

  return {
    heroBadge: normalizeText(source.heroBadge, fallback.heroBadge),
    heroTitle: normalizeText(source.heroTitle, fallback.heroTitle),
    heroTitleHighlight: normalizeText(source.heroTitleHighlight, fallback.heroTitleHighlight),
    heroDescription: normalizeText(source.heroDescription, fallback.heroDescription),
    heroPrimaryCta: normalizeText(source.heroPrimaryCta, fallback.heroPrimaryCta),
    heroSecondaryCta: normalizeText(source.heroSecondaryCta, fallback.heroSecondaryCta),
    servicesTitle: normalizeText(source.servicesTitle, fallback.servicesTitle),
    servicesDescription: normalizeText(source.servicesDescription, fallback.servicesDescription),
    serviceItems: normalizeItems(source.serviceItems, fallback.serviceItems),
    whyUsTitle: normalizeText(source.whyUsTitle, fallback.whyUsTitle),
    whyUsDescription: normalizeText(source.whyUsDescription, fallback.whyUsDescription),
    whyUsItems: normalizeItems(source.whyUsItems, fallback.whyUsItems),
    portalFeatureEyebrow: normalizeText(source.portalFeatureEyebrow, fallback.portalFeatureEyebrow),
    portalFeatureTitle: normalizeText(source.portalFeatureTitle, fallback.portalFeatureTitle),
    portalFeatureDescription: normalizeText(
      source.portalFeatureDescription,
      fallback.portalFeatureDescription
    ),
    portalFeatureItems: normalizeItems(source.portalFeatureItems, fallback.portalFeatureItems),
    portalFeaturePrimaryCta: normalizeText(
      source.portalFeaturePrimaryCta,
      fallback.portalFeaturePrimaryCta
    ),
    portalFeatureSecondaryCta: normalizeText(
      source.portalFeatureSecondaryCta,
      fallback.portalFeatureSecondaryCta
    ),
    marketEyebrow: normalizeText(source.marketEyebrow, fallback.marketEyebrow),
    marketTitle: normalizeText(source.marketTitle, fallback.marketTitle),
    marketIntro: normalizeText(source.marketIntro, fallback.marketIntro),
    marketBullets: normalizeBullets(source.marketBullets, fallback.marketBullets),
    ctaTitle: normalizeText(source.ctaTitle, fallback.ctaTitle),
    ctaDescription: normalizeText(source.ctaDescription, fallback.ctaDescription),
    ctaButton: normalizeText(source.ctaButton, fallback.ctaButton),
    featuredTitle: normalizeText(source.featuredTitle, fallback.featuredTitle),
    featuredEmptyState: normalizeText(source.featuredEmptyState, fallback.featuredEmptyState),
  };
}

export function sanitizeHomepageContent(input: unknown): HomepageContent {
  const source = input && typeof input === "object" ? (input as Record<string, unknown>) : {};

  return {
    az: sanitizeHomepageLocaleContent(source.az, defaultHomepageContent.az),
    en: sanitizeHomepageLocaleContent(source.en, defaultHomepageContent.en),
    ru: sanitizeHomepageLocaleContent(source.ru, defaultHomepageContent.ru),
  };
}
