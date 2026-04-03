import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PackageSolutionsIndexPageContent } from "@/components/packages/PackageSolutionsIndexPageContent";
import {
  getAllPackageSolutions,
  getPackageSolutionsConfig,
  mapPackageListItem,
} from "@/lib/package-solutions-store";
import { getCanonicalPath, getLanguageAlternates } from "@/lib/seo";
import type { PackageLocale } from "@/lib/package-solutions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: PackageLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const config = await getPackageSolutionsConfig();
  const directory = config.directory[locale];

  return {
    title: `${directory.title} | Sitecreator`,
    description: directory.description,
    alternates: {
      canonical: getCanonicalPath(locale, "/packages"),
      languages: getLanguageAlternates("/packages"),
    },
    openGraph: {
      type: "website",
      title: `${directory.title} | Sitecreator`,
      description: directory.description,
      url: getCanonicalPath(locale, "/packages"),
      siteName: "Sitecreator",
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title: `${directory.title} | Sitecreator`,
      description: directory.description,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function PackagesPage({
  params,
}: {
  params: Promise<{ locale: PackageLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [config, packages] = await Promise.all([
    getPackageSolutionsConfig(),
    getAllPackageSolutions(),
  ]);
  const directory = config.directory[locale];

  return (
    <PackageSolutionsIndexPageContent
      locale={locale}
      badge={directory.badge}
      title={directory.title}
      description={directory.description}
      packages={packages.map((item) => mapPackageListItem(item, locale))}
    />
  );
}
