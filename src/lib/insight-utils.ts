import {
  insightLocales,
  type InsightLocale,
  type InsightLocaleContent,
  type InsightRecord,
  type InsightTranslations,
} from "./insight-types.ts";

export function slugifyInsight(value: string) {
  const transliterationMap: Record<string, string> = {
    ə: "e",
    Ə: "E",
    ı: "i",
    İ: "I",
    ğ: "g",
    Ğ: "G",
    ş: "s",
    Ş: "S",
    ç: "c",
    Ç: "C",
    ö: "o",
    Ö: "O",
    ü: "u",
    Ü: "U",
    а: "a",
    А: "A",
    б: "b",
    Б: "B",
    в: "v",
    В: "V",
    г: "g",
    Г: "G",
    д: "d",
    Д: "D",
    е: "e",
    Е: "E",
    ё: "yo",
    Ё: "Yo",
    ж: "zh",
    Ж: "Zh",
    з: "z",
    З: "Z",
    и: "i",
    И: "I",
    й: "y",
    Й: "Y",
    к: "k",
    К: "K",
    л: "l",
    Л: "L",
    м: "m",
    М: "M",
    н: "n",
    Н: "N",
    о: "o",
    О: "O",
    п: "p",
    П: "P",
    р: "r",
    Р: "R",
    с: "s",
    С: "S",
    т: "t",
    Т: "T",
    у: "u",
    У: "U",
    ф: "f",
    Ф: "F",
    х: "h",
    Х: "H",
    ц: "ts",
    Ц: "Ts",
    ч: "ch",
    Ч: "Ch",
    ш: "sh",
    Ш: "Sh",
    щ: "shch",
    Щ: "Shch",
    ы: "y",
    Ы: "Y",
    э: "e",
    Э: "E",
    ю: "yu",
    Ю: "Yu",
    я: "ya",
    Я: "Ya",
    ъ: "",
    Ъ: "",
    ь: "",
    Ь: "",
  };

  const normalized = Array.from(value.normalize("NFKD"), (char) => transliterationMap[char] ?? char)
    .join("")
    .replace(/[\u0300-\u036f]/g, "");

  return normalized
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function normalizeInsightTags(value: string | string[]) {
  const source = Array.isArray(value) ? value.join(",") : value;

  return source
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function estimateReadingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
}

export function createEmptyInsightLocaleContent(): InsightLocaleContent {
  return {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    tags: [],
    coverImageUrl: "",
    coverImagePublicId: "",
    seoTitle: "",
    seoDescription: "",
  };
}

export function createEmptyInsightTranslations(): InsightTranslations {
  return {
    az: createEmptyInsightLocaleContent(),
    en: createEmptyInsightLocaleContent(),
    ru: createEmptyInsightLocaleContent(),
  };
}

export function isInsightLocaleComplete(content: InsightLocaleContent) {
  return Boolean(content.title.trim() && content.excerpt.trim() && content.content.trim());
}

export function getInsightContent(
  insight: InsightRecord,
  locale: InsightLocale
): InsightLocaleContent {
  const requested = insight.translations[locale];
  if (requested.title || requested.excerpt || requested.content) {
    return requested;
  }

  for (const candidate of insightLocales) {
    const content = insight.translations[candidate];
    if (content.title || content.excerpt || content.content) {
      return content;
    }
  }

  return requested;
}

export function getInsightCoverImage(insight: InsightRecord, locale: InsightLocale) {
  const requested = insight.translations[locale];
  if (requested.coverImageUrl) {
    return requested.coverImageUrl;
  }

  for (const candidate of insightLocales) {
    const translation = insight.translations[candidate];
    if (translation.coverImageUrl) {
      return translation.coverImageUrl;
    }
  }

  return insight.coverImageUrl;
}

export function getInsightAlternates(insight: InsightRecord) {
  return {
    az: `/az/blog/${getInsightContent(insight, "az").slug}`,
    en: `/en/blog/${getInsightContent(insight, "en").slug}`,
    ru: `/ru/blog/${getInsightContent(insight, "ru").slug}`,
    "x-default": `/az/blog/${getInsightContent(insight, "az").slug}`,
  };
}

export function getInsightLocaleStatus(insight: InsightRecord) {
  return Object.fromEntries(
    insightLocales.map((locale) => [locale, isInsightLocaleComplete(insight.translations[locale])])
  ) as Record<InsightLocale, boolean>;
}

export type InsightBlock =
  | { type: "heading"; content: string }
  | { type: "subheading"; content: string }
  | { type: "paragraph"; content: string }
  | { type: "list"; items: string[] };

export function splitInsightContentIntoBlocks(content: string): InsightBlock[] {
  return content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);

      if (block.startsWith("## ")) {
        return { type: "heading", content: block.replace(/^##\s+/, "") } satisfies InsightBlock;
      }

      if (block.startsWith("### ")) {
        return {
          type: "subheading",
          content: block.replace(/^###\s+/, ""),
        } satisfies InsightBlock;
      }

      if (lines.length > 0 && lines.every((line) => line.startsWith("- "))) {
        return {
          type: "list",
          items: lines.map((line) => line.replace(/^- /, "")),
        } satisfies InsightBlock;
      }

      return { type: "paragraph", content: lines.join(" ") } satisfies InsightBlock;
    });
}
