import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ServiceDetailPageContent } from "@/components/services/ServiceDetailPageContent";
import {
  getLocalizedServiceContent,
  getServiceAlternates,
  type ServiceLocale,
} from "@/lib/service-pages";
import { getAllServiceSlugs, getServicePageBySlug } from "@/lib/service-pages-store";
import { getCanonicalPath, getSiteUrl } from "@/lib/seo";

export async function generateStaticParams() {
  const services = await getAllServiceSlugs().catch(() => []);

  return services.flatMap((service) => [
    { locale: "az", slug: service.slugs.az },
    { locale: "en", slug: service.slugs.en },
    { locale: "ru", slug: service.slugs.ru },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: ServiceLocale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = await getServicePageBySlug(slug, locale).catch(() => null);

  if (!service) {
    return {
      title: "Content not found",
      robots: { index: false, follow: false },
    };
  }

  const content = getLocalizedServiceContent(service, locale);
  const alternates = getServiceAlternates(service);
  const siteUrl = getSiteUrl();
  const canonical = getCanonicalPath(locale, `/services/${service.slugs[locale]}`);

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
    },
    twitter: {
      card: "summary_large_image",
      title: content.seoTitle || `${content.heroTitle} | Sitecreator`,
      description: content.seoDescription || content.heroDescription,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: ServiceLocale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const service = await getServicePageBySlug(slug, locale).catch(() => null);

  if (!service) {
    notFound();
  }

  const content = getLocalizedServiceContent(service, locale);
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
    url: getCanonicalPath(locale, `/services/${service.slugs[locale]}`),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ServiceDetailPageContent locale={locale} service={service} />
    </>
  );
}
