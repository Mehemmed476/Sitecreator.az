"use client";

import {
  defaultPriceCalculatorConfig,
  type PriceCalculatorConfig,
} from "@/lib/price-calculator";
import { useRemoteResource } from "@/hooks/useRemoteResource";

export function usePriceCalculatorConfig() {
  const { data: config } = useRemoteResource<PriceCalculatorConfig>({
    url: "/api/price-calculator",
    fallback: defaultPriceCalculatorConfig,
  });

  return { config };
}
