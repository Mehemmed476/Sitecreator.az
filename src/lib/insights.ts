import { connectDB } from "@/lib/db";
import {
  insightLocales,
  type InsightLocale,
  type InsightLocaleContent,
  type InsightRecord,
  type InsightTranslations,
  type InsightType,
} from "@/lib/insight-types";
import {
  createEmptyInsightLocaleContent,
  createEmptyInsightTranslations,
  getInsightContent,
  isInsightLocaleComplete,
  normalizeInsightTags,
  slugifyInsight,
} from "@/lib/insight-utils";
import { Insight } from "@/lib/models/Insight";

type PartialInsightLocaleContent = Partial<Omit<InsightLocaleContent, "tags">> & {
  tags?: string[] | string;
};

type InsightDocumentLike = {
  _id: unknown;
  type: InsightType;
  translations?: Partial<Record<InsightLocale, PartialInsightLocaleContent>>;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  tags?: string[] | string;
  seoTitle?: string;
  seoDescription?: string;
  coverImageUrl?: string;
  coverImagePublicId?: string;
  published?: boolean;
  featured?: boolean;
  publishedAt?: Date | string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

function normalizeLocaleContent(
  raw?: PartialInsightLocaleContent,
  fallback?: PartialInsightLocaleContent
): InsightLocaleContent {
  const source = raw ?? {};
  const backup = fallback ?? {};
  const base = createEmptyInsightLocaleContent();

  return {
    ...base,
    title: String(source.title ?? backup.title ?? "").trim(),
    slug: String(source.slug ?? backup.slug ?? "").trim(),
    excerpt: String(source.excerpt ?? backup.excerpt ?? "").trim(),
    content: String(source.content ?? backup.content ?? "").trim(),
    tags: normalizeInsightTags(source.tags ?? backup.tags ?? []),
    coverImageUrl: String(source.coverImageUrl ?? backup.coverImageUrl ?? "").trim(),
    coverImagePublicId: String(source.coverImagePublicId ?? backup.coverImagePublicId ?? "").trim(),
    seoTitle: String(source.seoTitle ?? backup.seoTitle ?? "").trim(),
    seoDescription: String(source.seoDescription ?? backup.seoDescription ?? "").trim(),
  };
}

export function serializeInsight(doc: InsightDocumentLike): InsightRecord {
  const legacyContent: PartialInsightLocaleContent = {
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt,
    content: doc.content,
    tags: doc.tags,
    coverImageUrl: doc.coverImageUrl,
    coverImagePublicId: doc.coverImagePublicId,
    seoTitle: doc.seoTitle,
    seoDescription: doc.seoDescription,
  };
  const translations = createEmptyInsightTranslations();
  translations.az = normalizeLocaleContent(doc.translations?.az, legacyContent);
  translations.en = normalizeLocaleContent(doc.translations?.en);
  translations.ru = normalizeLocaleContent(doc.translations?.ru);

  return {
    _id: String(doc._id),
    type: doc.type,
    translations,
    coverImageUrl: doc.coverImageUrl,
    coverImagePublicId: doc.coverImagePublicId,
    published: Boolean(doc.published),
    featured: Boolean(doc.featured),
    publishedAt: doc.publishedAt ? new Date(doc.publishedAt).toISOString() : undefined,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : new Date().toISOString(),
  };
}

export async function generateUniqueInsightSlug(
  value: string,
  locale: InsightLocale,
  excludeId?: string
) {
  await connectDB();

  const baseSlug = slugifyInsight(value) || "insight";
  const slugField = `translations.${locale}.slug`;
  let candidate = baseSlug;
  let counter = 2;

  while (true) {
    const existing = await Insight.findOne({
      $or: [{ [slugField]: candidate }, { slug: candidate }],
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    })
      .select("_id")
      .lean();

    if (!existing) {
      return candidate;
    }

    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

export async function getPublishedInsights() {
  await connectDB();

  const items = await Insight.find({ published: true })
    .sort({ featured: -1, publishedAt: -1, createdAt: -1 })
    .lean();

  return items.map(serializeInsight);
}

export async function getPublishedInsightBySlug(slug: string, locale: InsightLocale) {
  await connectDB();

  const slugField = `translations.${locale}.slug`;
  const item = await Insight.findOne({
    published: true,
    $or: [{ [slugField]: slug }, { slug }],
  }).lean();

  return item ? serializeInsight(item) : null;
}

export async function getAllInsightSlugs() {
  const items = await getPublishedInsights();

  return items.map((item) => ({
    slugs: Object.fromEntries(
      insightLocales.map((locale) => [locale, getInsightContent(item, locale).slug])
    ) as Record<InsightLocale, string>,
    updatedAt: new Date(item.updatedAt),
  }));
}

export function validatePublishedInsightTranslations(translations: InsightTranslations) {
  return insightLocales.filter((locale) => !isInsightLocaleComplete(translations[locale]));
}
