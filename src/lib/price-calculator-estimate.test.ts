import assert from "node:assert/strict";
import test from "node:test";
import { defaultPriceCalculatorConfig } from "./price-calculator.ts";
import {
  buildEstimateSummaryText,
  buildSafeCalculatorConfig,
  calculatePriceEstimate,
  toggleValue,
} from "./price-calculator-estimate.ts";

test("toggleValue adds and removes entries", () => {
  assert.deepEqual(toggleValue(["a", "b"], "c"), ["a", "b", "c"]);
  assert.deepEqual(toggleValue(["a", "b"], "a"), ["b"]);
});

test("calculatePriceEstimate returns stable total values", () => {
  const config = buildSafeCalculatorConfig(defaultPriceCalculatorConfig);
  const estimate = calculatePriceEstimate(config, {
    serviceId: "website",
    unitCount: 8,
    designId: config.designOptions[1].id,
    logoId: config.logoOptions[0].id,
    timelineId: config.timelineOptions[2].id,
    supportId: config.supportOptions[1].id,
    selectedBuild: config.addOnGroups[0].items.slice(0, 2).map((item) => item.id),
    selectedSeo: config.addOnGroups[1].items.slice(0, 1).map((item) => item.id),
  });

  assert.equal(estimate.scopePrice >= 0, true);
  assert.equal(estimate.total >= estimate.designAdjusted, true);
  assert.equal(estimate.monthlySupport, config.supportOptions[1].monthlyPrice ?? 0);
});

test("buildEstimateSummaryText includes lead details", () => {
  const config = buildSafeCalculatorConfig(defaultPriceCalculatorConfig);
  const selections = {
    serviceId: "website" as const,
    unitCount: 6,
    designId: config.designOptions[0].id,
    logoId: config.logoOptions[0].id,
    timelineId: config.timelineOptions[0].id,
    supportId: config.supportOptions[0].id,
    selectedBuild: [],
    selectedSeo: [],
  };
  const estimate = calculatePriceEstimate(config, selections);

  const summary = buildEstimateSummaryText({
    locale: "en",
    copy: config.copy,
    estimate,
    selections,
    form: {
      phone: "+994500000000",
      company: "Sitecreator",
      message: "Need a quick launch",
    },
  });

  assert.match(summary, /Phone: \+994500000000/);
  assert.match(summary, /Company: Sitecreator/);
  assert.match(summary, /Need a quick launch/);
});
