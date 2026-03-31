import { connectDB } from "@/lib/db";
import {
  defaultPriceCalculatorConfig,
  sanitizePriceCalculatorConfig,
  type PriceCalculatorConfig,
} from "@/lib/price-calculator";
import { PriceCalculatorConfigModel } from "@/lib/models/PriceCalculatorConfig";

export async function loadPriceCalculatorConfig(): Promise<PriceCalculatorConfig> {
  await connectDB();

  const existing = await PriceCalculatorConfigModel.findOne({
    singletonKey: "main",
  }).lean();

  if (existing?.config) {
    return sanitizePriceCalculatorConfig(existing.config);
  }

  const created = await PriceCalculatorConfigModel.create({
    singletonKey: "main",
    config: defaultPriceCalculatorConfig,
  });

  return sanitizePriceCalculatorConfig(created.toObject().config);
}

export async function savePriceCalculatorConfig(
  input: unknown
): Promise<PriceCalculatorConfig> {
  const config = sanitizePriceCalculatorConfig(input);

  await connectDB();
  await PriceCalculatorConfigModel.findOneAndUpdate(
    { singletonKey: "main" },
    { singletonKey: "main", config },
    { upsert: true, new: true }
  );

  return config;
}

