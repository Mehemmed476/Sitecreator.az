export type LocaleKey = "az" | "en" | "ru";

export type LocalizedText = Record<LocaleKey, string>;

export type PriceCalculatorBenefit = {
  id: string;
  title: LocalizedText;
  text: LocalizedText;
};

export type PriceCalculatorCopy = {
  navLabel: LocalizedText;
  badge: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  serviceTitle: LocalizedText;
  serviceDescription: LocalizedText;
  detailsTitle: LocalizedText;
  detailsDescription: LocalizedText;
  extrasTitle: LocalizedText;
  extrasDescription: LocalizedText;
  formTitle: LocalizedText;
  formDescription: LocalizedText;
  summaryTitle: LocalizedText;
  summaryDescription: LocalizedText;
  included: LocalizedText;
  overage: LocalizedText;
  designImpact: LocalizedText;
  buildExtras: LocalizedText;
  seoExtras: LocalizedText;
  logoOption: LocalizedText;
  timeline: LocalizedText;
  total: LocalizedText;
  monthlySupport: LocalizedText;
  vatNote: LocalizedText;
  requestButton: LocalizedText;
  downloadButton: LocalizedText;
  leadBadge: LocalizedText;
  nameLabel: LocalizedText;
  emailLabel: LocalizedText;
  phoneLabel: LocalizedText;
  companyLabel: LocalizedText;
  messageLabel: LocalizedText;
  namePlaceholder: LocalizedText;
  emailPlaceholder: LocalizedText;
  phonePlaceholder: LocalizedText;
  companyPlaceholder: LocalizedText;
  messagePlaceholder: LocalizedText;
  submit: LocalizedText;
  success: LocalizedText;
  error: LocalizedText;
  leadMessageIntro: LocalizedText;
  steps: LocalizedText[];
  benefits: PriceCalculatorBenefit[];
};

export type CalculatorServiceId =
  | "website"
  | "ecommerce"
  | "mobile-app"
  | "custom-system";

export type CalculatorToggleGroupId = "build" | "seo";

export type CalculatorToggleItem = {
  id: string;
  label: LocalizedText;
  price: number;
};

export type CalculatorToggleGroup = {
  id: CalculatorToggleGroupId;
  title: LocalizedText;
  items: CalculatorToggleItem[];
};

export type CalculatorService = {
  id: CalculatorServiceId;
  name: LocalizedText;
  note: LocalizedText;
  baseLabel: LocalizedText;
  basePrice: number;
  unitLabel: LocalizedText;
  minUnits: number;
  maxUnits: number;
  defaultUnits: number;
  includedUnits: number;
  perUnitPrice: number;
};

export type CalculatorOption = {
  id: string;
  label: LocalizedText;
  helper: LocalizedText;
  multiplier?: number;
  price?: number;
  monthlyPrice?: number;
};

export type PriceCalculatorConfig = {
  copy: PriceCalculatorCopy;
  services: CalculatorService[];
  addOnGroups: CalculatorToggleGroup[];
  designOptions: CalculatorOption[];
  logoOptions: CalculatorOption[];
  timelineOptions: CalculatorOption[];
  supportOptions: CalculatorOption[];
};

function text(az: string, en: string, ru: string): LocalizedText {
  return { az, en, ru };
}

function num(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function str(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function normalizeLocalizedText(value: unknown, fallback: LocalizedText): LocalizedText {
  const source = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    az: str(source.az, fallback.az),
    en: str(source.en, fallback.en),
    ru: str(source.ru, fallback.ru),
  };
}

const defaultSteps = [
  text("Xidmət seçimi", "Service type", "Тип услуги"),
  text("Layihə detalları", "Project details", "Детали проекта"),
  text("Əlavələr", "Add-ons", "Дополнения"),
  text("Təklif al", "Get a quote", "Получить предложение"),
];

const defaultBenefits: PriceCalculatorBenefit[] = [
  {
    id: "transparent-pricing",
    title: text("Şəffaf qiymətləndirmə", "Transparent pricing", "Прозрачный расчёт"),
    text: text(
      "Hər funksiya və seçim yekun hesabda ayrıca görünür.",
      "Every selected feature appears separately in the estimate.",
      "Каждая функция отдельно отображается в итоговой оценке."
    ),
  },
  {
    id: "faster-decisions",
    title: text("Sürətli qərar", "Faster decisions", "Быстрое решение"),
    text: text(
      "Görüşdən əvvəl layihə çərçivəsini formalaşdırmaq daha asan olur.",
      "It becomes easier to shape the scope before the first meeting.",
      "Проще определить рамки проекта ещё до первого созвона."
    ),
  },
  {
    id: "better-brief",
    title: text("Daha dəqiq brief", "Stronger brief", "Более точный бриф"),
    text: text(
      "Komandamız istəklərinizi daha strukturlaşdırılmış şəkildə görür.",
      "Our team receives a much more structured request.",
      "Команда получает более структурированный запрос."
    ),
  },
  {
    id: "ongoing-support",
    title: text("Davamlı dəstək", "Ongoing support", "Долгосрочная поддержка"),
    text: text(
      "Aylıq texniki dəstək planını da eyni axında hesablaya bilərsiniz.",
      "You can include a monthly maintenance plan in the same flow.",
      "Пакет ежемесячной поддержки сразу включается в расчёт."
    ),
  },
];

export const defaultPriceCalculatorConfig: PriceCalculatorConfig = {
  copy: {
    navLabel: text("Qiymət kalkulyatoru", "Price calculator", "Калькулятор цен"),
    badge: text("Sitecreator pricing studio", "Sitecreator pricing studio", "Sitecreator pricing studio"),
    title: text(
      "Layihəniz üçün canlı qiymət simulyatoru",
      "A live project pricing simulator",
      "Живой симулятор стоимости проекта"
    ),
    description: text(
      "Xidmət növünü, funksionallıqları və təhvil tempini seçin. Bir neçə addımda həm büdcəni, həm də düzgün həlli görün.",
      "Choose the service type, features, and delivery rhythm. In a few steps, see both the budget and the right solution path.",
      "Выберите тип услуги, функциональность и темп сдачи. За несколько шагов увидите и бюджет, и подходящий формат решения."
    ),
    serviceTitle: text("Xidmət növü", "Service type", "Тип услуги"),
    serviceDescription: text(
      "Əsas həll formatını seçin. Son hesab bütün seçimlərinizə görə yenilənəcək.",
      "Select the core solution format. The estimate updates according to every choice you make.",
      "Выберите основной формат решения. Итоговая оценка будет обновляться по мере каждого выбора."
    ),
    detailsTitle: text("Layihə detalları", "Project details", "Детали проекта"),
    detailsDescription: text(
      "Səhifə və ya ekran sayını, eləcə də dizayn dərinliyini təyin edin.",
      "Set the page or screen count, then choose the level of design polish.",
      "Укажите количество страниц или экранов, а затем выберите уровень проработки дизайна."
    ),
    extrasTitle: text("Əlavələr və optimizasiya", "Add-ons and optimization", "Дополнения и оптимизация"),
    extrasDescription: text(
      "Layihəyə əlavə modullar, SEO işləri, logo, müddət və dəstək paketi daxil edin.",
      "Include extra modules, SEO work, logo design, timeline preference, and support.",
      "Добавьте дополнительные модули, SEO, логотип, сроки и пакет поддержки."
    ),
    formTitle: text("Fərdi təklif alın", "Request a tailored quote", "Получить персональное предложение"),
    formDescription: text(
      "Məlumatlarınızı göndərin, seçdiyiniz konfigurasiya ilə birlikdə sizə uyğun təklif hazırlayaq.",
      "Send your details and we will prepare a tailored recommendation based on your selected configuration.",
      "Оставьте контакты, и мы подготовим персональное предложение на основе выбранной конфигурации."
    ),
    summaryTitle: text("Qiymət xülasəsi", "Pricing summary", "Сводка по стоимости"),
    summaryDescription: text(
      "Büdcə hesabı real vaxtda yenilənir.",
      "The estimate refreshes in real time.",
      "Оценка обновляется в реальном времени."
    ),
    included: text("Daxil olan həcm", "Included scope", "Включённый объём"),
    overage: text("Əlavə həcm", "Additional scope", "Дополнительный объём"),
    designImpact: text("Dizayn təsiri", "Design impact", "Влияние дизайна"),
    buildExtras: text("Layihə əlavələri", "Project add-ons", "Дополнения проекта"),
    seoExtras: text("SEO əlavələri", "SEO extras", "SEO дополнения"),
    logoOption: text("Logo paketi", "Logo package", "Пакет логотипа"),
    timeline: text("Müddət əmsalı", "Timeline factor", "Коэффициент срока"),
    total: text("Təxmini cəmi", "Estimated total", "Примерная сумма"),
    monthlySupport: text("Aylıq dəstək", "Monthly support", "Ежемесячная поддержка"),
    vatNote: text("*Qiymətə ƏDV daxil deyil", "*VAT is not included", "*НДС не включён"),
    requestButton: text("Pulsuz konsultasiya al", "Get a free consultation", "Получить консультацию"),
    downloadButton: text("Xülasəni yüklə", "Download summary", "Скачать сводку"),
    leadBadge: text("Project lab", "Project lab", "Project lab"),
    nameLabel: text("Ad və soyad", "Full name", "Имя и фамилия"),
    emailLabel: text("E-poçt", "Email", "E-mail"),
    phoneLabel: text("Telefon", "Phone", "Телефон"),
    companyLabel: text("Şirkət", "Company", "Компания"),
    messageLabel: text("Qısa qeyd", "Short note", "Короткая заметка"),
    namePlaceholder: text("Adınızı daxil edin", "Enter your name", "Введите ваше имя"),
    emailPlaceholder: text("email@company.az", "email@company.com", "email@company.com"),
    phonePlaceholder: text("+994 50 000 00 00", "+994 50 000 00 00", "+994 50 000 00 00"),
    companyPlaceholder: text("Şirkət adı", "Company name", "Название компании"),
    messagePlaceholder: text(
      "Layihə haqqında əlavə qeydlər",
      "Extra notes about the project",
      "Дополнительные детали о проекте"
    ),
    submit: text("Müraciət et", "Submit request", "Отправить заявку"),
    success: text(
      "Sorğunuz göndərildi. Tezliklə sizinlə əlaqə saxlayacağıq.",
      "Your request has been sent. We will get back to you shortly.",
      "Запрос отправлен. Мы свяжемся с вами в ближайшее время."
    ),
    error: text(
      "Sorğunu göndərmək alınmadı. Zəhmət olmasa yenidən cəhd edin.",
      "We could not send your request. Please try again.",
      "Не удалось отправить запрос. Пожалуйста, попробуйте ещё раз."
    ),
    leadMessageIntro: text(
      "Qiymət kalkulyatoru müraciəti",
      "Price calculator submission",
      "Заявка из калькулятора цен"
    ),
    steps: defaultSteps,
    benefits: defaultBenefits,
  },
  services: [
    {
      id: "website",
      name: text("Veb sayt", "Website", "Веб-сайт"),
      note: text(
        "Korporativ saytlar, xidmət saytları və təqdimat səhifələri üçün.",
        "For corporate sites, service websites, and landing pages.",
        "Для корпоративных сайтов, сервисных сайтов и лендингов."
      ),
      baseLabel: text("₼ 400-dən", "from ₼ 400", "от ₼ 400"),
      basePrice: 400,
      unitLabel: text("Səhifə sayı", "Page count", "Количество страниц"),
      minUnits: 1,
      maxUnits: 50,
      defaultUnits: 5,
      includedUnits: 5,
      perUnitPrice: 40,
    },
    {
      id: "ecommerce",
      name: text("E-ticarət", "E-commerce", "E-commerce"),
      note: text(
        "Onlayn mağaza, kataloq və sifariş axını olan həllər üçün.",
        "For online stores, catalogues, and order-driven flows.",
        "Для интернет-магазинов, каталогов и заказных сценариев."
      ),
      baseLabel: text("₼ 1200-dən", "from ₼ 1200", "от ₼ 1200"),
      basePrice: 1200,
      unitLabel: text("Səhifə sayı", "Page count", "Количество страниц"),
      minUnits: 5,
      maxUnits: 60,
      defaultUnits: 10,
      includedUnits: 10,
      perUnitPrice: 65,
    },
    {
      id: "mobile-app",
      name: text("Mobil tətbiq", "Mobile app", "Мобильное приложение"),
      note: text(
        "iOS və Android üçün məhsul, rezervasiya və xidmət tətbiqləri.",
        "For iOS and Android product, booking, and service apps.",
        "Для iOS и Android приложений с заказами, бронированием и сервисами."
      ),
      baseLabel: text("₼ 3500-dən", "from ₼ 3500", "от ₼ 3500"),
      basePrice: 3500,
      unitLabel: text("Ekran sayı", "Screen count", "Количество экранов"),
      minUnits: 4,
      maxUnits: 40,
      defaultUnits: 8,
      includedUnits: 8,
      perUnitPrice: 140,
    },
    {
      id: "custom-system",
      name: text("Xüsusi sistem", "Custom system", "Индивидуальная система"),
      note: text(
        "CRM, rezervasiya, daxili panel və xüsusi iş axınları üçün.",
        "For CRM, booking, internal dashboard, and tailored workflows.",
        "Для CRM, бронирования, внутренних панелей и индивидуальных процессов."
      ),
      baseLabel: text("₼ 5000-dən", "from ₼ 5000", "от ₼ 5000"),
      basePrice: 5000,
      unitLabel: text("Modul sayı", "Module count", "Количество модулей"),
      minUnits: 3,
      maxUnits: 30,
      defaultUnits: 6,
      includedUnits: 6,
      perUnitPrice: 220,
    },
  ],
  addOnGroups: [
    {
      id: "build",
      title: text("Layihə əlavələri", "Build add-ons", "Дополнительные модули"),
      items: [
        { id: "contact-form", label: text("Əlaqə forması", "Contact form", "Форма связи"), price: 50 },
        { id: "advanced-forms", label: text("Qabaqcıl formalar", "Advanced forms", "Продвинутые формы"), price: 150 },
        { id: "portfolio-gallery", label: text("Qalereya / portfolio", "Gallery / portfolio", "Галерея / портфолио"), price: 100 },
        { id: "blog", label: text("Bloq sistemi", "Blog module", "Блог-модуль"), price: 150 },
        { id: "admin-panel", label: text("Admin panel", "Admin dashboard", "Админ-панель"), price: 200 },
        { id: "catalog", label: text("Məhsul kataloqu", "Product catalogue", "Каталог товаров"), price: 200 },
        { id: "reviews", label: text("Müştəri rəyləri", "Client reviews", "Отзывы клиентов"), price: 80 },
        { id: "faq", label: text("FAQ bölməsi", "FAQ section", "FAQ секция"), price: 60 },
        { id: "booking", label: text("Rezervasiya / sifariş", "Booking / order flow", "Бронирование / заказ"), price: 350 },
        { id: "whatsapp", label: text("WhatsApp inteqrasiyası", "WhatsApp integration", "Интеграция WhatsApp"), price: 100 },
        { id: "multilingual", label: text("Çoxdilli quruluş", "Multilingual setup", "Мультиязычность"), price: 300 },
        { id: "analytics", label: text("Google Analytics", "Google Analytics", "Google Analytics"), price: 100 },
        { id: "api", label: text("API inteqrasiyası", "API integration", "API интеграция"), price: 300 },
        { id: "animations", label: text("Animasiyalar / effektlər", "Animations / effects", "Анимации / эффекты"), price: 200 },
        { id: "performance", label: text("Sürət optimizasiyası", "Performance optimization", "Оптимизация скорости"), price: 200 },
      ],
    },
    {
      id: "seo",
      title: text("SEO əlavələri", "SEO extras", "SEO дополнения"),
      items: [
        { id: "seo-on-page", label: text("Səhifədaxili SEO", "On-page SEO", "On-page SEO"), price: 150 },
        { id: "seo-meta", label: text("Meta teqlər", "Meta tags", "Мета-теги"), price: 80 },
        { id: "seo-sitemap", label: text("XML sitemap", "XML sitemap", "XML sitemap"), price: 60 },
        { id: "seo-robots", label: text("Robots.txt", "Robots.txt", "Robots.txt"), price: 40 },
        { id: "seo-keywords", label: text("Açar söz araşdırması", "Keyword research", "Исследование ключевых слов"), price: 200 },
        { id: "seo-content", label: text("Məzmun optimizasiyası", "Content optimization", "Оптимизация контента"), price: 200 },
        { id: "seo-schema", label: text("Schema markup", "Schema markup", "Schema markup"), price: 150 },
        { id: "seo-local", label: text("Lokal SEO paketi", "Local SEO pack", "Локальный SEO пакет"), price: 300 },
        { id: "seo-audit", label: text("Texniki SEO auditi", "Technical SEO audit", "Технический SEO аудит"), price: 400 },
      ],
    },
  ],
  designOptions: [
    { id: "simple", label: text("Sadə", "Simple", "Базовый"), helper: text("×1", "×1", "×1"), multiplier: 1 },
    { id: "professional", label: text("Peşəkar", "Professional", "Профессиональный"), helper: text("×1.3", "×1.3", "×1.3"), multiplier: 1.3 },
    { id: "custom", label: text("Xüsusi", "Custom", "Индивидуальный"), helper: text("×1.6", "×1.6", "×1.6"), multiplier: 1.6 },
  ],
  logoOptions: [
    { id: "none", label: text("Lazım deyil", "No logo work", "Не требуется"), helper: text("Pulsuz", "Free", "Бесплатно"), price: 0 },
    { id: "starter", label: text("Əsas konsept", "Starter concept", "Базовый концепт"), helper: text("+₼ 80", "+₼ 80", "+₼ 80"), price: 80 },
    { id: "professional", label: text("Peşəkar paket", "Professional pack", "Профессиональный пакет"), helper: text("+₼ 200", "+₼ 200", "+₼ 200"), price: 200 },
    { id: "premium", label: text("Premium paket", "Premium pack", "Премиум пакет"), helper: text("+₼ 350", "+₼ 350", "+₼ 350"), price: 350 },
  ],
  timelineOptions: [
    { id: "urgent", label: text("Təcili", "Urgent", "Срочно"), helper: text("7 gün · ×1.5", "7 days · ×1.5", "7 дней · ×1.5"), multiplier: 1.5 },
    { id: "fast", label: text("Sürətli", "Fast", "Быстро"), helper: text("14 gün · ×1.25", "14 days · ×1.25", "14 дней · ×1.25"), multiplier: 1.25 },
    { id: "standard", label: text("Standart", "Standard", "Стандарт"), helper: text("30 gün · ×1", "30 days · ×1", "30 дней · ×1"), multiplier: 1 },
    { id: "relaxed", label: text("Rahat", "Relaxed", "Комфортно"), helper: text("45 gün · ×0.95", "45 days · ×0.95", "45 дней · ×0.95"), multiplier: 0.95 },
    { id: "budget", label: text("Büdcə", "Budget-first", "Бюджетно"), helper: text("60 gün · ×0.9", "60 days · ×0.9", "60 дней · ×0.9"), multiplier: 0.9 },
  ],
  supportOptions: [
    { id: "support-none", label: text("Dəstək yoxdur", "No support", "Без поддержки"), helper: text("Pulsuz", "Free", "Бесплатно"), monthlyPrice: 0 },
    { id: "support-basic", label: text("Əsas dəstək", "Basic support", "Базовая поддержка"), helper: text("₼ 50 / ay", "₼ 50 / mo", "₼ 50 / мес"), monthlyPrice: 50 },
    { id: "support-standard", label: text("Standart dəstək", "Standard support", "Стандартная поддержка"), helper: text("₼ 120 / ay", "₼ 120 / mo", "₼ 120 / мес"), monthlyPrice: 120 },
    { id: "support-pro", label: text("Peşəkar dəstək", "Pro support", "Профессиональная поддержка"), helper: text("₼ 250 / ay", "₼ 250 / mo", "₼ 250 / мес"), monthlyPrice: 250 },
    { id: "support-premium", label: text("Premium dəstək", "Premium support", "Премиум поддержка"), helper: text("₼ 400 / ay", "₼ 400 / mo", "₼ 400 / мес"), monthlyPrice: 400 },
  ],
};

function normalizeBenefit(value: unknown, fallback: PriceCalculatorBenefit): PriceCalculatorBenefit {
  const source = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    id: str(source.id, fallback.id),
    title: normalizeLocalizedText(source.title, fallback.title),
    text: normalizeLocalizedText(source.text, fallback.text),
  };
}

function normalizeToggleItem(value: unknown, fallback: CalculatorToggleItem): CalculatorToggleItem {
  const source = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    id: str(source.id, fallback.id),
    label: normalizeLocalizedText(source.label, fallback.label),
    price: num(source.price, fallback.price),
  };
}

function normalizeToggleGroup(value: unknown, fallback: CalculatorToggleGroup): CalculatorToggleGroup {
  const source = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const items = Array.isArray(source.items) ? source.items : fallback.items;
  return {
    id: fallback.id,
    title: normalizeLocalizedText(source.title, fallback.title),
    items: items.map((item, index) =>
      normalizeToggleItem(item, fallback.items[index] ?? fallback.items[fallback.items.length - 1])
    ),
  };
}

function normalizeService(value: unknown, fallback: CalculatorService): CalculatorService {
  const source = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    id: fallback.id,
    name: normalizeLocalizedText(source.name, fallback.name),
    note: normalizeLocalizedText(source.note, fallback.note),
    baseLabel: normalizeLocalizedText(source.baseLabel, fallback.baseLabel),
    basePrice: num(source.basePrice, fallback.basePrice),
    unitLabel: normalizeLocalizedText(source.unitLabel, fallback.unitLabel),
    minUnits: num(source.minUnits, fallback.minUnits),
    maxUnits: num(source.maxUnits, fallback.maxUnits),
    defaultUnits: num(source.defaultUnits, fallback.defaultUnits),
    includedUnits: num(source.includedUnits, fallback.includedUnits),
    perUnitPrice: num(source.perUnitPrice, fallback.perUnitPrice),
  };
}

function normalizeOption(value: unknown, fallback: CalculatorOption): CalculatorOption {
  const source = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    id: str(source.id, fallback.id),
    label: normalizeLocalizedText(source.label, fallback.label),
    helper: normalizeLocalizedText(source.helper, fallback.helper),
    multiplier:
      fallback.multiplier !== undefined ? num(source.multiplier, fallback.multiplier) : undefined,
    price: fallback.price !== undefined ? num(source.price, fallback.price) : undefined,
    monthlyPrice:
      fallback.monthlyPrice !== undefined
        ? num(source.monthlyPrice, fallback.monthlyPrice)
        : undefined,
  };
}

export function sanitizePriceCalculatorConfig(input: unknown): PriceCalculatorConfig {
  const source = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const copySource =
    source.copy && typeof source.copy === "object"
      ? (source.copy as Record<string, unknown>)
      : {};

  const steps = Array.isArray(copySource.steps) ? copySource.steps : defaultSteps;
  const benefits = Array.isArray(copySource.benefits) ? copySource.benefits : defaultBenefits;

  return {
    copy: {
      navLabel: normalizeLocalizedText(copySource.navLabel, defaultPriceCalculatorConfig.copy.navLabel),
      badge: normalizeLocalizedText(copySource.badge, defaultPriceCalculatorConfig.copy.badge),
      title: normalizeLocalizedText(copySource.title, defaultPriceCalculatorConfig.copy.title),
      description: normalizeLocalizedText(copySource.description, defaultPriceCalculatorConfig.copy.description),
      serviceTitle: normalizeLocalizedText(copySource.serviceTitle, defaultPriceCalculatorConfig.copy.serviceTitle),
      serviceDescription: normalizeLocalizedText(copySource.serviceDescription, defaultPriceCalculatorConfig.copy.serviceDescription),
      detailsTitle: normalizeLocalizedText(copySource.detailsTitle, defaultPriceCalculatorConfig.copy.detailsTitle),
      detailsDescription: normalizeLocalizedText(copySource.detailsDescription, defaultPriceCalculatorConfig.copy.detailsDescription),
      extrasTitle: normalizeLocalizedText(copySource.extrasTitle, defaultPriceCalculatorConfig.copy.extrasTitle),
      extrasDescription: normalizeLocalizedText(copySource.extrasDescription, defaultPriceCalculatorConfig.copy.extrasDescription),
      formTitle: normalizeLocalizedText(copySource.formTitle, defaultPriceCalculatorConfig.copy.formTitle),
      formDescription: normalizeLocalizedText(copySource.formDescription, defaultPriceCalculatorConfig.copy.formDescription),
      summaryTitle: normalizeLocalizedText(copySource.summaryTitle, defaultPriceCalculatorConfig.copy.summaryTitle),
      summaryDescription: normalizeLocalizedText(copySource.summaryDescription, defaultPriceCalculatorConfig.copy.summaryDescription),
      included: normalizeLocalizedText(copySource.included, defaultPriceCalculatorConfig.copy.included),
      overage: normalizeLocalizedText(copySource.overage, defaultPriceCalculatorConfig.copy.overage),
      designImpact: normalizeLocalizedText(copySource.designImpact, defaultPriceCalculatorConfig.copy.designImpact),
      buildExtras: normalizeLocalizedText(copySource.buildExtras, defaultPriceCalculatorConfig.copy.buildExtras),
      seoExtras: normalizeLocalizedText(copySource.seoExtras, defaultPriceCalculatorConfig.copy.seoExtras),
      logoOption: normalizeLocalizedText(copySource.logoOption, defaultPriceCalculatorConfig.copy.logoOption),
      timeline: normalizeLocalizedText(copySource.timeline, defaultPriceCalculatorConfig.copy.timeline),
      total: normalizeLocalizedText(copySource.total, defaultPriceCalculatorConfig.copy.total),
      monthlySupport: normalizeLocalizedText(copySource.monthlySupport, defaultPriceCalculatorConfig.copy.monthlySupport),
      vatNote: normalizeLocalizedText(copySource.vatNote, defaultPriceCalculatorConfig.copy.vatNote),
      requestButton: normalizeLocalizedText(copySource.requestButton, defaultPriceCalculatorConfig.copy.requestButton),
      downloadButton: normalizeLocalizedText(copySource.downloadButton, defaultPriceCalculatorConfig.copy.downloadButton),
      leadBadge: normalizeLocalizedText(copySource.leadBadge, defaultPriceCalculatorConfig.copy.leadBadge),
      nameLabel: normalizeLocalizedText(copySource.nameLabel, defaultPriceCalculatorConfig.copy.nameLabel),
      emailLabel: normalizeLocalizedText(copySource.emailLabel, defaultPriceCalculatorConfig.copy.emailLabel),
      phoneLabel: normalizeLocalizedText(copySource.phoneLabel, defaultPriceCalculatorConfig.copy.phoneLabel),
      companyLabel: normalizeLocalizedText(copySource.companyLabel, defaultPriceCalculatorConfig.copy.companyLabel),
      messageLabel: normalizeLocalizedText(copySource.messageLabel, defaultPriceCalculatorConfig.copy.messageLabel),
      namePlaceholder: normalizeLocalizedText(copySource.namePlaceholder, defaultPriceCalculatorConfig.copy.namePlaceholder),
      emailPlaceholder: normalizeLocalizedText(copySource.emailPlaceholder, defaultPriceCalculatorConfig.copy.emailPlaceholder),
      phonePlaceholder: normalizeLocalizedText(copySource.phonePlaceholder, defaultPriceCalculatorConfig.copy.phonePlaceholder),
      companyPlaceholder: normalizeLocalizedText(copySource.companyPlaceholder, defaultPriceCalculatorConfig.copy.companyPlaceholder),
      messagePlaceholder: normalizeLocalizedText(copySource.messagePlaceholder, defaultPriceCalculatorConfig.copy.messagePlaceholder),
      submit: normalizeLocalizedText(copySource.submit, defaultPriceCalculatorConfig.copy.submit),
      success: normalizeLocalizedText(copySource.success, defaultPriceCalculatorConfig.copy.success),
      error: normalizeLocalizedText(copySource.error, defaultPriceCalculatorConfig.copy.error),
      leadMessageIntro: normalizeLocalizedText(copySource.leadMessageIntro, defaultPriceCalculatorConfig.copy.leadMessageIntro),
      steps: steps.map((step, index) => normalizeLocalizedText(step, defaultSteps[index] ?? defaultSteps[defaultSteps.length - 1])),
      benefits: benefits.map((benefit, index) =>
        normalizeBenefit(benefit, defaultBenefits[index] ?? defaultBenefits[defaultBenefits.length - 1])
      ),
    },
    services: (Array.isArray(source.services) ? source.services : defaultPriceCalculatorConfig.services).map(
      (service, index) =>
        normalizeService(
          service,
          defaultPriceCalculatorConfig.services[index] ??
            defaultPriceCalculatorConfig.services[defaultPriceCalculatorConfig.services.length - 1]
        )
    ),
    addOnGroups: (Array.isArray(source.addOnGroups) ? source.addOnGroups : defaultPriceCalculatorConfig.addOnGroups).map(
      (group, index) =>
        normalizeToggleGroup(
          group,
          defaultPriceCalculatorConfig.addOnGroups[index] ??
            defaultPriceCalculatorConfig.addOnGroups[defaultPriceCalculatorConfig.addOnGroups.length - 1]
        )
    ),
    designOptions: (Array.isArray(source.designOptions) ? source.designOptions : defaultPriceCalculatorConfig.designOptions).map(
      (option, index) =>
        normalizeOption(
          option,
          defaultPriceCalculatorConfig.designOptions[index] ??
            defaultPriceCalculatorConfig.designOptions[defaultPriceCalculatorConfig.designOptions.length - 1]
        )
    ),
    logoOptions: (Array.isArray(source.logoOptions) ? source.logoOptions : defaultPriceCalculatorConfig.logoOptions).map(
      (option, index) =>
        normalizeOption(
          option,
          defaultPriceCalculatorConfig.logoOptions[index] ??
            defaultPriceCalculatorConfig.logoOptions[defaultPriceCalculatorConfig.logoOptions.length - 1]
        )
    ),
    timelineOptions: (Array.isArray(source.timelineOptions) ? source.timelineOptions : defaultPriceCalculatorConfig.timelineOptions).map(
      (option, index) =>
        normalizeOption(
          option,
          defaultPriceCalculatorConfig.timelineOptions[index] ??
            defaultPriceCalculatorConfig.timelineOptions[defaultPriceCalculatorConfig.timelineOptions.length - 1]
        )
    ),
    supportOptions: (Array.isArray(source.supportOptions) ? source.supportOptions : defaultPriceCalculatorConfig.supportOptions).map(
      (option, index) =>
        normalizeOption(
          option,
          defaultPriceCalculatorConfig.supportOptions[index] ??
            defaultPriceCalculatorConfig.supportOptions[defaultPriceCalculatorConfig.supportOptions.length - 1]
        )
    ),
  };
}

export function getLocalizedText(locale: LocaleKey, value: LocalizedText): string {
  return value[locale];
}

