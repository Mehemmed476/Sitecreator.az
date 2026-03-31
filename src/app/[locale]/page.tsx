import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { HomePageContent } from "@/components/home/HomePageContent";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { getHomepageContent, getHomepageFeaturedProjects } from "@/lib/homepage";
import { buildLocalizedMetadata } from "@/lib/seo";
import { loadSocialProofContent } from "@/lib/social-proof-store";
import { getAllServicePages, mapServiceListItem } from "@/lib/service-pages-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "az" | "en" | "ru" }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildLocalizedMetadata({ locale, page: "home", pathname: "/" });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [featuredProjects, homepageContent, socialProofContent, services] = await Promise.all([
    getHomepageFeaturedProjects(locale as "az" | "en" | "ru"),
    getHomepageContent(),
    loadSocialProofContent(),
    getAllServicePages(),
  ]);

  return (
    <>
      <OrganizationJsonLd />
      <HomePageContent
        locale={locale as "az" | "en" | "ru"}
        featuredProjects={featuredProjects}
        content={homepageContent[locale as "az" | "en" | "ru"]}
        socialProof={socialProofContent[locale as "az" | "en" | "ru"]}
        serviceLinks={services.map((service) => mapServiceListItem(service, locale as "az" | "en" | "ru"))}
      />
    </>
  );
}
