import { defaultPriceCalculatorConfig } from "@/lib/price-calculator";
import { loadPriceCalculatorConfig } from "@/lib/price-calculator-store";
import {
  syncPackageSolutionsConfig,
} from "@/lib/package-solutions-sync";
import {
  getPackageSolutionsConfig,
  savePackageSolutionsConfig,
} from "@/lib/package-solutions-store";
import { sanitizePackageSolutionsConfig } from "@/lib/package-solutions";

async function loadCalculatorConfigSafe() {
  try {
    return await loadPriceCalculatorConfig();
  } catch {
    return defaultPriceCalculatorConfig;
  }
}

export async function getSyncedPackageSolutionsConfig() {
  const [config, calculatorConfig] = await Promise.all([
    getPackageSolutionsConfig(),
    loadCalculatorConfigSafe(),
  ]);

  return syncPackageSolutionsConfig(config, calculatorConfig);
}

export async function saveSyncedPackageSolutionsConfig(input: unknown) {
  const calculatorConfig = await loadCalculatorConfigSafe();
  const config = syncPackageSolutionsConfig(
    sanitizePackageSolutionsConfig(input),
    calculatorConfig
  );

  return savePackageSolutionsConfig(config);
}
