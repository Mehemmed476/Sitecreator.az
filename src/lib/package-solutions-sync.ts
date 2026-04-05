import { buildPackagePresetSummary } from "@/lib/package-calculator-preset";
import type { PriceCalculatorConfig } from "@/lib/price-calculator";
import {
  packageLocales,
  type PackageInstagramDraft,
  type PackageLocaleContent,
  type PackageSolutionRecord,
  type PackageSolutionsConfig,
} from "@/lib/package-solutions";

function cloneInstagramDraft(draft: PackageInstagramDraft): PackageInstagramDraft {
  return {
    ...draft,
    slides: draft.slides.map((item) => ({ ...item })),
  };
}

function cloneLocaleContent(content: PackageLocaleContent): PackageLocaleContent {
  return {
    ...content,
    perfectFor: [...content.perfectFor],
    includedModules: [...content.includedModules],
    highlights: content.highlights.map((item) => ({ ...item })),
    faqItems: content.faqItems.map((item) => ({ ...item })),
    instagram: cloneInstagramDraft(content.instagram),
  };
}

export function clonePackageRecord(record: PackageSolutionRecord): PackageSolutionRecord {
  return {
    ...record,
    slugs: { ...record.slugs },
    content: {
      az: cloneLocaleContent(record.content.az),
      en: cloneLocaleContent(record.content.en),
      ru: cloneLocaleContent(record.content.ru),
    },
  };
}

export function clonePackageSolutionsConfig(config: PackageSolutionsConfig): PackageSolutionsConfig {
  return {
    directory: {
      az: { ...config.directory.az },
      en: { ...config.directory.en },
      ru: { ...config.directory.ru },
    },
    packages: config.packages.map(clonePackageRecord),
  };
}

export function syncPackageWithCalculator(
  pkg: PackageSolutionRecord,
  calculatorConfig: PriceCalculatorConfig
): PackageSolutionRecord {
  const nextPackage = clonePackageRecord(pkg);

  for (const locale of packageLocales) {
    const summary = buildPackagePresetSummary(locale, calculatorConfig, nextPackage.calculatorPreset);
    nextPackage.startingPrice = summary.startingPrice;
    nextPackage.content[locale].includedModules = summary.includedModules;
    nextPackage.content[locale].timelineLabel = summary.timelineLabel;
  }

  return nextPackage;
}

export function syncPackageSolutionsConfig(
  config: PackageSolutionsConfig,
  calculatorConfig: PriceCalculatorConfig
): PackageSolutionsConfig {
  return {
    ...clonePackageSolutionsConfig(config),
    packages: config.packages.map((item) => syncPackageWithCalculator(item, calculatorConfig)),
  };
}
