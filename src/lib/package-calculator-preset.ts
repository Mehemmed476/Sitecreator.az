import {
  calculatePriceEstimate,
  type PriceCalculatorSelections,
} from "@/lib/price-calculator-estimate";
import { getLocalizedText, type CalculatorServiceId, type LocaleKey, type PriceCalculatorConfig } from "@/lib/price-calculator";

export type PackageCalculatorPreset = PriceCalculatorSelections;

export type PackagePresetSummary = {
  startingPrice: number;
  timelineLabel: string;
  includedModules: string[];
  serviceName: string;
  unitLabel: string;
  unitCount: number;
  designLabel: string;
  logoLabel: string;
  supportLabel: string;
  buildLabels: string[];
  seoLabels: string[];
};

export function createDefaultPackageCalculatorPreset(
  serviceId: CalculatorServiceId = "website"
): PackageCalculatorPreset {
  return {
    serviceId,
    unitCount: serviceId === "website" ? 5 : serviceId === "ecommerce" ? 10 : serviceId === "mobile-app" ? 8 : 6,
    designId: "professional",
    logoId: "none",
    timelineId: "standard",
    supportId: "support-none",
    selectedBuild: [],
    selectedSeo: [],
  };
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function sanitizePackageCalculatorPreset(
  input: unknown,
  fallback = createDefaultPackageCalculatorPreset()
): PackageCalculatorPreset {
  const source = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const serviceId = source.serviceId;

  return {
    serviceId:
      serviceId === "website" ||
      serviceId === "ecommerce" ||
      serviceId === "mobile-app" ||
      serviceId === "custom-system"
        ? serviceId
        : fallback.serviceId,
    unitCount: typeof source.unitCount === "number" && Number.isFinite(source.unitCount) ? source.unitCount : fallback.unitCount,
    designId: typeof source.designId === "string" && source.designId.trim() ? source.designId : fallback.designId,
    logoId: typeof source.logoId === "string" && source.logoId.trim() ? source.logoId : fallback.logoId,
    timelineId:
      typeof source.timelineId === "string" && source.timelineId.trim() ? source.timelineId : fallback.timelineId,
    supportId:
      typeof source.supportId === "string" && source.supportId.trim() ? source.supportId : fallback.supportId,
    selectedBuild: asStringArray(source.selectedBuild),
    selectedSeo: asStringArray(source.selectedSeo),
  };
}

export function buildPackagePresetSummary(
  locale: LocaleKey,
  config: PriceCalculatorConfig,
  preset: PackageCalculatorPreset
): PackagePresetSummary {
  const estimate = calculatePriceEstimate(config, preset);
  const buildLabels = estimate.buildItems.map((item) => getLocalizedText(locale, item.label));
  const seoLabels = estimate.seoItems.map((item) => getLocalizedText(locale, item.label));
  const includedModules = [
    `${getLocalizedText(locale, estimate.service.name)} · ${preset.unitCount} ${getLocalizedText(locale, estimate.service.unitLabel).toLowerCase()}`,
    ...buildLabels,
    ...seoLabels,
  ];

  if ((estimate.logo.price ?? 0) > 0) {
    includedModules.push(getLocalizedText(locale, estimate.logo.label));
  }

  if ((estimate.support.monthlyPrice ?? 0) > 0) {
    includedModules.push(getLocalizedText(locale, estimate.support.label));
  }

  return {
    startingPrice: estimate.total,
    timelineLabel: getLocalizedText(locale, estimate.timeline.label),
    includedModules,
    serviceName: getLocalizedText(locale, estimate.service.name),
    unitLabel: getLocalizedText(locale, estimate.service.unitLabel),
    unitCount: preset.unitCount,
    designLabel: getLocalizedText(locale, estimate.design.label),
    logoLabel: getLocalizedText(locale, estimate.logo.label),
    supportLabel: getLocalizedText(locale, estimate.support.label),
    buildLabels,
    seoLabels,
  };
}

export function buildPriceCalculatorHrefFromPreset(preset: PackageCalculatorPreset) {
  const params = new URLSearchParams();
  params.set("service", preset.serviceId);
  params.set("units", String(preset.unitCount));
  params.set("design", preset.designId);
  params.set("logo", preset.logoId);
  params.set("timeline", preset.timelineId);
  params.set("support", preset.supportId);

  if (preset.selectedBuild.length) {
    params.set("build", preset.selectedBuild.join(","));
  }

  if (preset.selectedSeo.length) {
    params.set("seo", preset.selectedSeo.join(","));
  }

  return `/price-calculator?${params.toString()}`;
}

export function resolvePriceCalculatorSelectionsFromSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
  config: PriceCalculatorConfig
): PriceCalculatorSelections {
  const fallback = createDefaultPackageCalculatorPreset(config.services[0]?.id ?? "website");
  const pick = (key: string) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };
  const parseList = (key: string) =>
    (pick(key) ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const serviceId = pick("service");
  const designId = pick("design");
  const logoId = pick("logo");
  const timelineId = pick("timeline");
  const supportId = pick("support");
  const units = Number(pick("units"));
  const buildIds = parseList("build");
  const seoIds = parseList("seo");

  const service =
    config.services.find((item) => item.id === serviceId) ??
    config.services.find((item) => item.id === fallback.serviceId) ??
    config.services[0];
  const design =
    config.designOptions.find((item) => item.id === designId) ??
    config.designOptions.find((item) => item.id === fallback.designId) ??
    config.designOptions[0];
  const logo =
    config.logoOptions.find((item) => item.id === logoId) ??
    config.logoOptions.find((item) => item.id === fallback.logoId) ??
    config.logoOptions[0];
  const timeline =
    config.timelineOptions.find((item) => item.id === timelineId) ??
    config.timelineOptions.find((item) => item.id === fallback.timelineId) ??
    config.timelineOptions[0];
  const support =
    config.supportOptions.find((item) => item.id === supportId) ??
    config.supportOptions.find((item) => item.id === fallback.supportId) ??
    config.supportOptions[0];

  const buildGroup = config.addOnGroups.find((group) => group.id === "build");
  const seoGroup = config.addOnGroups.find((group) => group.id === "seo");

  return {
    serviceId: service.id,
    unitCount:
      Number.isFinite(units) && units > 0
        ? units
        : service.defaultUnits,
    designId: design.id,
    logoId: logo.id,
    timelineId: timeline.id,
    supportId: support.id,
    selectedBuild: buildIds.filter((id) => buildGroup?.items.some((item) => item.id === id)),
    selectedSeo: seoIds.filter((id) => seoGroup?.items.some((item) => item.id === id)),
  };
}
