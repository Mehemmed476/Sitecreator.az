import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { InsightsPageContent } from "@/components/insights/InsightsPageContent";
import { getPublishedInsights } from "@/lib/insights";
import { buildLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "az" | "en" | "ru" }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildLocalizedMetadata({ locale, page: "blog", pathname: "/blog" });
}

export const dynamic = "force-dynamic";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await getTranslations("blog");

  const insights = await getPublishedInsights().catch(() => []);

  return <InsightsPageContent insights={insights} locale={locale} />;
}
