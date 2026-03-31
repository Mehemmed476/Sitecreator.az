import { slugifyInsight } from "@/lib/insight-utils";

export const serviceLocales = ["az", "en", "ru"] as const;

export type ServiceLocale = (typeof serviceLocales)[number];

export type ServiceInfoItem = {
  title: string;
  description: string;
};

export type ServiceFaqItem = {
  question: string;
  answer: string;
};

export type ServicePageLocaleContent = {
  cardTitle: string;
  cardDescription: string;
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  primaryCta: string;
  secondaryCta: string;
  overviewTitle: string;
  overviewDescription: string;
  outcomesTitle: string;
  outcomes: ServiceInfoItem[];
  deliverablesTitle: string;
  deliverables: string[];
  processTitle: string;
  processSteps: ServiceInfoItem[];
  faqTitle: string;
  faqDescription: string;
  faqItems: ServiceFaqItem[];
  finalCtaTitle: string;
  finalCtaDescription: string;
  seoTitle: string;
  seoDescription: string;
};

export type ServicePageRecord = {
  id: string;
  order: number;
  slugs: Record<ServiceLocale, string>;
  content: Record<ServiceLocale, ServicePageLocaleContent>;
};

export type ServiceDirectoryLocaleContent = {
  badge: string;
  title: string;
  description: string;
};

export type ServicePagesConfig = {
  directory: Record<ServiceLocale, ServiceDirectoryLocaleContent>;
  services: ServicePageRecord[];
};

function cloneLocaleContent(content: ServicePageLocaleContent): ServicePageLocaleContent {
  return {
    ...content,
    outcomes: content.outcomes.map((item) => ({ ...item })),
    deliverables: [...content.deliverables],
    processSteps: content.processSteps.map((item) => ({ ...item })),
    faqItems: content.faqItems.map((item) => ({ ...item })),
  };
}

export function createEmptyServiceLocaleContent(): ServicePageLocaleContent {
  return {
    cardTitle: "",
    cardDescription: "",
    heroBadge: "",
    heroTitle: "",
    heroDescription: "",
    primaryCta: "",
    secondaryCta: "",
    overviewTitle: "",
    overviewDescription: "",
    outcomesTitle: "",
    outcomes: [
      { title: "", description: "" },
      { title: "", description: "" },
      { title: "", description: "" },
    ],
    deliverablesTitle: "",
    deliverables: ["", "", ""],
    processTitle: "",
    processSteps: [
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
    finalCtaTitle: "",
    finalCtaDescription: "",
    seoTitle: "",
    seoDescription: "",
  };
}

function createService(
  id: string,
  order: number,
  slugs: Record<ServiceLocale, string>,
  content: Record<ServiceLocale, ServicePageLocaleContent>
): ServicePageRecord {
  return {
    id,
    order,
    slugs: { ...slugs },
    content: {
      az: cloneLocaleContent(content.az),
      en: cloneLocaleContent(content.en),
      ru: cloneLocaleContent(content.ru),
    },
  };
}

export function createEmptyServiceRecord(id = "new-service", order = 1): ServicePageRecord {
  return createService(
    id,
    order,
    {
      az: `${id}-az`,
      en: `${id}-en`,
      ru: `${id}-ru`,
    },
    {
      az: createEmptyServiceLocaleContent(),
      en: createEmptyServiceLocaleContent(),
      ru: createEmptyServiceLocaleContent(),
    }
  );
}

function createDirectoryContent(
  content: Record<ServiceLocale, ServiceDirectoryLocaleContent>
): Record<ServiceLocale, ServiceDirectoryLocaleContent> {
  return {
    az: { ...content.az },
    en: { ...content.en },
    ru: { ...content.ru },
  };
}

const defaultServices: ServicePageRecord[] = [
  createService(
    "website-development",
    1,
    {
      az: "veb-sayt-hazirlanmasi",
      en: "website-development",
      ru: "razrabotka-saitov",
    },
    {
      az: {
        cardTitle: "Veb sayt hazırlanması",
        cardDescription: "Korporativ saytlar və təqdimat səhifələri üçün sürətli rəqəmsal həllər.",
        heroBadge: "Əsas xidmət",
        heroTitle: "Brendinizi gücləndirən müasir veb saytlar hazırlayırıq",
        heroDescription: "Sürətli, etibarlı və müraciət yönümlü saytlar qururuq ki biznesiniz internetdə daha güclü görünsün.",
        primaryCta: "Qiymət hesabla",
        secondaryCta: "Bizimlə danış",
        overviewTitle: "Bu xidmət kimlər üçündür?",
        overviewDescription: "Yeni sayt açmaq, köhnə saytını yeniləmək və ya daha peşəkar rəqəmsal təqdimat qurmaq istəyən bizneslər üçün uyğundur.",
        outcomesTitle: "Nəticədə nə qazanırsınız?",
        outcomes: [
          { title: "Güclü ilk təəssürat", description: "Müştəri sizi daha peşəkar və etibarlı görür." },
          { title: "Aydın müraciət axını", description: "Xidmətləriniz daha yaxşı başa düşülür və əlaqə addımları aydın olur." },
          { title: "Rahat idarə olunan sayt", description: "Struktur sonradan genişlənməyə və yenilənməyə uyğun olur." },
        ],
        deliverablesTitle: "Nələri təhvil veririk?",
        deliverables: [
          "Səhifə strukturu və UX axını",
          "Responsive dizayn və sürətli development",
          "Əlaqə blokları və əsas SEO bazası",
          "Gələcək yeniləmələr üçün çevik kontent quruluşu",
        ],
        processTitle: "İş prosesi",
        processSteps: [
          { title: "Brif və struktur", description: "Məqsəd, auditoriya və vacib səhifələr dəqiqləşdirilir." },
          { title: "Dizayn və development", description: "Vizual istiqamət təsdiqlənib əsas bloklar hazırlanır." },
          { title: "Test və yayım", description: "Sürət, responsive və form axınları yoxlanıb sayt yayımlanır." },
        ],
        faqTitle: "Tez-tez verilən suallar",
        faqDescription: "Veb sayt sifarişi ilə bağlı ən çox soruşulan mövzular.",
        faqItems: [
          { question: "Hazırlanma müddəti nə qədər olur?", answer: "Əksər layihələr 1-3 həftə aralığında tamamlanır." },
          { question: "Saytı sonradan böyütmək olar?", answer: "Bəli. Struktur gələcək funksiyalar üçün uyğun qurulur." },
        ],
        finalCtaTitle: "Layihəniz üçün doğru sayt formatını seçmək istəyirsiniz?",
        finalCtaDescription: "Qısa brif göndərin, sizə uyğun struktur və təxmini büdcəni birlikdə müəyyənləşdirək.",
        seoTitle: "Veb sayt hazırlanması və sayt yaradılması | Sitecreator",
        seoDescription: "Korporativ sayt, landing page və təqdimat səhifələri üçün müasir veb sayt hazırlanması xidməti.",
      },
      en: {
        cardTitle: "Website development",
        cardDescription: "Fast corporate websites and presentation pages built for trust and clarity.",
        heroBadge: "Core service",
        heroTitle: "We build modern websites that strengthen your brand",
        heroDescription: "We create fast, reliable websites that help your business look stronger online and convert visits into inquiries.",
        primaryCta: "Calculate price",
        secondaryCta: "Talk to us",
        overviewTitle: "Who is this for?",
        overviewDescription: "A strong fit for companies launching a new website, refreshing an old one, or improving their digital presentation.",
        outcomesTitle: "What do you gain?",
        outcomes: [
          { title: "A better first impression", description: "Visitors see a more trustworthy and professional business." },
          { title: "A clearer lead flow", description: "Your offer becomes easier to understand and inquiry points become more obvious." },
          { title: "A flexible site base", description: "The website is easier to expand and update later." },
        ],
        deliverablesTitle: "What is included?",
        deliverables: [
          "Site structure and UX flow",
          "Responsive UI and development",
          "Lead-focused contact blocks and SEO basics",
          "Flexible content sections for future growth",
        ],
        processTitle: "How we work",
        processSteps: [
          { title: "Brief and structure", description: "We define the goals, audience, and key pages." },
          { title: "Design and build", description: "The visual direction is approved and the main sections are built." },
          { title: "Testing and launch", description: "Speed, responsiveness, and key flows are checked before launch." },
        ],
        faqTitle: "Frequently asked questions",
        faqDescription: "Common questions before starting a website project.",
        faqItems: [
          { question: "How long does it take?", answer: "Most projects are delivered in about 1 to 3 weeks." },
          { question: "Can it be expanded later?", answer: "Yes. The structure is built for future updates and growth." },
        ],
        finalCtaTitle: "Need the right website structure for your business?",
        finalCtaDescription: "Send a short brief and we will help define the best format and budget direction.",
        seoTitle: "Website development in Baku and Azerbaijan | Sitecreator",
        seoDescription: "Corporate websites, landing pages, and presentation sites built for trust, speed, and conversions.",
      },
      ru: {
        cardTitle: "Разработка сайтов",
        cardDescription: "Корпоративные сайты и презентационные страницы для сильного цифрового образа.",
        heroBadge: "Основная услуга",
        heroTitle: "Создаём современные сайты, которые усиливают ваш бренд",
        heroDescription: "Мы разрабатываем быстрые и надёжные сайты, которые помогают бизнесу выглядеть сильнее и получать больше обращений.",
        primaryCta: "Рассчитать стоимость",
        secondaryCta: "Связаться с нами",
        overviewTitle: "Кому подходит услуга?",
        overviewDescription: "Подходит бизнесу, которому нужен новый сайт, обновление старого проекта или более сильная цифровая презентация.",
        outcomesTitle: "Что вы получаете?",
        outcomes: [
          { title: "Сильное первое впечатление", description: "Клиенты видят более профессиональный и убедительный образ компании." },
          { title: "Понятный путь к обращению", description: "Ваши услуги описаны яснее, а действия для связи заметнее." },
          { title: "Гибкую основу", description: "Сайт проще расширять и улучшать в будущем." },
        ],
        deliverablesTitle: "Что входит?",
        deliverables: [
          "Структура сайта и UX-логика",
          "Адаптивный интерфейс и разработка",
          "Контактные блоки и базовая SEO-подготовка",
          "Гибкие контентные секции для будущих обновлений",
        ],
        processTitle: "Процесс работы",
        processSteps: [
          { title: "Бриф и структура", description: "Определяем цели, аудиторию и ключевые страницы проекта." },
          { title: "Дизайн и разработка", description: "Утверждаем визуальное направление и собираем основные блоки сайта." },
          { title: "Тест и запуск", description: "Проверяем скорость, адаптивность и ключевые сценарии до публикации." },
        ],
        faqTitle: "Частые вопросы",
        faqDescription: "Коротко о главных вопросах перед стартом проекта.",
        faqItems: [
          { question: "Сколько длится разработка?", answer: "Большинство проектов занимает от 1 до 3 недель." },
          { question: "Можно ли развивать сайт позже?", answer: "Да. Мы закладываем удобную основу для будущего роста." },
        ],
        finalCtaTitle: "Хотите подобрать правильный формат сайта для бизнеса?",
        finalCtaDescription: "Отправьте короткий бриф, и мы подскажем подходящую структуру и бюджетный диапазон.",
        seoTitle: "Разработка сайтов в Баку и Азербайджане | Sitecreator",
        seoDescription: "Корпоративные сайты, landing page и презентационные проекты с упором на доверие, скорость и заявки.",
      },
    }
  ),
  createService(
    "ecommerce-development",
    2,
    {
      az: "e-ticaret-sayti-yaradilmasi",
      en: "ecommerce-development",
      ru: "sozdanie-internet-magazina",
    },
    {
      az: {
        cardTitle: "E-ticarət saytları",
        cardDescription: "Kataloq, sifariş və satış axını olan onlayn mağaza həlləri.",
        heroBadge: "Satış yönümlü",
        heroTitle: "Onlayn satış üçün işləyən e-ticarət sistemi qururuq",
        heroDescription: "Məhsul kataloqundan checkout axınına qədər satış prosesini rahat və idarəolunan edən mağaza sistemləri qururuq.",
        primaryCta: "Qiymət hesabla",
        secondaryCta: "Layihəni müzakirə et",
        overviewTitle: "Bu xidmət nəyi həll edir?",
        overviewDescription: "Sosial mediadan gələn sifarişləri sistemləşdirmək, məhsul kataloqunu peşəkar göstərmək və satış prosesini rahatlaşdırmaq üçün uyğundur.",
        outcomesTitle: "Biznes nəticələri",
        outcomes: [
          { title: "Sifarişlərin mərkəzləşməsi", description: "Məhsullar və sifarişlər bir sistemdə idarə olunur." },
          { title: "Rahat alış təcrübəsi", description: "Müştəri məhsulu tapıb checkout-a daha rahat keçir." },
          { title: "Satış üçün güclü vitrin", description: "Məhsullarınız daha cəlbedici və etibarlı görünür." },
        ],
        deliverablesTitle: "Daxil olan hissələr",
        deliverables: [
          "Məhsul kataloqu və kateqoriya strukturu",
          "Məhsul detail, səbət və checkout axını",
          "Əsas SEO və sürət optimizasiyası",
          "Kampaniya və məzmun üçün çevik bloklar",
        ],
        processTitle: "Layihə mərhələləri",
        processSteps: [
          { title: "Kataloq planı", description: "Məhsul tipi, kateqoriya və satış axını planlaşdırılır." },
          { title: "Mağaza interfeysi", description: "Səbət və alış yolu itkisiz işləsin deyə ekranlar hazırlanır." },
          { title: "Test və launch", description: "Sifariş addımları yoxlanıb sistem yayımlanır." },
        ],
        faqTitle: "E-ticarət FAQ",
        faqDescription: "Onlayn mağaza qurulanda ən çox soruşulan mövzular.",
        faqItems: [
          { question: "Məhsulları sonradan özümüz əlavə edə bilərik?", answer: "Bəli. Kataloq sonradan da rahat genişləndirilə bilər." },
          { question: "Checkout fərdiləşdirilə bilər?", answer: "Bəli. Layihənin scope-na görə alış axını uyğunlaşdırıla bilər." },
        ],
        finalCtaTitle: "Onlayn mağazanızı daha sistemli qurmaq istəyirsiniz?",
        finalCtaDescription: "Məhsul və sifariş axınınızı paylaşın, sizə uyğun e-ticarət strukturunu təklif edək.",
        seoTitle: "E-ticarət saytı yaradılması | Sitecreator",
        seoDescription: "Onlayn mağaza, məhsul kataloqu və checkout axını ilə satış yönümlü e-ticarət saytlarının hazırlanması xidməti.",
      },
      en: {
        cardTitle: "E-commerce websites",
        cardDescription: "Online stores with product catalogues, ordering flows, and sales-focused structure.",
        heroBadge: "Sales-focused",
        heroTitle: "We build e-commerce systems designed to support sales",
        heroDescription: "From product discovery to checkout, we create store experiences that are easier for customers and cleaner for your team to manage.",
        primaryCta: "Calculate price",
        secondaryCta: "Discuss the project",
        overviewTitle: "What does this solve?",
        overviewDescription: "Ideal for businesses that want to centralize orders, present products better, and make the online buying journey smoother.",
        outcomesTitle: "Business outcomes",
        outcomes: [
          { title: "Centralized order flow", description: "Products and orders are managed inside one clearer system." },
          { title: "A smoother buying experience", description: "Customers move toward checkout with less friction." },
          { title: "A stronger digital storefront", description: "The store feels more organized, trustworthy, and sales-ready." },
        ],
        deliverablesTitle: "Included in the build",
        deliverables: [
          "Product catalogue and category structure",
          "Product detail, cart, and checkout flow",
          "Performance and SEO basics",
          "Flexible content blocks for promotions and updates",
        ],
        processTitle: "Project stages",
        processSteps: [
          { title: "Catalogue planning", description: "We define categories, product logic, and the shopping journey." },
          { title: "Storefront design", description: "Key commerce screens are designed for clarity and conversions." },
          { title: "Testing and launch", description: "Ordering paths are checked before go-live." },
        ],
        faqTitle: "E-commerce FAQ",
        faqDescription: "Common questions before building an online store.",
        faqItems: [
          { question: "Can we add products ourselves later?", answer: "Yes. The catalogue structure is built to grow over time." },
          { question: "Can checkout be customized?", answer: "Yes. The purchase flow can be tailored to the business model." },
        ],
        finalCtaTitle: "Planning an online store that actually feels manageable?",
        finalCtaDescription: "Share your product range and order flow, and we will define the right e-commerce setup for you.",
        seoTitle: "E-commerce website development | Sitecreator",
        seoDescription: "Online stores, product catalogues, and checkout systems built for businesses that want a stronger digital sales channel.",
      },
      ru: {
        cardTitle: "Интернет-магазины",
        cardDescription: "Онлайн-магазины с каталогом, корзиной и удобным сценарием покупки.",
        heroBadge: "Для продаж",
        heroTitle: "Разрабатываем e-commerce систему, которая помогает продавать",
        heroDescription: "Мы создаём интернет-магазины, где путь от выбора товара до оформления заказа понятен клиенту и удобен вашей команде.",
        primaryCta: "Рассчитать стоимость",
        secondaryCta: "Обсудить проект",
        overviewTitle: "Что решает эта услуга?",
        overviewDescription: "Подходит бизнесу, который хочет систематизировать онлайн-заказы, лучше показать ассортимент и упростить путь к покупке.",
        outcomesTitle: "Результат для бизнеса",
        outcomes: [
          { title: "Единая система заказов", description: "Товары и заказы собираются в одном понятном процессе." },
          { title: "Более комфортная покупка", description: "Клиент быстрее находит товар и легче проходит к оформлению." },
          { title: "Сильная цифровая витрина", description: "Каталог выглядит аккуратно и убедительно." },
        ],
        deliverablesTitle: "Что входит в проект",
        deliverables: [
          "Каталог товаров и структура категорий",
          "Карточка товара, корзина и checkout",
          "Базовая SEO- и speed-оптимизация",
          "Гибкие блоки для акций и контента",
        ],
        processTitle: "Этапы работы",
        processSteps: [
          { title: "Планирование каталога", description: "Определяем типы товаров, категории и логику покупки." },
          { title: "Интерфейс магазина", description: "Проектируем витрину и ключевые шаги покупки." },
          { title: "Проверка и запуск", description: "Тестируем путь заказа и публикуем систему." },
        ],
        faqTitle: "FAQ по интернет-магазину",
        faqDescription: "Частые вопросы перед стартом e-commerce проекта.",
        faqItems: [
          { question: "Сможем ли мы добавлять товары позже сами?", answer: "Да. Каталог строится так, чтобы его было удобно расширять." },
          { question: "Можно ли настроить checkout?", answer: "Да. Сценарий покупки можно адаптировать под бизнес-модель." },
        ],
        finalCtaTitle: "Нужен интернет-магазин с понятной логикой продаж?",
        finalCtaDescription: "Расскажите о товарах и процессе заказа, и мы предложим подходящую структуру магазина.",
        seoTitle: "Создание интернет-магазина в Баку | Sitecreator",
        seoDescription: "Разработка интернет-магазинов, каталогов и удобного checkout для системных онлайн-продаж.",
      },
    }
  ),
  createService(
    "seo-services",
    3,
    {
      az: "seo-xidmeti",
      en: "seo-services",
      ru: "seo-uslugi",
    },
    {
      az: {
        cardTitle: "SEO xidməti",
        cardDescription: "Google görünürlüğünü artırmaq üçün texniki və kontent yönümlü optimizasiya.",
        heroBadge: "Axtarış görünürlüğü",
        heroTitle: "Saytınızı axtarışdan gələn real müraciətlər üçün hazırlayırıq",
        heroDescription: "Texniki baza, səhifə strukturu və doğru kontent istiqaməti ilə axtarışdan gələn keyfiyyətli trafiki artırırıq.",
        primaryCta: "Layihəni qiymətləndir",
        secondaryCta: "SEO haqqında danışaq",
        overviewTitle: "SEO xidməti nə üçündür?",
        overviewDescription: "Biznesinizlə bağlı axtarış edən istifadəçilərin sizi tapmasını və daha yüksək intent-lə əlaqəyə keçməsini hədəfləyir.",
        outcomesTitle: "Əldə etdiyiniz nəticələr",
        outcomes: [
          { title: "Daha güclü görünürlük", description: "Xidmətlərinizə uyğun açar sözlər üzrə daha sağlam səhifə strukturu yaranır." },
          { title: "Məqsədli trafik artımı", description: "Sizə uyğun auditoriya saytı daha rahat tapır." },
          { title: "Uzunmüddətli kontent bazası", description: "Service page və blog məzmunu üçün düzgün təməl qurulur." },
        ],
        deliverablesTitle: "Nələri edirik?",
        deliverables: [
          "Texniki audit və səhifə struktur baxışı",
          "Metadata, heading və kontent optimizasiyası",
          "Service page və blog planı",
          "Lokal bazara uyğun açar söz istiqaməti",
        ],
        processTitle: "SEO iş axını",
        processSteps: [
          { title: "Audit və prioritetlər", description: "Ən böyük təsir yaradacaq problemləri müəyyənləşdiririk." },
          { title: "On-page optimizasiya", description: "Səhifə məzmunu və strukturu doğru niyyətə uyğun yenilənir." },
          { title: "Kontent genişlənməsi", description: "Gələcək trafik üçün service page və blog istiqaməti qurulur." },
        ],
        faqTitle: "SEO FAQ",
        faqDescription: "Axtarış optimizasiyası ilə bağlı ən çox verilən suallar.",
        faqItems: [
          { question: "SEO nəticəsi nə vaxt görünür?", answer: "Texniki düzəlişlər daha tez hiss olunsa da, stabil nəticələr adətən bir neçə ayda formalaşır." },
          { question: "SEO üçün mütləq yeni sayt lazımdır?", answer: "Xeyr. Mövcud sayt üzərində də ciddi optimizasiya aparmaq olur." },
        ],
        finalCtaTitle: "Google-da daha görünən olmaq istəyirsiniz?",
        finalCtaDescription: "Mövcud saytınızı və bazar niyyətini birlikdə yoxlayaq, sizə uyğun SEO prioritetlərini çıxaraq.",
        seoTitle: "SEO xidməti və axtarış optimizasiyası | Sitecreator",
        seoDescription: "Texniki SEO, on-page optimizasiya və kontent strategiyası ilə Google görünürlüğünü artıran SEO xidməti.",
      },
      en: {
        cardTitle: "SEO services",
        cardDescription: "Technical and content-focused optimization that improves search visibility.",
        heroBadge: "Search visibility",
        heroTitle: "We prepare your site to attract qualified search traffic",
        heroDescription: "We strengthen the technical base, page structure, and content direction so search can bring higher-intent visitors.",
        primaryCta: "Estimate the project",
        secondaryCta: "Talk SEO with us",
        overviewTitle: "Why invest in SEO?",
        overviewDescription: "The goal is simple: when people search for services like yours, they find clearer pages and stronger reasons to contact you.",
        outcomesTitle: "What improves?",
        outcomes: [
          { title: "Stronger search visibility", description: "Your core services gain a clearer structure for relevant keywords." },
          { title: "More qualified traffic", description: "You attract people actually looking for your offer." },
          { title: "A long-term content base", description: "The site becomes easier to expand with service pages and blog content." },
        ],
        deliverablesTitle: "What we work on",
        deliverables: [
          "Technical SEO audit and structure review",
          "Metadata, headings, and content optimization",
          "Service page and blog content planning",
          "Keyword direction aligned with the local market",
        ],
        processTitle: "SEO workflow",
        processSteps: [
          { title: "Audit and priorities", description: "We identify the issues with the biggest business impact." },
          { title: "On-page optimization", description: "Key pages are aligned with the right search intent." },
          { title: "Content expansion", description: "We create a roadmap for future service pages and blog growth." },
        ],
        faqTitle: "SEO FAQ",
        faqDescription: "Common SEO questions before getting started.",
        faqItems: [
          { question: "How quickly can SEO show results?", answer: "Technical improvements can help earlier, but stable growth usually builds over several months." },
          { question: "Do we need a brand-new site for SEO?", answer: "Not always. Many sites can improve significantly through audit and optimization." },
        ],
        finalCtaTitle: "Want to become easier to find on Google?",
        finalCtaDescription: "We can review your current site and search opportunity areas before you invest in the next SEO step.",
        seoTitle: "SEO services in Azerbaijan | Sitecreator",
        seoDescription: "Technical SEO, on-page improvements, and content strategy built to grow qualified search visibility.",
      },
      ru: {
        cardTitle: "SEO услуги",
        cardDescription: "Техническая и контентная оптимизация для роста видимости в поиске.",
        heroBadge: "Поисковая видимость",
        heroTitle: "Готовим сайт к получению качественного трафика из поиска",
        heroDescription: "Мы усиливаем техническую базу, структуру страниц и контентное направление, чтобы поиск приводил более ценные обращения.",
        primaryCta: "Оценить проект",
        secondaryCta: "Обсудить SEO",
        overviewTitle: "Зачем нужна SEO-работа?",
        overviewDescription: "Когда потенциальные клиенты ищут ваши услуги, сайт должен быть понятным для поисковика и убедительным для человека.",
        outcomesTitle: "Что улучшается?",
        outcomes: [
          { title: "Более сильная видимость", description: "Страницы услуг становятся лучше подготовлены под релевантные запросы." },
          { title: "Более целевой трафик", description: "На сайт приходят пользователи, которым действительно интересны ваши услуги." },
          { title: "Основа для роста контента", description: "Появляется фундамент для service pages и блога." },
        ],
        deliverablesTitle: "Что входит в работу",
        deliverables: [
          "Технический аудит и анализ структуры",
          "Оптимизация title, description, heading и контента",
          "План по service pages и SEO-контенту",
          "Локальная логика ключевых запросов",
        ],
        processTitle: "Как идёт работа",
        processSteps: [
          { title: "Аудит и приоритеты", description: "Определяем точки, которые быстрее всего повлияют на результат." },
          { title: "On-page оптимизация", description: "Обновляем страницы под правильное поисковое намерение." },
          { title: "Контентное расширение", description: "Формируем основу для service pages и статей." },
        ],
        faqTitle: "FAQ по SEO",
        faqDescription: "Частые вопросы о поисковой оптимизации.",
        faqItems: [
          { question: "Когда SEO начинает давать результат?", answer: "Стабильный эффект обычно требует нескольких месяцев." },
          { question: "Нужен ли новый сайт для SEO?", answer: "Не всегда. Во многих случаях можно улучшить текущий сайт без полной переработки." },
        ],
        finalCtaTitle: "Хотите чаще появляться в Google по своим услугам?",
        finalCtaDescription: "Проверим текущий сайт и приоритеты, чтобы понять, с чего начать SEO-рост.",
        seoTitle: "SEO услуги в Баку и Азербайджане | Sitecreator",
        seoDescription: "Техническое SEO, оптимизация страниц и контентная стратегия для роста целевого органического трафика.",
      },
    }
  ),
  createService(
    "mobile-app-development",
    4,
    {
      az: "mobil-tetbiq-hazirlanmasi",
      en: "mobile-app-development",
      ru: "razrabotka-mobilnyh-prilozheniy",
    },
    {
      az: {
        cardTitle: "Mobil tətbiqlər",
        cardDescription: "Rezervasiya, xidmət və məhsul yönümlü iOS/Android tətbiq layihələri.",
        heroBadge: "Mobil məhsul",
        heroTitle: "İstifadəçini gündəlik axında saxlayan mobil tətbiqlər hazırlayırıq",
        heroDescription: "Real istifadə ssenarilərinə uyğun tətbiq məntiqi qururuq ki məhsul həm rahat istifadə olunsun, həm də biznes prosesinizə xidmət etsin.",
        primaryCta: "Layihəni qiymətləndir",
        secondaryCta: "Tələbi paylaş",
        overviewTitle: "Mobil tətbiq nə zaman uyğundur?",
        overviewDescription: "Rezervasiya, sifariş və daimi istifadə tələb edən məhsullar üçün mobil tətbiq istifadəçi bağlılığını ciddi şəkildə artırır.",
        outcomesTitle: "Əsas üstünlüklər",
        outcomes: [
          { title: "Daha yaxın istifadəçi təması", description: "Məhsul gündəlik axına daxil olur və təkrar istifadəyə uyğunlaşır." },
          { title: "Daha rahat proseslər", description: "Sifariş və xidmət addımları mobil mühitdə daha sürətli işləyir." },
          { title: "Genişlənə bilən məhsul bazası", description: "Tətbiq sonradan yeni funksiyalarla böyüdülə bilər." },
        ],
        deliverablesTitle: "Layihəyə daxil olur",
        deliverables: [
          "Əsas ekran strukturu və user flow",
          "iOS/Android üçün UI istiqaməti",
          "Status ekranları və vacib ssenarilər",
          "Backend və ya panel inteqrasiyası üçün baza düşüncəsi",
        ],
        processTitle: "Hazırlanma mərhələləri",
        processSteps: [
          { title: "Məhsul scopingi", description: "İlk release üçün vacib istifadəçi axınları seçilir." },
          { title: "UI və tətbiq məntiqi", description: "Əsas ekranlar və gündəlik istifadə ssenariləri hazırlanır." },
          { title: "Test və iterasiya", description: "İstifadə axını yoxlanıb daha dayanıqlı hala gətirilir." },
        ],
        faqTitle: "Mobil tətbiq FAQ",
        faqDescription: "Mobil məhsul qurularkən tez-tez verilən suallar.",
        faqItems: [
          { question: "Əvvəlcə MVP ilə başlamaq mümkündür?", answer: "Bəli. Ən vacib axınlarla kiçik release planlamaq daha sağlamdır." },
          { question: "Admin panel ayrıca lazımdır?", answer: "Bir çox mobil məhsul üçün panel və məlumat axını ayrıca nəzərə alınır." },
        ],
        finalCtaTitle: "Mobil məhsul fikriniz var?",
        finalCtaDescription: "İlk release üçün hansı funksiyaların vacib olduğunu birlikdə ayıraq və real scope ilə başlayaq.",
        seoTitle: "Mobil tətbiq hazırlanması | Sitecreator",
        seoDescription: "iOS və Android üçün xidmət, rezervasiya və məhsul yönümlü mobil tətbiq layihələrinin hazırlanması.",
      },
      en: {
        cardTitle: "Mobile apps",
        cardDescription: "iOS and Android products for bookings, services, and repeat-use customer flows.",
        heroBadge: "Mobile product",
        heroTitle: "We build mobile apps designed for real usage",
        heroDescription: "The app is shaped around actual user flows so it supports both usability and business operations.",
        primaryCta: "Estimate the project",
        secondaryCta: "Share your idea",
        overviewTitle: "When is a mobile app the right fit?",
        overviewDescription: "If your business depends on bookings, orders, or recurring user actions, a mobile app can create a much stronger experience.",
        outcomesTitle: "Core advantages",
        outcomes: [
          { title: "Closer user engagement", description: "Your product becomes part of a user's daily flow." },
          { title: "Faster mobile-friendly processes", description: "Ordering and service tasks become easier on the go." },
          { title: "A scalable product base", description: "The app can grow with new features over time." },
        ],
        deliverablesTitle: "What is included",
        deliverables: [
          "Core user flow and screen structure",
          "iOS/Android UI direction",
          "Key states and interaction patterns",
          "Backend or admin-panel planning",
        ],
        processTitle: "Delivery stages",
        processSteps: [
          { title: "Product scoping", description: "We define the core release scope and key user actions." },
          { title: "UX and app logic", description: "Important screens and flows are designed for real use." },
          { title: "Testing and iteration", description: "The product is refined before release." },
        ],
        faqTitle: "Mobile app FAQ",
        faqDescription: "Common questions before building a mobile product.",
        faqItems: [
          { question: "Can we start with an MVP?", answer: "Yes. Starting with the most important flows is usually the healthiest path." },
          { question: "Do we also need a backend or admin panel?", answer: "Often yes, especially if the app manages content, users, or operations." },
        ],
        finalCtaTitle: "Thinking about launching a mobile product?",
        finalCtaDescription: "We can help define the first release scope around the features users need most.",
        seoTitle: "Mobile app development | Sitecreator",
        seoDescription: "Mobile product planning and development for booking, service, and recurring-use experiences.",
      },
      ru: {
        cardTitle: "Мобильные приложения",
        cardDescription: "iOS и Android решения для бронирования, сервиса и повторного использования.",
        heroBadge: "Мобильный продукт",
        heroTitle: "Разрабатываем мобильные приложения, которыми действительно удобно пользоваться",
        heroDescription: "Мы проектируем продуктовую логику, которая поддерживает реальные действия пользователя и бизнес-процессы.",
        primaryCta: "Оценить проект",
        secondaryCta: "Поделиться идеей",
        overviewTitle: "Когда приложение действительно нужно?",
        overviewDescription: "Если бизнес завязан на бронировании, заказах или повторных действиях пользователя, мобильное приложение может дать более сильный опыт.",
        outcomesTitle: "Ключевые преимущества",
        outcomes: [
          { title: "Более тесный контакт с пользователем", description: "Продукт становится частью ежедневного сценария." },
          { title: "Удобные мобильные процессы", description: "Заказ и сервисные действия выполняются быстрее с телефона." },
          { title: "Основа для масштабирования", description: "Приложение можно расширять новыми функциями и ролями." },
        ],
        deliverablesTitle: "Что входит",
        deliverables: [
          "Структура экранов и основного user flow",
          "UI направление для iOS/Android",
          "Ключевые состояния и сценарии",
          "Базовое планирование backend или admin-панели",
        ],
        processTitle: "Этапы работы",
        processSteps: [
          { title: "Определение scope", description: "Выделяем самые важные функции и состав первого релиза." },
          { title: "UX и логика приложения", description: "Собираем важные экраны вокруг реальных задач пользователя." },
          { title: "Тест и итерация", description: "Проверяем удобство и стабильность до публикации." },
        ],
        faqTitle: "FAQ по мобильному приложению",
        faqDescription: "Частые вопросы перед запуском мобильного продукта.",
        faqItems: [
          { question: "Можно ли начать с MVP?", answer: "Да. Запуск с ключевыми сценариями обычно даёт более контролируемый старт." },
          { question: "Нужен ли backend или admin panel?", answer: "Во многих случаях да, если приложению нужен контент или управление процессами." },
        ],
        finalCtaTitle: "Есть идея мобильного продукта?",
        finalCtaDescription: "Поможем определить scope первого релиза и собрать продукт вокруг самых важных функций.",
        seoTitle: "Разработка мобильных приложений | Sitecreator",
        seoDescription: "Планирование и разработка мобильных приложений для бронирования, сервисов и регулярного взаимодействия.",
      },
    }
  ),
  createService(
    "custom-systems",
    5,
    {
      az: "xususi-sistemlerin-qurulmasi",
      en: "custom-systems-development",
      ru: "razrabotka-individualnyh-sistem",
    },
    {
      az: {
        cardTitle: "Xüsusi sistemlər",
        cardDescription: "CRM, daxili panel və əməliyyat axınlarını sistemləşdirən həllər.",
        heroBadge: "Fərdi həll",
        heroTitle: "Komandanızın iş axınına uyğun xüsusi sistemlər qururuq",
        heroDescription: "Standart saytların həll etmədiyi proseslər üçün CRM, rezervasiya, daxili panel və əməliyyat axınlarını birləşdirən fərdi sistemlər hazırlayırıq.",
        primaryCta: "Tələbi paylaş",
        secondaryCta: "Qiymət istiqaməti al",
        overviewTitle: "Bu xidmət nə üçün lazımdır?",
        overviewDescription: "Əgər satış və ya əməliyyat axınınız Excel və mesajlaşma ilə idarə olunur, xüsusi sistem prosesi daha görünən və ölçülə bilən hala gətirir.",
        outcomesTitle: "Əldə etdiyiniz faydalar",
        outcomes: [
          { title: "Daha aydın əməliyyat nəzarəti", description: "Komanda prosesləri bir axın içində idarə edir." },
          { title: "Vaxt itkisini azaltmaq", description: "Təkrarlanan əl işləri və məlumat dağınıqlığı xeyli azalır." },
          { title: "Biznesə uyğun sistem", description: "Hazır şablona yox, sizin iş prinsipinizə uyğun həll qurulur." },
        ],
        deliverablesTitle: "Sistem daxilində ola bilər",
        deliverables: [
          "Daxili admin panel və rol əsaslı səhifələr",
          "Məlumat axını, status və task logikası",
          "CRM, rezervasiya və ya sifariş modulları",
          "Genişlənə bilən modul strukturu",
        ],
        processTitle: "Necə işləyirik?",
        processSteps: [
          { title: "Proses xəritəsi", description: "Mövcud əməliyyat axınını və əsas ağrı nöqtələrini çıxarırıq." },
          { title: "Sistem planı", description: "Modullar, rollar və əsas ekranlar business məntiqinə görə qurulur." },
          { title: "Mərhələli implementasiya", description: "Ən çox dəyər verən hissələrdən başlayıb sistemi mərhələlərlə qururuq." },
        ],
        faqTitle: "Xüsusi sistem FAQ",
        faqDescription: "Fərdi sistem sifarişi ilə bağlı əsas suallar.",
        faqItems: [
          { question: "Bunu mərhələli hazırlamaq olar?", answer: "Bəli. Ən vacib modullarla başlayıb sistemi sonradan böyütmək daha məntiqlidir." },
          { question: "Mövcud prosesimizə inteqrasiya mümkündür?", answer: "Çox vaxt bəli. Həll hazırkı iş axınınıza uyğun qurulur." },
        ],
        finalCtaTitle: "Komandanız üçün daha sistemli daxili həll istəyirsiniz?",
        finalCtaDescription: "Mövcud iş axınınızı paylaşın, ən çox vaxt itirən hissələri birlikdə sistemləşdirək.",
        seoTitle: "Xüsusi sistemlərin qurulması və CRM həlləri | Sitecreator",
        seoDescription: "CRM, daxili panel, rezervasiya və əməliyyat axınlarını sistemləşdirən fərdi proqram həlləri.",
      },
      en: {
        cardTitle: "Custom systems",
        cardDescription: "CRM, internal dashboards, and workflow systems tailored to your operations.",
        heroBadge: "Custom solution",
        heroTitle: "We build systems around the way your team actually works",
        heroDescription: "For processes that a standard website cannot solve, we create internal dashboards, booking logic, CRM-style systems, and operational tools shaped around your workflow.",
        primaryCta: "Share requirements",
        secondaryCta: "Get a budget direction",
        overviewTitle: "Why choose a custom system?",
        overviewDescription: "If your sales or operational flow lives across spreadsheets, chat messages, and manual updates, a custom system can make the process structured and measurable.",
        outcomesTitle: "What improves?",
        outcomes: [
          { title: "Clearer operational control", description: "Teams manage the process through a single flow instead of scattered tools." },
          { title: "Less manual friction", description: "Repeated tasks and fragmented information are reduced." },
          { title: "A system shaped to your business", description: "The product adapts to your operation instead of forcing a generic template." },
        ],
        deliverablesTitle: "Possible components",
        deliverables: [
          "Internal dashboard and role-based pages",
          "Status, task, and data-flow logic",
          "Booking, CRM, or order management modules",
          "A modular structure ready to expand later",
        ],
        processTitle: "How we approach it",
        processSteps: [
          { title: "Process mapping", description: "We document the current workflow and identify the biggest friction points." },
          { title: "System planning", description: "Modules, roles, and key screens are defined around the business logic." },
          { title: "Phased implementation", description: "We start with the highest-value modules and expand from there." },
        ],
        faqTitle: "Custom systems FAQ",
        faqDescription: "Common questions before building a custom internal system.",
        faqItems: [
          { question: "Can we build it in phases?", answer: "Yes. Starting with the highest-value modules is usually the smartest approach." },
          { question: "Can it adapt to our current process?", answer: "In most cases yes. The plan is based on your current workflow." },
        ],
        finalCtaTitle: "Need an internal system that reduces chaos?",
        finalCtaDescription: "Share the workflow you use today and we can help define which parts are worth systemizing first.",
        seoTitle: "Custom system and CRM development | Sitecreator",
        seoDescription: "Custom internal systems, CRM workflows, booking tools, and operational dashboards built around your business process.",
      },
      ru: {
        cardTitle: "Индивидуальные системы",
        cardDescription: "CRM, внутренние панели и рабочие процессы, собранные под ваш бизнес.",
        heroBadge: "Индивидуальное решение",
        heroTitle: "Создаём системы, которые подстраиваются под работу вашей команды",
        heroDescription: "Когда стандартного сайта уже недостаточно, мы проектируем CRM, внутренние панели, бронирование и операционные инструменты под реальные процессы бизнеса.",
        primaryCta: "Поделиться задачей",
        secondaryCta: "Получить ориентир по бюджету",
        overviewTitle: "Когда нужен custom system?",
        overviewDescription: "Если продажи и данные живут в таблицах, сообщениях и ручных обновлениях, индивидуальная система сделает процесс управляемым и прозрачным.",
        outcomesTitle: "Что это даёт",
        outcomes: [
          { title: "Более понятный контроль процессов", description: "Команда работает в одной логике вместо разрозненных инструментов." },
          { title: "Меньше ручной рутины", description: "Повторяющиеся действия и хаос в данных заметно сокращаются." },
          { title: "Систему под ваш формат бизнеса", description: "Решение строится вокруг вашей модели работы." },
        ],
        deliverablesTitle: "Что может входить",
        deliverables: [
          "Внутренний dashboard и роли пользователей",
          "Логика статусов, задач и данных",
          "CRM, бронирование или order management",
          "Модульная архитектура для будущего роста",
        ],
        processTitle: "Подход к реализации",
        processSteps: [
          { title: "Карта процесса", description: "Разбираем текущий workflow и выделяем ключевые проблемные точки." },
          { title: "План системы", description: "Определяем модули, роли и экраны вокруг бизнес-логики компании." },
          { title: "Поэтапный запуск", description: "Сначала внедряем самые ценные части, затем расширяем систему дальше." },
        ],
        faqTitle: "FAQ по индивидуальным системам",
        faqDescription: "Главные вопросы перед стартом такого проекта.",
        faqItems: [
          { question: "Можно ли запускать систему поэтапно?", answer: "Да. Поэтапная реализация обычно даёт более рациональный результат." },
          { question: "Можно ли учесть наш текущий процесс?", answer: "Да. Решение строится вокруг вашей текущей операционной модели." },
        ],
        finalCtaTitle: "Хотите навести порядок во внутренних процессах?",
        finalCtaDescription: "Расскажите, как команда работает сейчас, и мы поможем определить, что стоит автоматизировать в первую очередь.",
        seoTitle: "Разработка индивидуальных систем и CRM | Sitecreator",
        seoDescription: "Индивидуальные системы, CRM, внутренние панели и операционные инструменты для бизнеса.",
      },
    }
  ),
];

export const defaultServicePagesConfig: ServicePagesConfig = {
  directory: createDirectoryContent({
    az: {
      badge: "Xidmət səhifələri",
      title: "Biznesiniz üçün doğru rəqəmsal həlli seçin",
      description: "Hər xidmət üçün ayrıca səhifədə scope, nəticə və iş axınını daha aydın görə bilərsiniz.",
    },
    en: {
      badge: "Service pages",
      title: "Choose the right digital solution for your business",
      description: "Each service page explains scope, outcomes, and the delivery approach in a clearer way.",
    },
    ru: {
      badge: "Страницы услуг",
      title: "Выберите правильное цифровое решение для вашего бизнеса",
      description: "На каждой странице услуги отдельно показаны scope проекта, результат и подход к работе.",
    },
  }),
  services: defaultServices,
};

function normalizeText(value: unknown, fallback: string) {
  return typeof value === "string" ? value.trim() : fallback;
}

function normalizeSlug(value: unknown, fallback: string) {
  const raw = typeof value === "string" ? value.trim() : fallback;
  return slugifyInsight(raw) || fallback;
}

function normalizeInfoItems(value: unknown, fallback: ServiceInfoItem[]) {
  if (!Array.isArray(value)) {
    return fallback.map((item) => ({ ...item }));
  }

  return value.map((item, index) => {
    const source = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const backup = fallback[index] ?? fallback[fallback.length - 1] ?? { title: "", description: "" };
    return {
      title: normalizeText(source.title, backup.title),
      description: normalizeText(source.description, backup.description),
    };
  });
}

function normalizeStringArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) {
    return [...fallback];
  }

  return value.map((item, index) => normalizeText(item, fallback[index] ?? ""));
}

function normalizeFaqItems(value: unknown, fallback: ServiceFaqItem[]) {
  if (!Array.isArray(value)) {
    return fallback.map((item) => ({ ...item }));
  }

  return value.map((item, index) => {
    const source = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const backup = fallback[index] ?? fallback[fallback.length - 1] ?? { question: "", answer: "" };
    return {
      question: normalizeText(source.question, backup.question),
      answer: normalizeText(source.answer, backup.answer),
    };
  });
}

function sanitizeLocaleContent(
  input: unknown,
  fallback: ServicePageLocaleContent
): ServicePageLocaleContent {
  const source = input && typeof input === "object" ? (input as Record<string, unknown>) : {};

  return {
    cardTitle: normalizeText(source.cardTitle, fallback.cardTitle),
    cardDescription: normalizeText(source.cardDescription, fallback.cardDescription),
    heroBadge: normalizeText(source.heroBadge, fallback.heroBadge),
    heroTitle: normalizeText(source.heroTitle, fallback.heroTitle),
    heroDescription: normalizeText(source.heroDescription, fallback.heroDescription),
    primaryCta: normalizeText(source.primaryCta, fallback.primaryCta),
    secondaryCta: normalizeText(source.secondaryCta, fallback.secondaryCta),
    overviewTitle: normalizeText(source.overviewTitle, fallback.overviewTitle),
    overviewDescription: normalizeText(source.overviewDescription, fallback.overviewDescription),
    outcomesTitle: normalizeText(source.outcomesTitle, fallback.outcomesTitle),
    outcomes: normalizeInfoItems(source.outcomes, fallback.outcomes),
    deliverablesTitle: normalizeText(source.deliverablesTitle, fallback.deliverablesTitle),
    deliverables: normalizeStringArray(source.deliverables, fallback.deliverables),
    processTitle: normalizeText(source.processTitle, fallback.processTitle),
    processSteps: normalizeInfoItems(source.processSteps, fallback.processSteps),
    faqTitle: normalizeText(source.faqTitle, fallback.faqTitle),
    faqDescription: normalizeText(source.faqDescription, fallback.faqDescription),
    faqItems: normalizeFaqItems(source.faqItems, fallback.faqItems),
    finalCtaTitle: normalizeText(source.finalCtaTitle, fallback.finalCtaTitle),
    finalCtaDescription: normalizeText(source.finalCtaDescription, fallback.finalCtaDescription),
    seoTitle: normalizeText(source.seoTitle, fallback.seoTitle),
    seoDescription: normalizeText(source.seoDescription, fallback.seoDescription),
  };
}

function sanitizeDirectoryLocaleContent(
  input: unknown,
  fallback: ServiceDirectoryLocaleContent
): ServiceDirectoryLocaleContent {
  const source = input && typeof input === "object" ? (input as Record<string, unknown>) : {};

  return {
    badge: normalizeText(source.badge, fallback.badge),
    title: normalizeText(source.title, fallback.title),
    description: normalizeText(source.description, fallback.description),
  };
}

function getFallbackService(index: number) {
  return defaultServicePagesConfig.services[index] ?? createEmptyServiceRecord(`service-${index + 1}`, index + 1);
}

function sanitizeServiceRecord(input: unknown, fallback: ServicePageRecord, index: number): ServicePageRecord {
  const source = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const slugsSource = source.slugs && typeof source.slugs === "object" ? (source.slugs as Record<string, unknown>) : {};
  const contentSource = source.content && typeof source.content === "object" ? (source.content as Record<string, unknown>) : {};
  const rawId = normalizeText(source.id, fallback.id || `service-${index + 1}`);
  const safeId = slugifyInsight(rawId) || fallback.id || `service-${index + 1}`;

  return createService(
    safeId,
    typeof source.order === "number" ? source.order : index + 1,
    {
      az: normalizeSlug(slugsSource.az, fallback.slugs.az || `${safeId}-az`),
      en: normalizeSlug(slugsSource.en, fallback.slugs.en || `${safeId}-en`),
      ru: normalizeSlug(slugsSource.ru, fallback.slugs.ru || `${safeId}-ru`),
    },
    {
      az: sanitizeLocaleContent(contentSource.az, fallback.content.az),
      en: sanitizeLocaleContent(contentSource.en, fallback.content.en),
      ru: sanitizeLocaleContent(contentSource.ru, fallback.content.ru),
    }
  );
}

export function sanitizeServicePagesConfig(input: unknown): ServicePagesConfig {
  const source = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const rawServices = Array.isArray(source.services) ? source.services : defaultServicePagesConfig.services;
  const rawDirectory =
    source.directory && typeof source.directory === "object"
      ? (source.directory as Record<string, unknown>)
      : defaultServicePagesConfig.directory;

  const services = rawServices
    .map((service, index) => sanitizeServiceRecord(service, getFallbackService(index), index))
    .sort((left, right) => left.order - right.order);

  return {
    directory: {
      az: sanitizeDirectoryLocaleContent(rawDirectory.az, defaultServicePagesConfig.directory.az),
      en: sanitizeDirectoryLocaleContent(rawDirectory.en, defaultServicePagesConfig.directory.en),
      ru: sanitizeDirectoryLocaleContent(rawDirectory.ru, defaultServicePagesConfig.directory.ru),
    },
    services,
  };
}

export function getLocalizedServiceContent(
  service: ServicePageRecord,
  locale: ServiceLocale
): ServicePageLocaleContent {
  const requested = service.content[locale];
  if (requested.cardTitle || requested.heroTitle || requested.overviewDescription) {
    return requested;
  }

  for (const candidate of serviceLocales) {
    const content = service.content[candidate];
    if (content.cardTitle || content.heroTitle || content.overviewDescription) {
      return content;
    }
  }

  return requested;
}

export function getServiceAlternates(service: ServicePageRecord) {
  return {
    az: `/az/services/${service.slugs.az}`,
    en: `/en/services/${service.slugs.en}`,
    ru: `/ru/services/${service.slugs.ru}`,
    "x-default": `/az/services/${service.slugs.az}`,
  };
}
