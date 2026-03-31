import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PriceCalculatorClient } from "@/components/price-calculator/PriceCalculatorClient";
import {
  defaultPriceCalculatorConfig,
  type LocaleKey,
} from "@/lib/price-calculator";
import { loadPriceCalculatorConfig } from "@/lib/price-calculator-store";
import { buildLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "az" | "en" | "ru" }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildLocalizedMetadata({ locale, page: "calculator", pathname: "/price-calculator" });
}

export const dynamic = "force-dynamic";

export default async function PriceCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await getTranslations();

  let config = defaultPriceCalculatorConfig;

  try {
    config = await loadPriceCalculatorConfig();
  } catch {
    // Fallback to seed config when DB is temporarily unavailable.
  }

  return <PriceCalculatorClient locale={locale as LocaleKey} config={config} />;
}
