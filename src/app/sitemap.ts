import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getAllInsightSlugs } from "@/lib/insights";
import { getAllPackageSlugs } from "@/lib/package-solutions-store";
import { getAllServiceSlugs } from "@/lib/service-pages-store";
import { getLanguageAlternates, getSiteUrl } from "@/lib/seo";

const localizedPaths = ["/", "/about", "/services", "/packages", "/portfolio", "/blog", "/contact", "/price-calculator"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const baseEntries = routing.locales.flatMap((locale) =>
    localizedPaths.map((pathname) => ({
      url: `${siteUrl}/${locale}${pathname === "/" ? "" : pathname}`,
      lastModified: new Date(),
      alternates: {
        languages: getLanguageAlternates(pathname),
      },
    }))
  );

  try {
    const [articleEntries, serviceEntries, packageEntries] = await Promise.all([
      getAllInsightSlugs(),
      getAllServiceSlugs(),
      getAllPackageSlugs(),
    ]);

    return [
      ...baseEntries,
      ...routing.locales.flatMap((locale) =>
        articleEntries.map((entry) => ({
          url: `${siteUrl}/${locale}/blog/${entry.slugs[locale]}`,
          lastModified: entry.updatedAt,
          alternates: {
            languages: {
              az: `${siteUrl}/az/blog/${entry.slugs.az}`,
              en: `${siteUrl}/en/blog/${entry.slugs.en}`,
              ru: `${siteUrl}/ru/blog/${entry.slugs.ru}`,
              "x-default": `${siteUrl}/az/blog/${entry.slugs.az}`,
            },
          },
        }))
      ),
      ...routing.locales.flatMap((locale) =>
        serviceEntries.map((entry) => ({
          url: `${siteUrl}/${locale}/services/${entry.slugs[locale]}`,
          lastModified: entry.updatedAt,
          alternates: {
            languages: {
              az: `${siteUrl}/az/services/${entry.slugs.az}`,
              en: `${siteUrl}/en/services/${entry.slugs.en}`,
              ru: `${siteUrl}/ru/services/${entry.slugs.ru}`,
              "x-default": `${siteUrl}/az/services/${entry.slugs.az}`,
            },
          },
        }))
      ),
      ...routing.locales.flatMap((locale) =>
        packageEntries.map((entry: Awaited<ReturnType<typeof getAllPackageSlugs>>[number]) => ({
          url: `${siteUrl}/${locale}/packages/${entry.slugs[locale]}`,
          lastModified: entry.updatedAt,
          alternates: {
            languages: {
              az: `${siteUrl}/az/packages/${entry.slugs.az}`,
              en: `${siteUrl}/en/packages/${entry.slugs.en}`,
              ru: `${siteUrl}/ru/packages/${entry.slugs.ru}`,
              "x-default": `${siteUrl}/az/packages/${entry.slugs.az}`,
            },
          },
        }))
      ),
    ];
  } catch {
    return baseEntries;
  }
}
