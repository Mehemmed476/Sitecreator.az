import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { InsightArticle } from "@/components/insights/InsightArticle";
import { getPublishedInsightBySlug } from "@/lib/insights";
import { getInsightAlternates, getInsightContent, getInsightCoverImage } from "@/lib/insight-utils";
import { getCanonicalPath, getSiteUrl } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "az" | "en" | "ru"; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const insight = await getPublishedInsightBySlug(slug, locale).catch(() => null);

  if (!insight) {
    return {
      title: "Content not found",
      robots: { index: false, follow: false },
    };
  }

  const content = getInsightContent(insight, locale);
  const title = content.seoTitle || `${content.title} | Sitecreator`;
  const description = content.seoDescription || content.excerpt;
  const canonical = getCanonicalPath(locale, `/blog/${content.slug}`);
  const alternates = getInsightAlternates(insight);
  const siteUrl = getSiteUrl();
  const coverImageUrl = getInsightCoverImage(insight, locale);

  return {
    title,
    description,
    keywords: content.tags,
    alternates: {
      canonical,
      languages: {
        az: `${siteUrl}${alternates.az}`,
        en: `${siteUrl}${alternates.en}`,
        ru: `${siteUrl}${alternates.ru}`,
        "x-default": `${siteUrl}${alternates["x-default"]}`,
      },
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      siteName: "Sitecreator",
      locale,
      publishedTime: insight.publishedAt,
      images: coverImageUrl ? [{ url: coverImageUrl, alt: content.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: coverImageUrl ? [coverImageUrl] : undefined,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  await getTranslations("blog");

  const insight = await getPublishedInsightBySlug(slug, locale as "az" | "en" | "ru").catch(() => null);

  if (!insight) {
    notFound();
  }

  const content = getInsightContent(insight, locale as "az" | "en" | "ru");
  const coverImageUrl = getInsightCoverImage(insight, locale as "az" | "en" | "ru");
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: content.title,
    description: content.excerpt,
    image: coverImageUrl ? [coverImageUrl] : undefined,
    datePublished: insight.publishedAt,
    dateModified: insight.updatedAt,
    author: {
      "@type": "Organization",
      name: "Sitecreator",
    },
    publisher: {
      "@type": "Organization",
      name: "Sitecreator",
      url: getSiteUrl(),
    },
    mainEntityOfPage: getCanonicalPath(locale as "az" | "en" | "ru", `/blog/${content.slug}`),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <InsightArticle insight={insight} locale={locale} />
    </>
  );
}
