import {
  defaultPriceCalculatorConfig,
  getLocalizedText,
  type CalculatorOption,
  type CalculatorService,
  type CalculatorToggleGroup,
  type CalculatorToggleItem,
  type LocaleKey,
  type PriceCalculatorConfig,
} from "./price-calculator.ts";

export type PriceCalculatorSelections = {
  serviceId: CalculatorService["id"];
  unitCount: number;
  designId: string;
  logoId: string;
  timelineId: string;
  supportId: string;
  selectedBuild: string[];
  selectedSeo: string[];
};

export type PriceCalculatorEstimate = {
  service: CalculatorService;
  buildGroup: CalculatorToggleGroup;
  seoGroup: CalculatorToggleGroup;
  design: CalculatorOption;
  logo: CalculatorOption;
  timeline: CalculatorOption;
  support: CalculatorOption;
  buildItems: CalculatorToggleItem[];
  seoItems: CalculatorToggleItem[];
  extraUnits: number;
  scopePrice: number;
  baseWithScope: number;
  designAdjusted: number;
  designImpact: number;
  buildTotal: number;
  seoTotal: number;
  logoTotal: number;
  subtotal: number;
  total: number;
  monthlySupport: number;
};

export const MANAT = "\u20BC";

export function buildSafeCalculatorConfig(config: PriceCalculatorConfig): PriceCalculatorConfig {
  return {
    ...defaultPriceCalculatorConfig,
    ...config,
    services: config.services.length ? config.services : defaultPriceCalculatorConfig.services,
    addOnGroups: config.addOnGroups.length
      ? config.addOnGroups
      : defaultPriceCalculatorConfig.addOnGroups,
    designOptions: config.designOptions.length
      ? config.designOptions
      : defaultPriceCalculatorConfig.designOptions,
    logoOptions: config.logoOptions.length
      ? config.logoOptions
      : defaultPriceCalculatorConfig.logoOptions,
    timelineOptions: config.timelineOptions.length
      ? config.timelineOptions
      : defaultPriceCalculatorConfig.timelineOptions,
    supportOptions: config.supportOptions.length
      ? config.supportOptions
      : defaultPriceCalculatorConfig.supportOptions,
  };
}

export function toggleValue(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function getGroupItems(group: CalculatorToggleGroup, selectedIds: string[]) {
  return group.items.filter((item) => selectedIds.includes(item.id));
}

export function getMoneyFormatter(locale: LocaleKey) {
  return (value: number) => formatMoneyValue(locale, value);
}

export function formatMoneyValue(locale: LocaleKey, value: number) {
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "-" : "";
  const separator = locale === "en" ? "," : ".";
  const absolute = Math.abs(rounded)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, separator);

  return `${sign}${absolute}`;
}

export function calculatePriceEstimate(
  config: PriceCalculatorConfig,
  selections: PriceCalculatorSelections
): PriceCalculatorEstimate {
  const service =
    config.services.find((item) => item.id === selections.serviceId) ?? config.services[0];
  const buildGroup = config.addOnGroups.find((group) => group.id === "build") ?? config.addOnGroups[0];
  const seoGroup =
    config.addOnGroups.find((group) => group.id === "seo") ??
    config.addOnGroups[Math.min(1, config.addOnGroups.length - 1)];
  const design =
    config.designOptions.find((item) => item.id === selections.designId) ?? config.designOptions[0];
  const logo =
    config.logoOptions.find((item) => item.id === selections.logoId) ?? config.logoOptions[0];
  const timeline =
    config.timelineOptions.find((item) => item.id === selections.timelineId) ?? config.timelineOptions[0];
  const support =
    config.supportOptions.find((item) => item.id === selections.supportId) ?? config.supportOptions[0];

  const buildItems = getGroupItems(buildGroup, selections.selectedBuild);
  const seoItems = getGroupItems(seoGroup, selections.selectedSeo);
  const extraUnits = Math.max(0, selections.unitCount - service.includedUnits);
  const scopePrice = extraUnits * service.perUnitPrice;
  const baseWithScope = service.basePrice + scopePrice;
  const designAdjusted = Math.round(baseWithScope * (design.multiplier ?? 1));
  const designImpact = designAdjusted - baseWithScope;
  const buildTotal = buildItems.reduce((sum, item) => sum + item.price, 0);
  const seoTotal = seoItems.reduce((sum, item) => sum + item.price, 0);
  const logoTotal = logo.price ?? 0;
  const subtotal = designAdjusted + buildTotal + seoTotal + logoTotal;
  const total = Math.round(subtotal * (timeline.multiplier ?? 1));
  const monthlySupport = support.monthlyPrice ?? 0;

  return {
    service,
    buildGroup,
    seoGroup,
    design,
    logo,
    timeline,
    support,
    buildItems,
    seoItems,
    extraUnits,
    scopePrice,
    baseWithScope,
    designAdjusted,
    designImpact,
    buildTotal,
    seoTotal,
    logoTotal,
    subtotal,
    total,
    monthlySupport,
  };
}

function buildSummaryLine(label: string, value: string) {
  return `${label}: ${value}`;
}

export function buildEstimateSummaryText({
  locale,
  copy,
  estimate,
  selections,
  form,
}: {
  locale: LocaleKey;
  copy: PriceCalculatorConfig["copy"];
  estimate: PriceCalculatorEstimate;
  selections: PriceCalculatorSelections;
  form?: { phone?: string; company?: string; message?: string };
}) {
  const money = getMoneyFormatter(locale);
  const summary = [
    getLocalizedText(locale, copy.leadMessageIntro),
    buildSummaryLine("Service", getLocalizedText(locale, estimate.service.name)),
    buildSummaryLine(getLocalizedText(locale, estimate.service.unitLabel), String(selections.unitCount)),
    buildSummaryLine("Design", getLocalizedText(locale, estimate.design.label)),
    buildSummaryLine(
      "Build",
      estimate.buildItems.map((item) => getLocalizedText(locale, item.label)).join(", ") || "-"
    ),
    buildSummaryLine(
      "SEO",
      estimate.seoItems.map((item) => getLocalizedText(locale, item.label)).join(", ") || "-"
    ),
    buildSummaryLine("Logo", getLocalizedText(locale, estimate.logo.label)),
    buildSummaryLine("Timeline", getLocalizedText(locale, estimate.timeline.label)),
    buildSummaryLine("Estimate", `${money(estimate.total)} AZN`),
    buildSummaryLine("Monthly support", `${money(estimate.monthlySupport)} AZN`),
  ];

  if (!form) {
    return summary.join("\n");
  }

  return [
    ...summary,
    "",
    buildSummaryLine("Phone", form.phone || "-"),
    buildSummaryLine("Company", form.company || "-"),
    "",
    form.message || "-",
  ].join("\n");
}

export function buildEstimateLineItems({
  locale,
  estimate,
}: {
  locale: LocaleKey;
  estimate: PriceCalculatorEstimate;
}) {
  return [
    {
      label: getLocalizedText(locale, estimate.service.name),
      amount: estimate.baseWithScope,
    },
    {
      label: "Əlavə həcm",
      amount: estimate.scopePrice,
    },
    {
      label: "Dizayn təsiri",
      amount: estimate.designImpact,
    },
    {
      label: "Layihə əlavələri",
      amount: estimate.buildTotal,
    },
    {
      label: "SEO əlavələri",
      amount: estimate.seoTotal,
    },
    {
      label: "Logo paketi",
      amount: estimate.logoTotal,
    },
  ];
}
