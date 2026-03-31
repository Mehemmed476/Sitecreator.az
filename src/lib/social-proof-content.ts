export type SocialProofLocale = "az" | "en" | "ru";

export type SocialProofTestimonial = {
  quote: string;
  author: string;
  role: string;
  company: string;
};

export type SocialProofFaqItem = {
  question: string;
  answer: string;
};

export type SocialProofLocaleContent = {
  testimonialsEyebrow: string;
  testimonialsTitle: string;
  testimonialsDescription: string;
  testimonials: SocialProofTestimonial[];
  faqEyebrow: string;
  faqTitle: string;
  faqDescription: string;
  faqItems: SocialProofFaqItem[];
};

export type SocialProofContent = Record<SocialProofLocale, SocialProofLocaleContent>;

const defaultTestimonials: Record<
  SocialProofLocale,
  Pick<
    SocialProofLocaleContent,
    "testimonialsEyebrow" | "testimonialsTitle" | "testimonialsDescription" | "testimonials"
  >
> = {
  az: {
    testimonialsEyebrow: "Müştəri rəyləri",
    testimonialsTitle: "Bizimlə işləyənlər nə deyir",
    testimonialsDescription:
      "Biznes sahibləri üçün əsas məsələ təkcə gözəl sayt deyil, nəticə verən sistemdir. Bu rəylər həmin fərqi göstərir.",
    testimonials: [
      {
        quote:
          "Sayt yenilənəndən sonra müraciət sayı daha sistemli gəldi və müştəriyə təqdimatımız xeyli gücləndi.",
        author: "Nigar Əliyeva",
        role: "Marketinq rəhbəri",
        company: "Nova Studio",
      },
      {
        quote:
          "Kalkulyator və blog strukturu bizim üçün ayrıca üstünlük oldu. Həm SEO, həm də satış tərəfi daha aydın işləməyə başladı.",
        author: "Rəşad Məmmədov",
        role: "Təsisçi",
        company: "Caspian Trade",
      },
      {
        quote:
          "Komanda sürətli idi, proses qarışıq deyildi və sayt istifadəyə veriləndən sonra da dəstək davam etdi.",
        author: "Aysel Həsənli",
        role: "İcraçı direktor",
        company: "Aster Group",
      },
    ],
  },
  en: {
    testimonialsEyebrow: "Client feedback",
    testimonialsTitle: "What our clients say",
    testimonialsDescription:
      "For business owners, the goal is not just a nice-looking website, but a system that performs. These testimonials reflect that difference.",
    testimonials: [
      {
        quote:
          "After the new website went live, inbound requests became more qualified and our brand presentation improved significantly.",
        author: "Nigar Aliyeva",
        role: "Marketing Lead",
        company: "Nova Studio",
      },
      {
        quote:
          "The calculator and blog structure gave us an edge. Both the SEO side and the sales journey became much clearer.",
        author: "Rashad Mammadov",
        role: "Founder",
        company: "Caspian Trade",
      },
      {
        quote:
          "The team moved fast, the process stayed clear, and support continued even after the launch.",
        author: "Aysel Hasanli",
        role: "Managing Director",
        company: "Aster Group",
      },
    ],
  },
  ru: {
    testimonialsEyebrow: "Отзывы клиентов",
    testimonialsTitle: "Что говорят наши клиенты",
    testimonialsDescription:
      "Для бизнеса важен не просто красивый сайт, а система, которая действительно работает. Эти отзывы показывают разницу.",
    testimonials: [
      {
        quote:
          "После запуска нового сайта входящие обращения стали качественнее, а подача бренда заметно усилилась.",
        author: "Нигяр Алиева",
        role: "Руководитель маркетинга",
        company: "Nova Studio",
      },
      {
        quote:
          "Калькулятор и структура блога дали нам дополнительное преимущество. И SEO, и продажи стали работать гораздо понятнее.",
        author: "Рашад Мамедов",
        role: "Основатель",
        company: "Caspian Trade",
      },
      {
        quote:
          "Команда работала быстро, процесс был понятным, а поддержка продолжилась и после запуска.",
        author: "Айсель Гасанли",
        role: "Исполнительный директор",
        company: "Aster Group",
      },
    ],
  },
};

const defaultFaqs: Record<
  SocialProofLocale,
  Pick<SocialProofLocaleContent, "faqEyebrow" | "faqTitle" | "faqDescription" | "faqItems">
> = {
  az: {
    faqEyebrow: "Tez-tez soruşulanlar",
    faqTitle: "Ən çox verilən suallar",
    faqDescription:
      "Əgər əməkdaşlığa başlamazdan əvvəl vaxt, qiymət və proses barədə suallarınız varsa, əsas cavabları burada topladıq.",
    faqItems: [
      {
        question: "Saytın hazırlanması nə qədər vaxt aparır?",
        answer:
          "Layihənin həcminə görə dəyişir. Sadə korporativ saytlar adətən 2-4 həftə, daha geniş həllər isə daha uzun müddətdə tamamlanır.",
      },
      {
        question: "Qiymət necə hesablanır?",
        answer:
          "Qiymət seçilən xidmət növünə, səhifə sayına, əlavə modullara, dizayn mürəkkəbliyinə və dəstək tələbinə görə formalaşır. Kalkulyator bu mərhələdə sizə ilkin istiqamət verir.",
      },
      {
        question: "Sayt təhvil veriləndən sonra dəstək verirsiniz?",
        answer:
          "Bəli. Texniki dəstək, yeniləmə və inkişaf ehtiyaclarına görə aylıq və ya mərhələli əməkdaşlıq mümkündür.",
      },
    ],
  },
  en: {
    faqEyebrow: "Frequently asked questions",
    faqTitle: "Common questions before we start",
    faqDescription:
      "If you are deciding based on time, pricing, or process, we have collected the most common answers here.",
    faqItems: [
      {
        question: "How long does a website project take?",
        answer:
          "It depends on the scope. A focused corporate website usually takes 2-4 weeks, while larger systems naturally require more time.",
      },
      {
        question: "How is pricing calculated?",
        answer:
          "Pricing depends on the service type, page volume, extra modules, design complexity, and support scope. The calculator gives you a realistic starting estimate.",
      },
      {
        question: "Do you provide support after launch?",
        answer:
          "Yes. We can continue with technical support, updates, and ongoing product improvements based on your needs.",
      },
    ],
  },
  ru: {
    faqEyebrow: "Частые вопросы",
    faqTitle: "Что обычно спрашивают до старта",
    faqDescription:
      "Если вы оцениваете сотрудничество по срокам, стоимости и процессу, основные ответы собраны здесь.",
    faqItems: [
      {
        question: "Сколько времени занимает разработка сайта?",
        answer:
          "Это зависит от объёма проекта. Небольшой корпоративный сайт обычно занимает 2-4 недели, а более сложные системы требуют больше времени.",
      },
      {
        question: "Как формируется стоимость?",
        answer:
          "Стоимость зависит от типа услуги, количества страниц, дополнительных модулей, сложности дизайна и объёма поддержки. Калькулятор помогает получить стартовую оценку.",
      },
      {
        question: "Вы поддерживаете проект после запуска?",
        answer:
          "Да. Мы можем продолжить работу в формате технической поддержки, обновлений и дальнейшего развития продукта.",
      },
    ],
  },
};

export const defaultSocialProofContent: SocialProofContent = {
  az: {
    ...defaultTestimonials.az,
    ...defaultFaqs.az,
  },
  en: {
    ...defaultTestimonials.en,
    ...defaultFaqs.en,
  },
  ru: {
    ...defaultTestimonials.ru,
    ...defaultFaqs.ru,
  },
};

function normalizeText(value: unknown, fallback: string) {
  return typeof value === "string" ? value.trim() : fallback;
}

function normalizeTestimonials(value: unknown, fallback: SocialProofTestimonial[]) {
  if (!Array.isArray(value)) {
    return fallback.map((item) => ({ ...item }));
  }

  return value.map((item, index) => {
    const source = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const backup =
      fallback[index] ??
      fallback[fallback.length - 1] ?? { quote: "", author: "", role: "", company: "" };

    return {
      quote: normalizeText(source.quote, backup.quote),
      author: normalizeText(source.author, backup.author),
      role: normalizeText(source.role, backup.role),
      company: normalizeText(source.company, backup.company),
    };
  });
}

function normalizeFaqItems(value: unknown, fallback: SocialProofFaqItem[]) {
  if (!Array.isArray(value)) {
    return fallback.map((item) => ({ ...item }));
  }

  return value.map((item, index) => {
    const source = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const backup =
      fallback[index] ?? fallback[fallback.length - 1] ?? { question: "", answer: "" };

    return {
      question: normalizeText(source.question, backup.question),
      answer: normalizeText(source.answer, backup.answer),
    };
  });
}

function sanitizeLocaleContent(
  input: unknown,
  fallback: SocialProofLocaleContent
): SocialProofLocaleContent {
  const source = input && typeof input === "object" ? (input as Record<string, unknown>) : {};

  return {
    testimonialsEyebrow: normalizeText(source.testimonialsEyebrow, fallback.testimonialsEyebrow),
    testimonialsTitle: normalizeText(source.testimonialsTitle, fallback.testimonialsTitle),
    testimonialsDescription: normalizeText(
      source.testimonialsDescription,
      fallback.testimonialsDescription
    ),
    testimonials: normalizeTestimonials(source.testimonials, fallback.testimonials),
    faqEyebrow: normalizeText(source.faqEyebrow, fallback.faqEyebrow),
    faqTitle: normalizeText(source.faqTitle, fallback.faqTitle),
    faqDescription: normalizeText(source.faqDescription, fallback.faqDescription),
    faqItems: normalizeFaqItems(source.faqItems, fallback.faqItems),
  };
}

export function sanitizeSocialProofContent(input: unknown): SocialProofContent {
  const source = input && typeof input === "object" ? (input as Record<string, unknown>) : {};

  return {
    az: sanitizeLocaleContent(source.az, defaultSocialProofContent.az),
    en: sanitizeLocaleContent(source.en, defaultSocialProofContent.en),
    ru: sanitizeLocaleContent(source.ru, defaultSocialProofContent.ru),
  };
}
