"use client";

import { useMemo, useState } from "react";
import {
  defaultPriceCalculatorConfig,
  type LocaleKey,
  type PriceCalculatorConfig,
} from "@/lib/price-calculator";
import {
  buildEstimateLineItems,
  buildEstimateSummaryText,
  buildSafeCalculatorConfig,
  calculatePriceEstimate,
  getMoneyFormatter,
  toggleValue,
  type PriceCalculatorSelections,
} from "@/lib/price-calculator-estimate";
import { downloadPriceCalculatorProposalPdf } from "@/lib/price-calculator-proposal";

export type PriceCalculatorStatus = "idle" | "loading" | "success" | "error";

export type PriceCalculatorLeadForm = {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
};

export function usePriceCalculator({
  locale,
  config,
}: {
  locale: LocaleKey;
  config: PriceCalculatorConfig;
}) {
  const safeConfig = useMemo(() => buildSafeCalculatorConfig(config), [config]);
  const copy = safeConfig.copy;
  const buildGroup =
    safeConfig.addOnGroups.find((group) => group.id === "build") ?? safeConfig.addOnGroups[0];
  const seoGroup =
    safeConfig.addOnGroups.find((group) => group.id === "seo") ??
    safeConfig.addOnGroups[Math.min(1, safeConfig.addOnGroups.length - 1)];

  const [selections, setSelections] = useState<PriceCalculatorSelections>({
    serviceId: safeConfig.services[0].id,
    unitCount: safeConfig.services[0].defaultUnits,
    designId: safeConfig.designOptions[Math.min(1, safeConfig.designOptions.length - 1)].id,
    logoId: safeConfig.logoOptions[0].id,
    timelineId: safeConfig.timelineOptions[Math.min(2, safeConfig.timelineOptions.length - 1)].id,
    supportId: safeConfig.supportOptions[Math.min(1, safeConfig.supportOptions.length - 1)].id,
    selectedBuild: buildGroup.items.slice(0, Math.min(4, buildGroup.items.length)).map((item) => item.id),
    selectedSeo: seoGroup.items.slice(0, Math.min(3, seoGroup.items.length)).map((item) => item.id),
  });
  const [form, setForm] = useState<PriceCalculatorLeadForm>({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [status, setStatus] = useState<PriceCalculatorStatus>("idle");

  const estimate = useMemo(
    () => calculatePriceEstimate(safeConfig, selections),
    [safeConfig, selections]
  );
  const money = useMemo(() => getMoneyFormatter(locale), [locale]);
  const steps = copy.steps.length ? copy.steps : defaultPriceCalculatorConfig.copy.steps;
  const benefits = copy.benefits.length
    ? copy.benefits
    : defaultPriceCalculatorConfig.copy.benefits;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    try {
      const message = buildEstimateSummaryText({
        locale,
        copy,
        estimate,
        selections,
        form,
      });

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          message,
          source: "calculator",
          calculator: {
            locale,
            total: estimate.total,
            summary: message,
            serviceName: estimate.service.name[locale] ?? estimate.service.name.az,
            unitCount: selections.unitCount,
            unitLabel: estimate.service.unitLabel[locale] ?? estimate.service.unitLabel.az,
            designLabel: estimate.design.label[locale] ?? estimate.design.label.az,
            logoLabel: estimate.logo.label[locale] ?? estimate.logo.label.az,
            timelineLabel: estimate.timeline.label[locale] ?? estimate.timeline.label.az,
            supportLabel: estimate.support.label[locale] ?? estimate.support.label.az,
            monthlySupport: estimate.monthlySupport,
            buildLabels: estimate.buildItems.map((item) => item.label[locale] ?? item.label.az),
            seoLabels: estimate.seoItems.map((item) => item.label[locale] ?? item.label.az),
            lineItems: buildEstimateLineItems({ locale, estimate }),
            selections,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed");
      }

      setStatus("success");
      setForm({ name: "", email: "", phone: "", company: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  async function downloadSummary() {
    await downloadPriceCalculatorProposalPdf({
      locale,
      copy,
      estimate,
      selections,
      form,
    });
  }

  function scrollToLeadForm() {
    document.getElementById("calculator-lead-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return {
    safeConfig,
    copy,
    steps,
    benefits,
    selections,
    setSelections,
    estimate,
    money,
    form,
    setForm,
    status,
    handleSubmit,
    downloadSummary,
    scrollToLeadForm,
    toggleValue,
  };
}
