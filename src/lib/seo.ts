import type { Metadata } from "next";
import type { LocaleKey } from "@/lib/price-calculator";

const siteName = "Sitecreator";
const defaultLocale: LocaleKey = "az";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sitecreator.az";

const seoCopy = {
  az: {
    home: {
      title: "Veb-sayt hazırlanması və sayt yaradılması | Sitecreator Bakı",
      description:
        "Bakı və Azərbaycan üzrə veb-sayt hazırlanması, sayt yaradılması, e-ticarət saytlarının qurulması və SEO xidməti. Şirkətiniz üçün sürətli, müasir və nəticəyönlü veb həlləri.",
      keywords: [
        "veb-sayt hazırlanması",
        "sayt yaradılması",
        "veb-sayt Bakı",
        "SEO xidməti Bakı",
        "e-ticarət saytı",
        "korporativ sayt hazırlanması",
      ],
    },
    about: {
      title: "Haqqımızda | Sitecreator veb-sayt və SEO agentliyi",
      description:
        "Sitecreator komandasının təcrübəsi, veb-sayt hazırlanması, e-ticarət sistemləri və Azərbaycan bazarına yönəlmiş SEO həlləri haqqında məlumat alın.",
      keywords: ["haqqımızda", "veb agentlik Bakı", "SEO agentliyi Azərbaycan"],
    },
    portfolio: {
      title: "Portfolio | Hazırladığımız veb-saytlar və rəqəmsal layihələr",
      description:
        "Hazırladığımız korporativ saytlar, landing page, e-ticarət və xüsusi rəqəmsal layihələrlə tanış olun. Azərbaycan bazarı üçün real iş nümunələri.",
      keywords: ["portfolio", "hazırlanmış saytlar", "veb layihələr", "Bakı veb portfolio"],
    },
    contact: {
      title: "Əlaqə | Veb-sayt sifarişi və pulsuz konsultasiya",
      description:
        "Veb-sayt sifarişi, sayt yenilənməsi, SEO xidməti və e-ticarət layihəniz üçün Sitecreator ilə əlaqə saxlayın. Bakı və Azərbaycan üzrə sürətli cavab.",
      keywords: ["əlaqə", "veb-sayt sifarişi", "SEO konsultasiya", "Bakı veb agentlik əlaqə"],
    },
    calculator: {
      title: "Qiymət kalkulyatoru | Veb-sayt və e-ticarət qiymət hesablaması",
      description:
        "Veb-sayt, e-ticarət, dizayn, SEO və dəstək xərclərini onlayn hesablayın. Azərbaycan bazarı üçün sayt yaradılması qiymət kalkulyatoru.",
      keywords: ["qiymət kalkulyatoru", "veb-sayt qiyməti", "sayt neçəyə başa gəlir", "e-ticarət qiyməti"],
    },
    blog: {
      title: "Bloq və keys araşdırmaları | Veb-sayt, SEO və rəqəmsal böyümə bələdçiləri",
      description:
        "Veb-sayt hazırlanması, SEO, e-ticarət, konversiya artımı və real keys araşdırmaları ilə Sitecreator bloqunda praktik məlumatlar alın.",
      keywords: ["Sitecreator bloq", "veb-sayt bloqu", "SEO keys araşdırması", "rəqəmsal marketinq bloqu"],
    },
  },
  en: {
    home: {
      title: "Web Design and Website Development in Baku | Sitecreator",
      description:
        "Website development, e-commerce solutions, SEO services, and conversion-focused digital products for businesses in Baku and across Azerbaijan.",
      keywords: [
        "website development Baku",
        "web design Azerbaijan",
        "SEO services Baku",
        "e-commerce website Azerbaijan",
      ],
    },
    about: {
      title: "About Sitecreator | Web Development and SEO Agency",
      description:
        "Learn about Sitecreator, our experience in web development, e-commerce systems, and search-driven digital growth for the Azerbaijan market.",
      keywords: ["about Sitecreator", "web agency Azerbaijan", "SEO agency Baku"],
    },
    portfolio: {
      title: "Portfolio | Websites and Digital Projects by Sitecreator",
      description:
        "Explore our portfolio of corporate websites, landing pages, e-commerce builds, and custom digital systems created for real business needs.",
      keywords: ["web design portfolio", "website projects Azerbaijan", "Baku web agency portfolio"],
    },
    contact: {
      title: "Contact Sitecreator | Request a Website or SEO Consultation",
      description:
        "Contact Sitecreator for website design, development, SEO, e-commerce, or a custom digital system in Baku and across Azerbaijan.",
      keywords: ["contact web agency Baku", "website consultation Azerbaijan", "SEO consultation Baku"],
    },
    calculator: {
      title: "Website Price Calculator | Estimate Web and E-commerce Costs",
      description:
        "Estimate website, e-commerce, design, SEO, and support costs with our online pricing calculator built for the Azerbaijan market.",
      keywords: ["website price calculator", "web design cost Baku", "e-commerce quote Azerbaijan"],
    },
    blog: {
      title: "Blog and Case Studies | Website, SEO and Growth Insights",
      description:
        "Explore practical articles and case studies on website strategy, SEO, e-commerce, and digital growth tailored to businesses in Azerbaijan.",
      keywords: ["web design blog", "SEO case studies", "digital growth articles", "Azerbaijan web agency blog"],
    },
  },
  ru: {
    home: {
      title: "Разработка сайтов и SEO в Баку | Sitecreator",
      description:
        "Разработка сайтов, интернет-магазинов, SEO и современных веб-решений для бизнеса в Баку и по всему Азербайджану.",
      keywords: [
        "разработка сайтов Баку",
        "создание сайта Азербайджан",
        "SEO Баку",
        "интернет-магазин Баку",
      ],
    },
    about: {
      title: "О нас | Sitecreator, веб- и SEO-агентство",
      description:
        "Узнайте больше о команде Sitecreator, нашем опыте в разработке сайтов, систем интернет-торговли и SEO-продвижении в Азербайджане.",
      keywords: ["о нас", "веб-студия Баку", "SEO-агентство Азербайджан"],
    },
    portfolio: {
      title: "Портфолио | Наши сайты и цифровые проекты",
      description:
        "Смотрите примеры корпоративных сайтов, landing page, интернет-магазинов и индивидуальных веб-проектов для реальных бизнес-задач.",
      keywords: ["портфолио сайтов", "веб-проекты Баку", "примеры сайтов Азербайджан"],
    },
    contact: {
      title: "Контакты | Заказ сайта и SEO-консультация",
      description:
        "Свяжитесь с Sitecreator по вопросам разработки сайта, SEO, интернет-магазина или индивидуальной цифровой системы в Баку и Азербайджане.",
      keywords: ["контакты веб-студия", "заказ сайта Баку", "SEO-консультация Баку"],
    },
    calculator: {
      title: "Калькулятор стоимости сайта | Расчет веб-проекта и интернет-магазина",
      description:
        "Онлайн-расчет стоимости сайта, интернет-магазина, дизайна, SEO и поддержки для проектов на рынке Азербайджана.",
      keywords: ["калькулятор стоимости сайта", "цена сайта Баку", "расчет интернет-магазина"],
    },
    blog: {
      title: "Блог и кейсы | Сайты, SEO и цифровой рост",
      description:
        "Читайте практические статьи и кейсы о разработке сайтов, SEO, интернет-торговле и цифровом росте для бизнеса в Азербайджане.",
      keywords: ["блог веб-агентства", "SEO кейсы", "цифровой рост Азербайджан", "статьи о сайтах"],
    },
  },
} as const;

export function getSiteUrl() {
  return siteUrl;
}

export function getCanonicalPath(locale: LocaleKey, pathname = "/") {
  const normalizedPath = pathname === "/" ? "" : pathname;
  return `${siteUrl}/${locale}${normalizedPath}`;
}

export function getLanguageAlternates(pathname = "/") {
  return {
    az: getCanonicalPath("az", pathname),
    en: getCanonicalPath("en", pathname),
    ru: getCanonicalPath("ru", pathname),
    "x-default": getCanonicalPath(defaultLocale, pathname),
  };
}

export function buildLocalizedMetadata({
  locale,
  page,
  pathname,
}: {
  locale: LocaleKey;
  page: keyof (typeof seoCopy)["az"];
  pathname?: string;
}): Metadata {
  const current = seoCopy[locale][page];
  const canonical = getCanonicalPath(locale, pathname);

  return {
    title: current.title,
    description: current.description,
    keywords: [...current.keywords],
    alternates: {
      canonical,
      languages: getLanguageAlternates(pathname),
    },
    openGraph: {
      type: "website",
      locale,
      url: canonical,
      siteName,
      title: current.title,
      description: current.description,
    },
    twitter: {
      card: "summary_large_image",
      title: current.title,
      description: current.description,
    },
  };
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Sitecreator",
        alternateName: "Sitecreator Azerbaijan",
        url: siteUrl,
        email: "info@sitecreator.az",
        telephone: "+994501234567",
        sameAs: ["https://instagram.com/sitecreator"],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Baku",
          addressCountry: "AZ",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Sitecreator",
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
        inLanguage: ["az", "en", "ru"],
      },
      {
        "@type": "ProfessionalService",
        "@id": `${siteUrl}/#service`,
        name: "Sitecreator",
        areaServed: [
          {
            "@type": "Country",
            name: "Azerbaijan",
          },
          {
            "@type": "City",
            name: "Baku",
          },
        ],
        serviceType: [
          "Website development",
          "Web design",
          "SEO services",
          "E-commerce development",
        ],
        provider: {
          "@id": `${siteUrl}/#organization`,
        },
      },
    ],
  };
}
