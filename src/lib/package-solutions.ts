import { slugifyInsight } from "@/lib/insight-utils";

export const packageLocales = ["az", "en", "ru"] as const;
export type PackageLocale = (typeof packageLocales)[number];

export type PackageInfoItem = { title: string; description: string };
export type PackageFaqItem = { question: string; answer: string };
export type PackageInstagramSlide = { title: string; body: string };
export type PackageInstagramDraft = {
  coverTitle: string;
  coverSubtitle: string;
  caption: string;
  cta: string;
  slides: PackageInstagramSlide[];
};

export type PackageLocaleContent = {
  cardTitle: string;
  cardDescription: string;
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  audienceTitle: string;
  audienceDescription: string;
  perfectForTitle: string;
  perfectFor: string[];
  includedTitle: string;
  includedModules: string[];
  highlightsTitle: string;
  highlights: PackageInfoItem[];
  faqTitle: string;
  faqDescription: string;
  faqItems: PackageFaqItem[];
  timelineLabel: string;
  primaryCta: string;
  secondaryCta: string;
  seoTitle: string;
  seoDescription: string;
  instagram: PackageInstagramDraft;
};

export type PackageSolutionRecord = {
  id: string;
  order: number;
  category: string;
  coverImageUrl: string;
  startingPrice: number;
  slugs: Record<PackageLocale, string>;
  content: Record<PackageLocale, PackageLocaleContent>;
};

export type PackageDirectoryLocaleContent = {
  badge: string;
  title: string;
  description: string;
};

export type PackageSolutionsConfig = {
  directory: Record<PackageLocale, PackageDirectoryLocaleContent>;
  packages: PackageSolutionRecord[];
};

export function createEmptyInstagramDraft(): PackageInstagramDraft {
  return {
    coverTitle: "",
    coverSubtitle: "",
    caption: "",
    cta: "",
    slides: [
      { title: "", body: "" },
      { title: "", body: "" },
      { title: "", body: "" },
      { title: "", body: "" },
    ],
  };
}

export function createEmptyPackageLocaleContent(): PackageLocaleContent {
  return {
    cardTitle: "",
    cardDescription: "",
    heroBadge: "",
    heroTitle: "",
    heroDescription: "",
    audienceTitle: "",
    audienceDescription: "",
    perfectForTitle: "",
    perfectFor: ["", "", ""],
    includedTitle: "",
    includedModules: ["", "", "", ""],
    highlightsTitle: "",
    highlights: [
      { title: "", description: "" },
      { title: "", description: "" },
      { title: "", description: "" },
    ],
    faqTitle: "",
    faqDescription: "",
    faqItems: [
      { question: "", answer: "" },
      { question: "", answer: "" },
    ],
    timelineLabel: "",
    primaryCta: "",
    secondaryCta: "",
    seoTitle: "",
    seoDescription: "",
    instagram: createEmptyInstagramDraft(),
  };
}

function cloneLocaleContent(content: PackageLocaleContent): PackageLocaleContent {
  return {
    ...content,
    perfectFor: [...content.perfectFor],
    includedModules: [...content.includedModules],
    highlights: content.highlights.map((item) => ({ ...item })),
    faqItems: content.faqItems.map((item) => ({ ...item })),
    instagram: {
      ...content.instagram,
      slides: content.instagram.slides.map((slide) => ({ ...slide })),
    },
  };
}

function createPackageRecord(
  id: string,
  order: number,
  category: string,
  coverImageUrl: string,
  startingPrice: number,
  slugs: Record<PackageLocale, string>,
  content: Record<PackageLocale, PackageLocaleContent>
): PackageSolutionRecord {
  return {
    id,
    order,
    category,
    coverImageUrl,
    startingPrice,
    slugs: { ...slugs },
    content: {
      az: cloneLocaleContent(content.az),
      en: cloneLocaleContent(content.en),
      ru: cloneLocaleContent(content.ru),
    },
  };
}

export function createEmptyPackageRecord(id = "new-package", order = 1): PackageSolutionRecord {
  return createPackageRecord(
    id,
    order,
    "business",
    "",
    0,
    { az: `${id}-az`, en: `${id}-en`, ru: `${id}-ru` },
    {
      az: createEmptyPackageLocaleContent(),
      en: createEmptyPackageLocaleContent(),
      ru: createEmptyPackageLocaleContent(),
    }
  );
}

function buildInstagramDraft(
  locale: PackageLocale,
  title: string,
  description: string,
  modules: string[],
  perfectFor: string[],
  startingPrice: number,
  timelineLabel: string
): PackageInstagramDraft {
  const cleanModules = modules.filter(Boolean).slice(0, 4);
  const cleanPerfectFor = perfectFor.filter(Boolean).slice(0, 3);
  const price = startingPrice.toLocaleString("en-US");

  if (locale === "en") {
    return {
      coverTitle: title || "Ready business package",
      coverSubtitle: `Starting from ₼ ${price}`,
      caption: `${title}\n\n${description}\n\nIncluded:\n${cleanModules.map((item) => `• ${item}`).join("\n")}\n\nBest for:\n${cleanPerfectFor.map((item) => `• ${item}`).join("\n")}\n\nDelivery: ${timelineLabel}`,
      cta: "Send us a DM for the full package scope.",
      slides: [
        { title: title || "Package", body: description || "Launch-ready package" },
        { title: "Best for", body: cleanPerfectFor.join(" • ") || "Fast launches" },
        { title: "Included", body: cleanModules.join(" • ") || "Core pages and CTA blocks" },
        { title: "Timeline & budget", body: `From ₼ ${price}\n${timelineLabel || "Scope-based"}` },
      ],
    };
  }

  if (locale === "ru") {
    return {
      coverTitle: title || "Готовый пакет",
      coverSubtitle: `Старт от ₼ ${price}`,
      caption: `${title}\n\n${description}\n\nЧто входит:\n${cleanModules.map((item) => `• ${item}`).join("\n")}\n\nДля кого:\n${cleanPerfectFor.map((item) => `• ${item}`).join("\n")}\n\nСрок: ${timelineLabel}`,
      cta: "Напишите нам за полным scope пакета.",
      slides: [
        { title: title || "Пакет", body: description || "Готовое решение под запуск" },
        { title: "Кому подходит", body: cleanPerfectFor.join(" • ") || "Для быстрого запуска" },
        { title: "Что входит", body: cleanModules.join(" • ") || "Основные страницы и CTA" },
        { title: "Срок и бюджет", body: `От ₼ ${price}\n${timelineLabel || "По scope"}` },
      ],
    };
  }

  return {
    coverTitle: title || "Hazır paket",
    coverSubtitle: `Start ₼ ${price}`,
    caption: `${title}\n\n${description}\n\nDaxildir:\n${cleanModules.map((item) => `• ${item}`).join("\n")}\n\nKimlər üçün:\n${cleanPerfectFor.map((item) => `• ${item}`).join("\n")}\n\nMüddət: ${timelineLabel}`,
    cta: "Tam paket scope-u üçün bizə yaz.",
    slides: [
      { title: title || "Paket", body: description || "Launch-ready həll" },
      { title: "Kimlər üçündür?", body: cleanPerfectFor.join(" • ") || "Sürətli launch üçün" },
      { title: "Nələr daxildir?", body: cleanModules.join(" • ") || "Əsas səhifələr və CTA blokları" },
      { title: "Müddət və büdcə", body: `Start ₼ ${price}\n${timelineLabel || "Scope-a görə"}` },
    ],
  };
}

function localeContent(
  locale: PackageLocale,
  values: Omit<PackageLocaleContent, "instagram">
): PackageLocaleContent {
  return {
    ...values,
    instagram: buildInstagramDraft(
      locale,
      values.cardTitle,
      values.cardDescription,
      values.includedModules,
      values.perfectFor,
      0,
      values.timelineLabel
    ),
  };
}

type PackageSeedLocaleSpec = {
  title: string;
  description: string;
  audience: string;
  perfectFor: string[];
  includedModules: string[];
  timelineLabel: string;
  primaryCta: string;
  secondaryCta: string;
  faqQuestionOne: string;
  faqAnswerOne: string;
  faqQuestionTwo: string;
  faqAnswerTwo: string;
};

function buildPresetLocaleContent(
  locale: PackageLocale,
  spec: PackageSeedLocaleSpec,
  startingPrice: number
): PackageLocaleContent {
  const priceText =
    locale === "en"
      ? `Starting from ₼ ${startingPrice.toLocaleString("en-US")}`
      : locale === "ru"
        ? `Старт от ₼ ${startingPrice.toLocaleString("en-US")}`
        : `Start ₼ ${startingPrice.toLocaleString("en-US")}`;

  const titleMap = {
    az: {
      audienceTitle: "Kimlər üçün uyğundur?",
      perfectForTitle: "Ən uyğun hallar",
      includedTitle: "Əsas modullar",
      highlightsTitle: "Əsas faydalar",
      faqTitle: "FAQ",
      faqDescription: "Bu paket haqqında qısa cavablar.",
      heroBadge: "Hazır paket",
      highlights: [
        { title: "Daha sürətli launch", description: "Əsas struktur hazır olduğu üçün layihə daha tez start götürür." },
        { title: "Daha aydın təklif", description: "Müştəri nəyin daxil olduğunu ilk baxışdan görür." },
        { title: "Böyüməyə açıq baza", description: "Sonradan əlavə modul və inteqrasiyalar rahat artırıla bilər." },
      ],
    },
    en: {
      audienceTitle: "Who is it for?",
      perfectForTitle: "Works well for",
      includedTitle: "Core modules",
      highlightsTitle: "Main benefits",
      faqTitle: "FAQ",
      faqDescription: "Quick answers about this package.",
      heroBadge: "Ready package",
      highlights: [
        { title: "Faster launch", description: "The core structure is already mapped for a quicker start." },
        { title: "Clearer offer", description: "Clients immediately understand what is included." },
        { title: "Growth-ready base", description: "More modules and integrations can be added later." },
      ],
    },
    ru: {
      audienceTitle: "Для кого подходит?",
      perfectForTitle: "Лучше всего подходит",
      includedTitle: "Основные модули",
      highlightsTitle: "Основные плюсы",
      faqTitle: "FAQ",
      faqDescription: "Коротко о пакете.",
      heroBadge: "Готовый пакет",
      highlights: [
        { title: "Быстрый запуск", description: "Базовая структура уже готова и ускоряет старт проекта." },
        { title: "Понятный scope", description: "Клиент сразу видит, что именно входит в пакет." },
        { title: "База для роста", description: "Позже можно добавить новые модули и интеграции." },
      ],
    },
  }[locale];

  return localeContent(locale, {
    cardTitle: spec.title,
    cardDescription: spec.description,
    heroBadge: titleMap.heroBadge,
    heroTitle: spec.title,
    heroDescription: `${spec.description} ${priceText}`,
    audienceTitle: titleMap.audienceTitle,
    audienceDescription: spec.audience,
    perfectForTitle: titleMap.perfectForTitle,
    perfectFor: spec.perfectFor,
    includedTitle: titleMap.includedTitle,
    includedModules: spec.includedModules,
    highlightsTitle: titleMap.highlightsTitle,
    highlights: titleMap.highlights,
    faqTitle: titleMap.faqTitle,
    faqDescription: titleMap.faqDescription,
    faqItems: [
      { question: spec.faqQuestionOne, answer: spec.faqAnswerOne },
      { question: spec.faqQuestionTwo, answer: spec.faqAnswerTwo },
    ],
    timelineLabel: spec.timelineLabel,
    primaryCta: spec.primaryCta,
    secondaryCta: spec.secondaryCta,
    seoTitle: `${spec.title} | Sitecreator`,
    seoDescription: spec.description,
  });
}

function createPresetPackage(options: {
  id: string;
  order: number;
  category: string;
  coverImageUrl: string;
  startingPrice: number;
  slugs: Record<PackageLocale, string>;
  az: PackageSeedLocaleSpec;
  en: PackageSeedLocaleSpec;
  ru: PackageSeedLocaleSpec;
}) {
  return createPackageRecord(
    options.id,
    options.order,
    options.category,
    options.coverImageUrl,
    options.startingPrice,
    options.slugs,
    {
      az: buildPresetLocaleContent("az", options.az, options.startingPrice),
      en: buildPresetLocaleContent("en", options.en, options.startingPrice),
      ru: buildPresetLocaleContent("ru", options.ru, options.startingPrice),
    }
  );
}

const packageSeeds = [
  createPresetPackage({
    id: "landing-page-kit",
    order: 1,
    category: "starter",
    coverImageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    startingPrice: 450,
    slugs: {
      az: "landing-page-paketi",
      en: "landing-page-package",
      ru: "paket-landing-page",
    },
    az: {
      title: "Landing page paketi",
      description: "Tək məhsul, kampaniya və ya reklam axını üçün fokuslu birsəhifəlik satış paketi.",
      audience: "Reklamdan gələn trafiki daha yaxşı çevirmək istəyən kampaniyalar və yeni launch-lar üçün.",
      perfectFor: ["Məhsul launch-ları", "Reklam kampaniyaları", "Sürətli test səhifələri"],
      includedModules: ["Hero və offer bloku", "Güvən elementləri", "Lead formu", "CTA axını"],
      timelineLabel: "4-6 iş günü",
      primaryCta: "Paketi seç",
      secondaryCta: "Detalları müzakirə et",
      faqQuestionOne: "Reklam üçün ayrıca versiya olar?",
      faqAnswerOne: "Bəli, kampaniyaya uyğun copy və struktur düzəldilə bilər.",
      faqQuestionTwo: "Sonradan geniş sayt kimi böyüyə bilər?",
      faqAnswerTwo: "Bəli, bu paket daha böyük sayta çevrilə bilən baza kimi də işləyə bilər.",
    },
    en: {
      title: "Landing page package",
      description: "A focused one-page sales package for a single product, campaign, or ad funnel.",
      audience: "Great for launches and campaigns that need better conversion from paid traffic.",
      perfectFor: ["Product launches", "Ad campaigns", "Fast validation pages"],
      includedModules: ["Hero and offer block", "Trust sections", "Lead form", "CTA flow"],
      timelineLabel: "4-6 business days",
      primaryCta: "Choose this package",
      secondaryCta: "Discuss the scope",
      faqQuestionOne: "Can this be adapted for ads?",
      faqAnswerOne: "Yes, the copy and sections can be tailored to your ad funnel.",
      faqQuestionTwo: "Can it grow into a larger site later?",
      faqAnswerTwo: "Yes, it can become the foundation of a broader website later on.",
    },
    ru: {
      title: "Пакет landing page",
      description: "Фокусный одностраничный пакет для одного продукта, кампании или рекламной воронки.",
      audience: "Подходит для запусков и кампаний, которым нужна лучшая конверсия из рекламы.",
      perfectFor: ["Запуски продукта", "Рекламные кампании", "Быстрые тестовые страницы"],
      includedModules: ["Hero и offer блок", "Блоки доверия", "Lead форма", "CTA flow"],
      timelineLabel: "4-6 рабочих дней",
      primaryCta: "Выбрать пакет",
      secondaryCta: "Обсудить scope",
      faqQuestionOne: "Можно адаптировать под рекламу?",
      faqAnswerOne: "Да, copy и блоки можно подстроить под рекламную воронку.",
      faqQuestionTwo: "Можно потом расширить до большого сайта?",
      faqAnswerTwo: "Да, этот пакет может стать базой для более крупного сайта.",
    },
  }),
  createPresetPackage({
    id: "corporate-website-kit",
    order: 2,
    category: "business",
    coverImageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    startingPrice: 950,
    slugs: {
      az: "korporativ-sayt-paketi",
      en: "corporate-website-package",
      ru: "korporativnyi-sait-paket",
    },
    az: {
      title: "Korporativ sayt paketi",
      description: "Şirkətinizi peşəkar təqdim etmək üçün əsas səhifələr, xidmət blokları və etibar strukturu.",
      audience: "B2B və xidmət yönümlü şirkətlər üçün daha ciddi online imic qurmaq məqsədilə.",
      perfectFor: ["Şirkət təqdimatı", "B2B xidmətlər", "Yeni korporativ launch"],
      includedModules: ["Ana səhifə", "Haqqımızda", "Xidmətlər", "Əlaqə və lead formu"],
      timelineLabel: "7-10 iş günü",
      primaryCta: "Paketi başlat",
      secondaryCta: "Fərdiləşdirilmiş təklif al",
      faqQuestionOne: "Xidmət səhifələri ayrıca yazıla bilər?",
      faqAnswerOne: "Bəli, hər xidmət üçün ayrıca blok və səhifə qurmaq mümkündür.",
      faqQuestionTwo: "İki dil ilə başlamaq olar?",
      faqAnswerTwo: "Bəli, sayt çoxdilli struktura uyğun qurula bilər.",
    },
    en: {
      title: "Corporate website package",
      description: "A professional company website package with core pages, service blocks, and trust structure.",
      audience: "Best for B2B and service-led companies that need a stronger online presence.",
      perfectFor: ["Company presentation", "B2B services", "New corporate launch"],
      includedModules: ["Homepage", "About page", "Services", "Contact and lead form"],
      timelineLabel: "7-10 business days",
      primaryCta: "Start this package",
      secondaryCta: "Get a custom proposal",
      faqQuestionOne: "Can service pages be expanded later?",
      faqAnswerOne: "Yes, each service can later grow into its own dedicated page.",
      faqQuestionTwo: "Can we start with two languages?",
      faqAnswerTwo: "Yes, the package can launch with a multilingual structure.",
    },
    ru: {
      title: "Пакет корпоративного сайта",
      description: "Профессиональный сайт компании с основными страницами, блоками услуг и структурой доверия.",
      audience: "Подходит для B2B и сервисных компаний, которым нужен более сильный онлайн-образ.",
      perfectFor: ["Презентация компании", "B2B услуги", "Корпоративный запуск"],
      includedModules: ["Главная", "О нас", "Услуги", "Контакты и lead форма"],
      timelineLabel: "7-10 рабочих дней",
      primaryCta: "Запустить пакет",
      secondaryCta: "Получить предложение",
      faqQuestionOne: "Можно позже расширить страницы услуг?",
      faqAnswerOne: "Да, каждую услугу можно позже вывести в отдельную страницу.",
      faqQuestionTwo: "Можно стартовать с двумя языками?",
      faqAnswerTwo: "Да, пакет можно запустить с многоязычной структурой.",
    },
  }),
  createPresetPackage({
    id: "service-business-kit",
    order: 3,
    category: "services",
    coverImageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
    startingPrice: 800,
    slugs: {
      az: "xidmet-biznesi-sayti-paketi",
      en: "service-business-package",
      ru: "paket-dlya-servisnogo-biznesa",
    },
    az: {
      title: "Xidmət biznesi paketi",
      description: "Sorğu toplamaq, xidmətləri aydın göstərmək və zəngə çevirmək üçün optimallaşdırılmış paket.",
      audience: "Təmir, logistika, konsaltinq, təhlükəsizlik və digər xidmət biznesləri üçün.",
      perfectFor: ["Lead toplamaq", "WhatsApp və zəng axını", "Regional xidmət biznesləri"],
      includedModules: ["Xidmət kartları", "Sorğu formu", "FAQ", "Call-to-action blokları"],
      timelineLabel: "6-9 iş günü",
      primaryCta: "Paketi seç",
      secondaryCta: "Scope-u danışaq",
      faqQuestionOne: "WhatsApp düyməsi əlavə olunur?",
      faqAnswerOne: "Bəli, paketdə birbaşa əlaqə axını qurmaq mümkündür.",
      faqQuestionTwo: "Xidmət zonaları göstərilə bilər?",
      faqAnswerTwo: "Bəli, filial və ya xidmət coğrafiyası ayrıca göstərilə bilər.",
    },
    en: {
      title: "Service business package",
      description: "A lead-focused website package for businesses that sell services rather than products.",
      audience: "Great for repair, consulting, logistics, security, and other service-led businesses.",
      perfectFor: ["Lead generation", "WhatsApp and call flow", "Regional service brands"],
      includedModules: ["Service cards", "Inquiry form", "FAQ", "CTA sections"],
      timelineLabel: "6-9 business days",
      primaryCta: "Choose this package",
      secondaryCta: "Discuss the scope",
      faqQuestionOne: "Can a WhatsApp flow be added?",
      faqAnswerOne: "Yes, the package can include direct WhatsApp and call actions.",
      faqQuestionTwo: "Can service regions be shown?",
      faqAnswerTwo: "Yes, regions, branches, or service areas can be highlighted.",
    },
    ru: {
      title: "Пакет для сервисного бизнеса",
      description: "Пакет сайта, оптимизированный под сбор заявок и понятную презентацию услуг.",
      audience: "Подходит для ремонта, консалтинга, логистики, охраны и других сервисных ниш.",
      perfectFor: ["Сбор заявок", "WhatsApp и звонки", "Региональные сервисные бренды"],
      includedModules: ["Карточки услуг", "Форма заявки", "FAQ", "CTA блоки"],
      timelineLabel: "6-9 рабочих дней",
      primaryCta: "Выбрать пакет",
      secondaryCta: "Обсудить scope",
      faqQuestionOne: "Можно добавить WhatsApp flow?",
      faqAnswerOne: "Да, пакет поддерживает прямые WhatsApp и call-to-action сценарии.",
      faqQuestionTwo: "Можно показать зоны обслуживания?",
      faqAnswerTwo: "Да, можно отдельно показать регионы, филиалы или сервисные зоны.",
    },
  }),
  createPackageRecord(
    "restaurant-web-kit",
    4,
    "hospitality",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    900,
    {
      az: "restoran-sayti-paketi",
      en: "restaurant-website-package",
      ru: "paket-saita-dlya-restorana",
    },
    {
      az: localeContent("az", {
        cardTitle: "Restoran saytı paketi",
        cardDescription: "Menyu, rezervasiya və WhatsApp sifariş axını olan hazır restoran həlli.",
        heroBadge: "Hazır paket",
        heroTitle: "Restoran üçün launch-ready sayt paketi",
        heroDescription: "Menyu, rezervasiya və filial məlumatları ilə restoranı daha sürətli online çıxarın.",
        audienceTitle: "Kimlər üçün uyğundur?",
        audienceDescription: "Restoran, cafe və lounge formatları üçün hazır başlanğıc həlli.",
        perfectForTitle: "Ən uyğun hallar",
        perfectFor: ["Yeni restoran açılışı", "Menyu və rezervasiya axını", "Instagram trafiki ilə işləmək"],
        includedTitle: "Daxil olan modullar",
        includedModules: ["Ana səhifə", "Online menyu", "Rezervasiya formu", "WhatsApp CTA-ları"],
        highlightsTitle: "Əsas faydalar",
        highlights: [
          { title: "Daha güclü təqdimat", description: "Məkan və konsept daha premium görünür." },
          { title: "Rahat sifariş axını", description: "Rezervasiya və WhatsApp yolunu aydınlaşdırır." },
          { title: "Sürətli launch", description: "Hazır strukturla layihə daha tez çıxır." },
        ],
        faqTitle: "FAQ",
        faqDescription: "Restoran paketi ilə bağlı qısa suallar.",
        faqItems: [
          { question: "Menyu sonradan yenilənə bilər?", answer: "Bəli, menyu hissəsi rahat yenilənir." },
          { question: "Bir neçə filial göstərmək olur?", answer: "Bəli, filial və xəritə blokları əlavə edilə bilər." },
        ],
        timelineLabel: "7-10 iş günü",
        primaryCta: "Bu paketlə başla",
        secondaryCta: "Qiyməti fərdiləşdir",
        seoTitle: "Restoran saytı paketi | Sitecreator",
        seoDescription: "Menyu, rezervasiya və WhatsApp sifarişi ilə restoranlar üçün hazır sayt paketi.",
      }),
      en: localeContent("en", {
        cardTitle: "Restaurant website package",
        cardDescription: "A ready-made hospitality setup with menu, bookings, and WhatsApp ordering.",
        heroBadge: "Ready package",
        heroTitle: "A launch-ready website package for restaurants",
        heroDescription: "Bring your menu, booking flow, and location online faster with a polished starter package.",
        audienceTitle: "Who is this for?",
        audienceDescription: "A great fit for restaurants, cafes, and lounge concepts.",
        perfectForTitle: "Best for",
        perfectFor: ["New launches", "Menu and booking flow", "Instagram-driven traffic"],
        includedTitle: "Included modules",
        includedModules: ["Homepage", "Online menu", "Booking form", "WhatsApp CTAs"],
        highlightsTitle: "Main benefits",
        highlights: [
          { title: "Stronger presentation", description: "Your venue looks more premium online." },
          { title: "Cleaner order flow", description: "Bookings and WhatsApp touchpoints are clearer." },
          { title: "Faster launch", description: "The ready structure shortens the go-live path." },
        ],
        faqTitle: "FAQ",
        faqDescription: "Quick answers about the restaurant package.",
        faqItems: [
          { question: "Can the menu be updated later?", answer: "Yes, the menu structure is easy to update." },
          { question: "Can multiple branches be shown?", answer: "Yes, branch and map sections can be added." },
        ],
        timelineLabel: "7-10 business days",
        primaryCta: "Start this package",
        secondaryCta: "Customize the quote",
        seoTitle: "Restaurant website package | Sitecreator",
        seoDescription: "A ready website package for restaurants with menu, bookings, and WhatsApp ordering.",
      }),
      ru: localeContent("ru", {
        cardTitle: "Пакет сайта для ресторана",
        cardDescription: "Готовое решение для ресторана с меню, бронью и заказом через WhatsApp.",
        heroBadge: "Готовый пакет",
        heroTitle: "Launch-ready пакет сайта для ресторана",
        heroDescription: "Быстрый старт с сайтом, где уже продуманы меню, бронь и основные CTA.",
        audienceTitle: "Для кого подходит?",
        audienceDescription: "Для ресторанов, кафе и lounge-форматов.",
        perfectForTitle: "Лучше всего подходит",
        perfectFor: ["Новый запуск", "Меню и бронь", "Трафик из Instagram"],
        includedTitle: "Что входит",
        includedModules: ["Главная", "Онлайн-меню", "Форма брони", "WhatsApp CTA"],
        highlightsTitle: "Основные плюсы",
        highlights: [
          { title: "Сильнее презентация", description: "Заведение выглядит более premium." },
          { title: "Понятнее путь к заказу", description: "Бронь и WhatsApp flow становятся яснее." },
          { title: "Быстрый запуск", description: "Готовая структура ускоряет выход." },
        ],
        faqTitle: "FAQ",
        faqDescription: "Коротко о пакете для ресторана.",
        faqItems: [
          { question: "Можно обновлять меню позже?", answer: "Да, меню можно обновлять." },
          { question: "Можно показать несколько филиалов?", answer: "Да, можно добавить филиалы и карту." },
        ],
        timelineLabel: "7-10 рабочих дней",
        primaryCta: "Запустить пакет",
        secondaryCta: "Настроить стоимость",
        seoTitle: "Пакет сайта для ресторана | Sitecreator",
        seoDescription: "Готовый сайт для ресторана с меню, бронью и WhatsApp-заказом.",
      }),
    }
  ),
  createPackageRecord(
    "clinic-web-kit",
    5,
    "healthcare",
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
    1100,
    {
      az: "klinika-sayti-paketi",
      en: "clinic-website-package",
      ru: "paket-saita-dlya-kliniki",
    },
    {
      az: localeContent("az", {
        cardTitle: "Klinika saytı paketi",
        cardDescription: "Həkim təqdimatı, xidmətlər və qəbul sorğusu üçün hazır healthcare həlli.",
        heroBadge: "Sektor həlli",
        heroTitle: "Klinika üçün etibar yaradan hazır sayt paketi",
        heroDescription: "Həkim heyəti, xidmət sahələri və qəbul CTA-ları ilə daha güclü rəqəmsal təqdimat qurun.",
        audienceTitle: "Kimlər üçündür?",
        audienceDescription: "Klinika, diaqnostika və stomatologiya layihələri üçün uyğundur.",
        perfectForTitle: "Ən uyğun hallar",
        perfectFor: ["Yeni klinika açılışı", "Həkim təqdimatı", "Qəbul sorğusu toplamaq"],
        includedTitle: "Daxil olan hissələr",
        includedModules: ["Həkim bölməsi", "Xidmət səhifələri", "Qəbul formu", "Etibar və FAQ blokları"],
        highlightsTitle: "Əsas faydalar",
        highlights: [
          { title: "Etibar hissi", description: "Klinika daha sistemli və etibarlı görünür." },
          { title: "Aydın xidmət izahı", description: "Pasiyent hansı xidmətin uyğun olduğunu daha rahat anlayır." },
          { title: "Lead toplama", description: "Qəbul müraciətləri daha səliqəli yığılır." },
        ],
        faqTitle: "FAQ",
        faqDescription: "Klinika paketi ilə bağlı qısa suallar.",
        faqItems: [
          { question: "Həkim profilləri ayrıca göstərilir?", answer: "Bəli, ayrıca kart və təqdimat blokları əlavə edilir." },
          { question: "Qəbul axını sonradan böyüyə bilər?", answer: "Bəli, daha geniş sistemə çevrilə bilər." },
        ],
        timelineLabel: "8-12 iş günü",
        primaryCta: "Klinika paketi ilə başla",
        secondaryCta: "Ətraflı müzakirə et",
        seoTitle: "Klinika saytı paketi | Sitecreator",
        seoDescription: "Həkim təqdimatı, xidmətlər və qəbul formu ilə klinika üçün hazır sayt paketi.",
      }),
      en: localeContent("en", {
        cardTitle: "Clinic website package",
        cardDescription: "A healthcare-ready site with doctors, services, and appointment inquiry flow.",
        heroBadge: "Industry setup",
        heroTitle: "A ready clinic website package built for trust",
        heroDescription: "Present doctors, services, and appointment flow in a cleaner and more credible format.",
        audienceTitle: "Who is it for?",
        audienceDescription: "Best for clinics, diagnostic centers, and dental brands.",
        perfectForTitle: "Best for",
        perfectFor: ["Launching a clinic", "Doctor and service presentation", "Appointment inquiries"],
        includedTitle: "Core modules",
        includedModules: ["Doctors section", "Service pages", "Appointment form", "Trust and FAQ blocks"],
        highlightsTitle: "Main benefits",
        highlights: [
          { title: "More trust", description: "Your clinic looks more reliable online." },
          { title: "Clearer service positioning", description: "Visitors understand your offers more easily." },
          { title: "Lead capture", description: "Appointment requests become more structured." },
        ],
        faqTitle: "FAQ",
        faqDescription: "Quick answers about the clinic package.",
        faqItems: [
          { question: "Can each doctor have a profile?", answer: "Yes, dedicated doctor blocks can be added." },
          { question: "Can the appointment flow grow later?", answer: "Yes, it can later become a larger system." },
        ],
        timelineLabel: "8-12 business days",
        primaryCta: "Start the clinic package",
        secondaryCta: "Discuss the scope",
        seoTitle: "Clinic website package | Sitecreator",
        seoDescription: "A ready healthcare website package with doctors, services, and appointment inquiries.",
      }),
      ru: localeContent("ru", {
        cardTitle: "Пакет сайта для клиники",
        cardDescription: "Готовый healthcare-сайт с врачами, услугами и формой записи.",
        heroBadge: "Отраслевое решение",
        heroTitle: "Готовый пакет сайта для клиники",
        heroDescription: "Покажите врачей, услуги и путь к записи в более ясном и сильном формате.",
        audienceTitle: "Для кого?",
        audienceDescription: "Подходит для клиник, диагностики и стоматологии.",
        perfectForTitle: "Лучше всего подходит",
        perfectFor: ["Запуск клиники", "Презентация врачей", "Сбор запросов на приём"],
        includedTitle: "Что входит",
        includedModules: ["Раздел врачей", "Страницы услуг", "Форма приёма", "Trust и FAQ блоки"],
        highlightsTitle: "Основные плюсы",
        highlights: [
          { title: "Больше доверия", description: "Клиника выглядит более надёжно." },
          { title: "Понятнее услуги", description: "Посетитель быстрее понимает ваши услуги." },
          { title: "Сбор обращений", description: "Запросы на приём собираются аккуратнее." },
        ],
        faqTitle: "FAQ",
        faqDescription: "Коротко о пакете для клиники.",
        faqItems: [
          { question: "Можно ли сделать профили врачей?", answer: "Да, можно добавить отдельные блоки." },
          { question: "Можно ли потом расширить запись?", answer: "Да, flow можно расширить позже." },
        ],
        timelineLabel: "8-12 рабочих дней",
        primaryCta: "Запустить пакет",
        secondaryCta: "Обсудить scope",
        seoTitle: "Пакет сайта для клиники | Sitecreator",
        seoDescription: "Готовый сайт для клиники с врачами, услугами и формой записи.",
      }),
    }
  ),
  createPackageRecord(
    "ecommerce-starter",
    6,
    "commerce",
    "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80",
    1400,
    {
      az: "ecommerce-starter-paketi",
      en: "ecommerce-starter-package",
      ru: "ecommerce-starter-paket",
    },
    {
      az: localeContent("az", {
        cardTitle: "E-commerce starter",
        cardDescription: "Məhsul kataloqu, səbət və satış axını ilə mağaza başlatmaq üçün hazır paket.",
        heroBadge: "Starter commerce",
        heroTitle: "Onlayn satış üçün hazır e-commerce paketi",
        heroDescription: "Məhsul kataloqu və əsas checkout axını ilə mağazanızı qısa müddətdə online çıxarın.",
        audienceTitle: "Kimlər üçün uyğundur?",
        audienceDescription: "İlk mağazasını quran və ya Instagram satışını sistemləşdirmək istəyən bizneslər üçün.",
        perfectForTitle: "Ən uyğun hallar",
        perfectFor: ["Kiçik kataloq", "Instagram-dan sayt satışına keçid", "Starter büdcə ilə launch"],
        includedTitle: "Əsas modullar",
        includedModules: ["Məhsul siyahısı", "Məhsul detail səhifəsi", "Səbət və checkout", "Kampaniya CTA-ları"],
        highlightsTitle: "Əsas faydalar",
        highlights: [
          { title: "Satış üçün struktur", description: "Məhsullar və checkout daha nizami görünür." },
          { title: "Peşəkar mağaza təəssüratı", description: "Social vitrininiz daha ciddi görünür." },
          { title: "Böyüməyə hazır baza", description: "Sonradan modullar və inteqrasiyalar artırıla bilər." },
        ],
        faqTitle: "FAQ",
        faqDescription: "Starter e-commerce paketi üçün qısa suallar.",
        faqItems: [
          { question: "Ödəniş sistemi sonradan əlavə oluna bilər?", answer: "Bəli, daha geniş checkout məntiqi ilə böyüdülə bilər." },
          { question: "Məhsul sayı artdıqda sistem böyüyər?", answer: "Bəli, struktur genişlənməyə uyğundur." },
        ],
        timelineLabel: "10-14 iş günü",
        primaryCta: "Starter paketi seç",
        secondaryCta: "Fərdiləşdirilmiş qiymət al",
        seoTitle: "E-commerce starter paketi | Sitecreator",
        seoDescription: "Məhsul kataloqu, səbət və satış axını olan hazır e-commerce başlanğıc paketi.",
      }),
      en: localeContent("en", {
        cardTitle: "E-commerce starter",
        cardDescription: "A ready starter package with product catalog, cart, and core sales flow.",
        heroBadge: "Starter commerce",
        heroTitle: "A launch-ready e-commerce package for getting online faster",
        heroDescription: "Move from social-only selling to a cleaner online store with a core catalog and checkout flow.",
        audienceTitle: "Who is it for?",
        audienceDescription: "Best for brands launching their first store or systemizing Instagram sales.",
        perfectForTitle: "Works well for",
        perfectFor: ["Small catalog", "Moving from Instagram to site sales", "Starter-budget launch"],
        includedTitle: "Core modules",
        includedModules: ["Product list", "Product detail page", "Cart and checkout", "Campaign CTA blocks"],
        highlightsTitle: "Main benefits",
        highlights: [
          { title: "Clearer sales flow", description: "Catalog and checkout look more structured." },
          { title: "More credible store presence", description: "Your offer feels more like a real store." },
          { title: "Base for growth", description: "You can later expand with more modules." },
        ],
        faqTitle: "FAQ",
        faqDescription: "Quick answers about the starter package.",
        faqItems: [
          { question: "Can payments be added later?", answer: "Yes, the first version can grow later." },
          { question: "Can the catalog scale?", answer: "Yes, the structure supports growth." },
        ],
        timelineLabel: "10-14 business days",
        primaryCta: "Choose the starter package",
        secondaryCta: "Get a custom quote",
        seoTitle: "E-commerce starter package | Sitecreator",
        seoDescription: "A ready starter e-commerce package with catalog, cart, and sales flow.",
      }),
      ru: localeContent("ru", {
        cardTitle: "E-commerce starter",
        cardDescription: "Готовый пакет для магазина с каталогом, корзиной и базовым sales flow.",
        heroBadge: "Starter commerce",
        heroTitle: "Готовый e-commerce пакет для быстрого запуска",
        heroDescription: "Переведите продажи из соцсетей в более понятный магазин с каталогом и checkout flow.",
        audienceTitle: "Для кого подходит?",
        audienceDescription: "Для брендов, которые запускают первый магазин или систематизируют продажи из Instagram.",
        perfectForTitle: "Лучше всего подходит",
        perfectFor: ["Небольшой каталог", "Переход к продажам на сайте", "Starter-бюджет"],
        includedTitle: "Основные модули",
        includedModules: ["Список товаров", "Страница товара", "Корзина и checkout", "CTA-блоки"],
        highlightsTitle: "Основные плюсы",
        highlights: [
          { title: "Понятнее sales flow", description: "Каталог и checkout выглядят более структурно." },
          { title: "Сильнее образ магазина", description: "Витрина выглядит более профессионально." },
          { title: "База для роста", description: "Позже можно расширять модулями." },
        ],
        faqTitle: "FAQ",
        faqDescription: "Коротко о starter-пакете.",
        faqItems: [
          { question: "Можно ли позже подключить оплату?", answer: "Да, checkout можно позже расширить." },
          { question: "Каталог выдержит рост?", answer: "Да, структура рассчитана на расширение." },
        ],
        timelineLabel: "10-14 рабочих дней",
        primaryCta: "Выбрать starter пакет",
        secondaryCta: "Получить custom quote",
        seoTitle: "E-commerce starter paket | Sitecreator",
        seoDescription: "Готовый starter e-commerce пакет с каталогом, корзиной и sales flow.",
      }),
    }
  ),
  createPresetPackage({
    id: "course-center-kit",
    order: 7,
    category: "education",
    coverImageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    startingPrice: 980,
    slugs: {
      az: "kurs-merkezi-sayti-paketi",
      en: "course-center-package",
      ru: "paket-dlya-uchebnogo-centra",
    },
    az: {
      title: "Kurs mərkəzi paketi",
      description: "Proqramlar, müəllimlər və qeydiyyat axını ilə kurs mərkəzləri üçün hazır launch paketi.",
      audience: "Tədris mərkəzləri, language school-lar və təlim brendləri üçün uyğundur.",
      perfectFor: ["Qrup qeydiyyatı", "Müəllim təqdimatı", "Yeni filial launch-ı"],
      includedModules: ["Proqram blokları", "Müəllimlər bölməsi", "Qeydiyyat formu", "FAQ və CTA"],
      timelineLabel: "7-10 iş günü",
      primaryCta: "Paketi başlat",
      secondaryCta: "Məsləhətləşmə al",
      faqQuestionOne: "Bir neçə proqram ayrıca göstərilə bilər?",
      faqAnswerOne: "Bəli, hər proqram üçün ayrıca blok və CTA vermək mümkündür.",
      faqQuestionTwo: "Qeydiyyat formu fərdiləşdirilə bilər?",
      faqAnswerTwo: "Bəli, uyğun suallar və seçim sahələri əlavə edilə bilər.",
    },
    en: {
      title: "Course center package",
      description: "A ready launch package for education brands with programs, teachers, and registration flow.",
      audience: "Designed for training centers, language schools, and educational brands.",
      perfectFor: ["Program registrations", "Teacher showcase", "New branch launch"],
      includedModules: ["Program sections", "Teachers block", "Registration form", "FAQ and CTA"],
      timelineLabel: "7-10 business days",
      primaryCta: "Start this package",
      secondaryCta: "Book a consultation",
      faqQuestionOne: "Can multiple programs be listed separately?",
      faqAnswerOne: "Yes, each program can have its own section and CTA.",
      faqQuestionTwo: "Can the registration form be customized?",
      faqAnswerTwo: "Yes, the form can be adapted to your intake questions.",
    },
    ru: {
      title: "Пакет для учебного центра",
      description: "Готовый пакет для образовательных брендов с программами, преподавателями и формой регистрации.",
      audience: "Подходит для учебных центров, языковых школ и образовательных брендов.",
      perfectFor: ["Регистрация на программы", "Блок преподавателей", "Запуск нового филиала"],
      includedModules: ["Блоки программ", "Раздел преподавателей", "Форма регистрации", "FAQ и CTA"],
      timelineLabel: "7-10 рабочих дней",
      primaryCta: "Запустить пакет",
      secondaryCta: "Получить консультацию",
      faqQuestionOne: "Можно ли показать несколько программ отдельно?",
      faqAnswerOne: "Да, для каждой программы можно сделать отдельный блок и CTA.",
      faqQuestionTwo: "Можно ли адаптировать форму регистрации?",
      faqAnswerTwo: "Да, форму можно настроить под вашу воронку заявок.",
    },
  }),
  createPresetPackage({
    id: "tourism-agency-kit",
    order: 8,
    category: "travel",
    coverImageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
    startingPrice: 1100,
    slugs: {
      az: "turizm-agentliyi-paketi",
      en: "tourism-agency-package",
      ru: "paket-dlya-turagentstva",
    },
    az: {
      title: "Turizm agentliyi paketi",
      description: "Turlar, vizalar və müraciət toplama axını olan səliqəli turizm website paketi.",
      audience: "Tur paketləri, viza xidmətləri və outbound turlar satan agentliklər üçün.",
      perfectFor: ["Tur təqdimatı", "Viza müraciətləri", "WhatsApp satış axını"],
      includedModules: ["Tur kartları", "Xidmət səhifələri", "Sorğu formu", "Sosial etibar blokları"],
      timelineLabel: "8-12 iş günü",
      primaryCta: "Paketi seç",
      secondaryCta: "Custom variant soruş",
      faqQuestionOne: "Turları ayrıca bölmələrdə göstərə bilərik?",
      faqAnswerOne: "Bəli, istiqamət və kampaniyalar ayrıca qruplaşdırıla bilər.",
      faqQuestionTwo: "WhatsApp və zəng CTA əlavə olunur?",
      faqAnswerTwo: "Bəli, sürətli əlaqə axını bu paketə rahat daxil edilir.",
    },
    en: {
      title: "Tourism agency package",
      description: "A clean tourism website package for tours, visa services, and inquiry collection.",
      audience: "Best for agencies selling travel packages, visas, and outbound tours.",
      perfectFor: ["Tour presentation", "Visa inquiries", "WhatsApp sales flow"],
      includedModules: ["Tour cards", "Service pages", "Inquiry form", "Trust sections"],
      timelineLabel: "8-12 business days",
      primaryCta: "Choose this package",
      secondaryCta: "Ask for a custom version",
      faqQuestionOne: "Can tours be grouped by destination?",
      faqAnswerOne: "Yes, destinations and campaigns can be organized into separate blocks.",
      faqQuestionTwo: "Can quick-contact actions be added?",
      faqAnswerTwo: "Yes, WhatsApp and direct call flows can be built in.",
    },
    ru: {
      title: "Пакет для тур-агентства",
      description: "Аккуратный туризм-сайт для туров, визовых услуг и сбора обращений.",
      audience: "Подходит для агентств, которые продают туры, визы и outbound-направления.",
      perfectFor: ["Презентация туров", "Визовые заявки", "WhatsApp продажи"],
      includedModules: ["Карточки туров", "Страницы услуг", "Форма заявки", "Блоки доверия"],
      timelineLabel: "8-12 рабочих дней",
      primaryCta: "Выбрать пакет",
      secondaryCta: "Спросить custom вариант",
      faqQuestionOne: "Можно ли группировать туры по направлениям?",
      faqAnswerOne: "Да, направления и кампании можно оформить отдельными блоками.",
      faqQuestionTwo: "Можно добавить быстрый контакт?",
      faqAnswerTwo: "Да, WhatsApp и direct-call сценарии легко добавляются.",
    },
  }),
  createPresetPackage({
    id: "personal-brand-portfolio-kit",
    order: 9,
    category: "personal-brand",
    coverImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80",
    startingPrice: 650,
    slugs: {
      az: "portfolio-ve-sexsi-brend-paketi",
      en: "personal-brand-portfolio-package",
      ru: "paket-portfolio-i-lichnogo-brenda",
    },
    az: {
      title: "Portfolio və şəxsi brend paketi",
      description: "Özünü, işlərini və təcrübəni daha premium təqdim etmək üçün şəxsi sayt paketi.",
      audience: "Freelancer, consultant, creator və şəxsi brend quran mütəxəssislər üçün.",
      perfectFor: ["Portfolio təqdimatı", "Şəxsi brend", "Konsultasiya lead-ləri"],
      includedModules: ["Haqqımda", "İşlərim", "Rəy blokları", "Əlaqə CTA-ları"],
      timelineLabel: "5-7 iş günü",
      primaryCta: "Paketi başlat",
      secondaryCta: "Nümunəni müzakirə et",
      faqQuestionOne: "Case study bölməsi əlavə etmək olar?",
      faqAnswerOne: "Bəli, işlərini daha dərin göstərən bloklar əlavə edilə bilər.",
      faqQuestionTwo: "Blog sonradan qoşula bilər?",
      faqAnswerTwo: "Bəli, şəxsi brend saytı sonradan content sistemi ilə böyüyə bilər.",
    },
    en: {
      title: "Personal brand portfolio package",
      description: "A polished personal website package for presenting your work, experience, and expertise.",
      audience: "Great for freelancers, consultants, creators, and personal brands.",
      perfectFor: ["Portfolio showcase", "Personal brand building", "Consulting leads"],
      includedModules: ["About section", "Work showcase", "Testimonials", "Contact CTAs"],
      timelineLabel: "5-7 business days",
      primaryCta: "Start this package",
      secondaryCta: "Discuss the style",
      faqQuestionOne: "Can case study sections be added?",
      faqAnswerOne: "Yes, your work can be presented in more detailed case-style blocks.",
      faqQuestionTwo: "Can a blog be added later?",
      faqAnswerTwo: "Yes, the site can later grow into a stronger content-led personal platform.",
    },
    ru: {
      title: "Пакет портфолио и личного бренда",
      description: "Личный сайт для более сильной презентации ваших работ, опыта и экспертности.",
      audience: "Подходит для фрилансеров, консультантов, креаторов и личных брендов.",
      perfectFor: ["Показ портфолио", "Личный бренд", "Consulting leads"],
      includedModules: ["Обо мне", "Портфолио работ", "Отзывы", "Контактные CTA"],
      timelineLabel: "5-7 рабочих дней",
      primaryCta: "Запустить пакет",
      secondaryCta: "Обсудить стиль",
      faqQuestionOne: "Можно добавить case study блоки?",
      faqAnswerOne: "Да, работы можно показать в более детальном формате.",
      faqQuestionTwo: "Можно потом подключить блог?",
      faqAnswerTwo: "Да, сайт можно позже расширить контентной системой.",
    },
  }),
];

export const defaultPackageSolutionsConfig: PackageSolutionsConfig = {
  directory: {
    az: {
      badge: "Hazır paketlər",
      title: "Sahəyə uyğun launch-ready sayt paketləri",
      description: "Agency xidməti ilə yanaşı, konkret biznes növləri üçün hazır başlanğıc həlləri də təqdim edirik.",
    },
    en: {
      badge: "Ready packages",
      title: "Launch-ready website packages by business type",
      description: "Alongside custom agency work, we also offer ready starter packages for specific industries.",
    },
    ru: {
      badge: "Готовые пакеты",
      title: "Launch-ready пакеты сайтов под конкретный бизнес",
      description: "Помимо agency-услуг, мы предлагаем и готовые стартовые пакеты под отдельные ниши.",
    },
  },
  packages: packageSeeds,
};

function normalizeText(value: unknown, fallback: string) {
  return typeof value === "string" ? value.trim() : fallback;
}

function normalizeSlug(value: unknown, fallback: string) {
  const raw = typeof value === "string" ? value.trim() : fallback;
  return slugifyInsight(raw) || fallback;
}

function normalizeStrings(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return [...fallback];
  return value.map((item, index) => normalizeText(item, fallback[index] ?? ""));
}

function normalizeInfoItems(value: unknown, fallback: PackageInfoItem[]) {
  if (!Array.isArray(value)) return fallback.map((item) => ({ ...item }));
  return value.map((item, index) => {
    const source = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const backup = fallback[index] ?? fallback[fallback.length - 1] ?? { title: "", description: "" };
    return {
      title: normalizeText(source.title, backup.title),
      description: normalizeText(source.description, backup.description),
    };
  });
}

function normalizeFaqItems(value: unknown, fallback: PackageFaqItem[]) {
  if (!Array.isArray(value)) return fallback.map((item) => ({ ...item }));
  return value.map((item, index) => {
    const source = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const backup = fallback[index] ?? fallback[fallback.length - 1] ?? { question: "", answer: "" };
    return {
      question: normalizeText(source.question, backup.question),
      answer: normalizeText(source.answer, backup.answer),
    };
  });
}

function normalizeInstagramDraft(value: unknown, fallback: PackageInstagramDraft) {
  const source = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    coverTitle: normalizeText(source.coverTitle, fallback.coverTitle),
    coverSubtitle: normalizeText(source.coverSubtitle, fallback.coverSubtitle),
    caption: normalizeText(source.caption, fallback.caption),
    cta: normalizeText(source.cta, fallback.cta),
    slides: Array.isArray(source.slides)
      ? source.slides.map((item, index) => {
          const slide = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
          const backup = fallback.slides[index] ?? fallback.slides[fallback.slides.length - 1] ?? { title: "", body: "" };
          return {
            title: normalizeText(slide.title, backup.title),
            body: normalizeText(slide.body, backup.body),
          };
        })
      : fallback.slides.map((slide) => ({ ...slide })),
  };
}

function sanitizeLocaleContent(input: unknown, fallback: PackageLocaleContent): PackageLocaleContent {
  const source = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  return {
    cardTitle: normalizeText(source.cardTitle, fallback.cardTitle),
    cardDescription: normalizeText(source.cardDescription, fallback.cardDescription),
    heroBadge: normalizeText(source.heroBadge, fallback.heroBadge),
    heroTitle: normalizeText(source.heroTitle, fallback.heroTitle),
    heroDescription: normalizeText(source.heroDescription, fallback.heroDescription),
    audienceTitle: normalizeText(source.audienceTitle, fallback.audienceTitle),
    audienceDescription: normalizeText(source.audienceDescription, fallback.audienceDescription),
    perfectForTitle: normalizeText(source.perfectForTitle, fallback.perfectForTitle),
    perfectFor: normalizeStrings(source.perfectFor, fallback.perfectFor),
    includedTitle: normalizeText(source.includedTitle, fallback.includedTitle),
    includedModules: normalizeStrings(source.includedModules, fallback.includedModules),
    highlightsTitle: normalizeText(source.highlightsTitle, fallback.highlightsTitle),
    highlights: normalizeInfoItems(source.highlights, fallback.highlights),
    faqTitle: normalizeText(source.faqTitle, fallback.faqTitle),
    faqDescription: normalizeText(source.faqDescription, fallback.faqDescription),
    faqItems: normalizeFaqItems(source.faqItems, fallback.faqItems),
    timelineLabel: normalizeText(source.timelineLabel, fallback.timelineLabel),
    primaryCta: normalizeText(source.primaryCta, fallback.primaryCta),
    secondaryCta: normalizeText(source.secondaryCta, fallback.secondaryCta),
    seoTitle: normalizeText(source.seoTitle, fallback.seoTitle),
    seoDescription: normalizeText(source.seoDescription, fallback.seoDescription),
    instagram: normalizeInstagramDraft(source.instagram, fallback.instagram),
  };
}

function getFallbackPackage(index: number) {
  return defaultPackageSolutionsConfig.packages[index] ?? createEmptyPackageRecord(`package-${index + 1}`, index + 1);
}

function sanitizePackageRecord(input: unknown, fallback: PackageSolutionRecord, index: number): PackageSolutionRecord {
  const source = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const contentSource = source.content && typeof source.content === "object" ? (source.content as Record<string, unknown>) : {};
  const slugsSource = source.slugs && typeof source.slugs === "object" ? (source.slugs as Record<string, unknown>) : {};
  const rawId = normalizeText(source.id, fallback.id || `package-${index + 1}`);
  const safeId = slugifyInsight(rawId) || fallback.id || `package-${index + 1}`;

  return createPackageRecord(
    safeId,
    typeof source.order === "number" ? source.order : index + 1,
    normalizeText(source.category, fallback.category),
    normalizeText(source.coverImageUrl, fallback.coverImageUrl),
    typeof source.startingPrice === "number" ? source.startingPrice : fallback.startingPrice,
    {
      az: normalizeSlug(slugsSource.az, fallback.slugs.az),
      en: normalizeSlug(slugsSource.en, fallback.slugs.en),
      ru: normalizeSlug(slugsSource.ru, fallback.slugs.ru),
    },
    {
      az: sanitizeLocaleContent(contentSource.az, fallback.content.az),
      en: sanitizeLocaleContent(contentSource.en, fallback.content.en),
      ru: sanitizeLocaleContent(contentSource.ru, fallback.content.ru),
    }
  );
}

export function sanitizePackageSolutionsConfig(input: unknown): PackageSolutionsConfig {
  const source = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const rawDirectory = source.directory && typeof source.directory === "object" ? (source.directory as Record<string, unknown>) : {};
  const rawPackages = Array.isArray(source.packages) ? source.packages : defaultPackageSolutionsConfig.packages;
  const readDir = (locale: PackageLocale, field: keyof PackageDirectoryLocaleContent, fallback: string) =>
    normalizeText(
      rawDirectory[locale] && (rawDirectory[locale] as Record<string, unknown>)[field],
      fallback
    );

  const packages = rawPackages
    .map((item, index) => sanitizePackageRecord(item, getFallbackPackage(index), index))
    .sort((left, right) => left.order - right.order)
    .map((item, index) => ({ ...item, order: index + 1 }));

  return {
    directory: {
      az: {
        badge: readDir("az", "badge", defaultPackageSolutionsConfig.directory.az.badge),
        title: readDir("az", "title", defaultPackageSolutionsConfig.directory.az.title),
        description: readDir("az", "description", defaultPackageSolutionsConfig.directory.az.description),
      },
      en: {
        badge: readDir("en", "badge", defaultPackageSolutionsConfig.directory.en.badge),
        title: readDir("en", "title", defaultPackageSolutionsConfig.directory.en.title),
        description: readDir("en", "description", defaultPackageSolutionsConfig.directory.en.description),
      },
      ru: {
        badge: readDir("ru", "badge", defaultPackageSolutionsConfig.directory.ru.badge),
        title: readDir("ru", "title", defaultPackageSolutionsConfig.directory.ru.title),
        description: readDir("ru", "description", defaultPackageSolutionsConfig.directory.ru.description),
      },
    },
    packages,
  };
}

export function createInstagramDraftForPackage(locale: PackageLocale, pkg: PackageSolutionRecord) {
  const content = getLocalizedPackageContent(pkg, locale);
  return buildInstagramDraft(
    locale,
    content.cardTitle,
    content.cardDescription,
    content.includedModules,
    content.perfectFor,
    pkg.startingPrice,
    content.timelineLabel
  );
}

export function getLocalizedPackageContent(pkg: PackageSolutionRecord, locale: PackageLocale): PackageLocaleContent {
  const requested = pkg.content[locale];
  if (requested.cardTitle || requested.heroTitle || requested.heroDescription) return requested;

  for (const candidate of packageLocales) {
    const content = pkg.content[candidate];
    if (content.cardTitle || content.heroTitle || content.heroDescription) return content;
  }

  return requested;
}

export function getPackageAlternates(pkg: PackageSolutionRecord) {
  return {
    az: `/az/packages/${pkg.slugs.az}`,
    en: `/en/packages/${pkg.slugs.en}`,
    ru: `/ru/packages/${pkg.slugs.ru}`,
    "x-default": `/az/packages/${pkg.slugs.az}`,
  };
}
