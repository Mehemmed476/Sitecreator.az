import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ServicesIndexPageContent } from "@/components/services/ServicesIndexPageContent";
import { getAllServicePages, getServicePagesConfig, mapServiceListItem } from "@/lib/service-pages-store";
import { getCanonicalPath, getLanguageAlternates } from "@/lib/seo";
import type { ServiceLocale } from "@/lib/service-pages";

const metadataCopy: Record<ServiceLocale, { title: string; description: string }> = {
  az: {
    title: "Xidmətlər | Veb sayt, SEO, mobil tətbiq və fərdi sistemlər",
    description: "Veb sayt hazırlanması, e-ticarət, SEO, mobil tətbiq və xüsusi sistem xidmətləri üçün ayrıca service page-lərə baxın.",
  },
  en: {
    title: "Services | Websites, SEO, mobile apps, and custom systems",
    description: "Explore dedicated service pages for website development, e-commerce, SEO, mobile apps, and custom systems.",
  },
  ru: {
    title: "Услуги | Сайты, SEO, мобильные приложения и индивидуальные системы",
    description: "Посмотрите отдельные service pages по разработке сайтов, e-commerce, SEO, мобильным приложениям и индивидуальным системам.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: ServiceLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const copy = metadataCopy[locale];

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: getCanonicalPath(locale, "/services"),
      languages: getLanguageAlternates("/services"),
    },
    openGraph: {
      type: "website",
      title: copy.title,
      description: copy.description,
      url: getCanonicalPath(locale, "/services"),
      siteName: "Sitecreator",
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: ServiceLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [services, config] = await Promise.all([getAllServicePages(), getServicePagesConfig()]);
  const directory = config.directory[locale];

  return (
    <ServicesIndexPageContent
      locale={locale}
      badge={directory.badge}
      title={directory.title}
      description={directory.description}
      services={services.map((service) => mapServiceListItem(service, locale))}
    />
  );
}
