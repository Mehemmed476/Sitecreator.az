import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PackageSolutionDetailPageContent } from "@/components/packages/PackageSolutionDetailPageContent";
import { buildPackagePresetSummary } from "@/lib/package-calculator-preset";
import { defaultPriceCalculatorConfig } from "@/lib/price-calculator";
import { loadPriceCalculatorConfig } from "@/lib/price-calculator-store";
import {
  getLocalizedPackageContent,
  getPackageAlternates,
  type PackageLocale,
} from "@/lib/package-solutions";
import {
  getAllPackageSlugs,
  getPackageSolutionBySlug,
} from "@/lib/package-solutions-store";
import { getCanonicalPath, getSiteUrl } from "@/lib/seo";

export async function generateStaticParams() {
  const packages = await getAllPackageSlugs().catch(() => []);

  return packages.flatMap((pkg) =>
    ([
      { locale: "az", slug: pkg.slugs.az },
      { locale: "en", slug: pkg.slugs.en },
      { locale: "ru", slug: pkg.slugs.ru },
    ] as const).filter((entry) => entry.slug)
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: PackageLocale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const pkg = await getPackageSolutionBySlug(slug, locale).catch(() => null);

  if (!pkg) {
    return {
      title: "Content not found",
      robots: { index: false, follow: false },
    };
  }

  const content = getLocalizedPackageContent(pkg, locale);
  const alternates = getPackageAlternates(pkg);
  const siteUrl = getSiteUrl();
  const canonical = getCanonicalPath(locale, `/packages/${pkg.slugs[locale]}`);

  return {
    title: content.seoTitle || `${content.heroTitle} | Sitecreator`,
    description: content.seoDescription || content.heroDescription,
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
      type: "website",
      title: content.seoTitle || `${content.heroTitle} | Sitecreator`,
      description: content.seoDescription || content.heroDescription,
      url: canonical,
      siteName: "Sitecreator",
      locale,
      images: pkg.coverImageUrl ? [{ url: pkg.coverImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: content.seoTitle || `${content.heroTitle} | Sitecreator`,
      description: content.seoDescription || content.heroDescription,
      images: pkg.coverImageUrl ? [pkg.coverImageUrl] : undefined,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ locale: PackageLocale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const pkg = await getPackageSolutionBySlug(slug, locale).catch(() => null);

  if (!pkg) {
    notFound();
  }

  const content = getLocalizedPackageContent(pkg, locale);
  const calculatorConfig = await loadPriceCalculatorConfig().catch(() => null);
  const presetSummary = buildPackagePresetSummary(
    locale,
    calculatorConfig ?? defaultPriceCalculatorConfig,
    pkg.calculatorPreset
  );
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: content.cardTitle,
    description: content.heroDescription,
    serviceType: content.cardTitle,
    areaServed: [
      { "@type": "Country", name: "Azerbaijan" },
      { "@type": "City", name: "Baku" },
    ],
    provider: {
      "@type": "Organization",
      name: "Sitecreator",
      url: getSiteUrl(),
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "AZN",
      price: pkg.startingPrice,
      availability: "https://schema.org/InStock",
      url: getCanonicalPath(locale, `/packages/${pkg.slugs[locale]}`),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <PackageSolutionDetailPageContent locale={locale} pkg={pkg} presetSummary={presetSummary} />
    </>
  );
}
