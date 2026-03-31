export const insightLocales = ["az", "en", "ru"] as const;

export type InsightLocale = (typeof insightLocales)[number];
export type InsightType = "blog" | "case-study";

export interface InsightLocaleContent {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  coverImageUrl?: string;
  coverImagePublicId?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export type InsightTranslations = Record<InsightLocale, InsightLocaleContent>;

export interface InsightRecord {
  _id: string;
  type: InsightType;
  coverImageUrl?: string;
  coverImagePublicId?: string;
  translations: InsightTranslations;
  published: boolean;
  featured: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}
