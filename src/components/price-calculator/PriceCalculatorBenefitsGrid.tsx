import { Layers3, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { getLocalizedText, type LocaleKey, type PriceCalculatorBenefit } from "@/lib/price-calculator";

const icons = [Zap, ShieldCheck, Layers3, Sparkles];

export function PriceCalculatorBenefitsGrid({
  locale,
  benefits,
}: {
  locale: LocaleKey;
  benefits: PriceCalculatorBenefit[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {benefits.map((benefit, index) => {
        const Icon = icons[index] ?? Zap;
        return (
          <div key={benefit.id} className="site-card rounded-3xl p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{getLocalizedText(locale, benefit.title)}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{getLocalizedText(locale, benefit.text)}</p>
          </div>
        );
      })}
    </div>
  );
}
