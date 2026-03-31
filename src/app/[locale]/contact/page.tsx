import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactPageContent } from "@/components/contact/ContactPageContent";
import { buildLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "az" | "en" | "ru" }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildLocalizedMetadata({ locale, page: "contact", pathname: "/contact" });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await getTranslations("contact");

  return <ContactPageContent />;
}
