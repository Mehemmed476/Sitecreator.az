import { Palette } from "lucide-react";
import { getLocalizedText, type LocaleKey, type PriceCalculatorConfig } from "@/lib/price-calculator";
import type { PriceCalculatorSelections } from "@/lib/price-calculator-estimate";
import { SectionHeader } from "@/components/price-calculator/PriceCalculatorServiceSection";

export function PriceCalculatorDetailsSection({
  locale,
  copy,
  service,
  designOptions,
  selections,
  onUnitCountChange,
  onDesignChange,
}: {
  locale: LocaleKey;
  copy: PriceCalculatorConfig["copy"];
  service: PriceCalculatorConfig["services"][number];
  designOptions: PriceCalculatorConfig["designOptions"];
  selections: PriceCalculatorSelections;
  onUnitCountChange: (value: number) => void;
  onDesignChange: (id: string) => void;
}) {
  return (
    <section className="site-card-strong rounded-[2rem] p-6 sm:p-8">
      <SectionHeader
        step="02"
        title={getLocalizedText(locale, copy.detailsTitle)}
        description={getLocalizedText(locale, copy.detailsDescription)}
        icon={<Palette className="h-5 w-5" />}
      />

      <div className="site-card-subtle rounded-3xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-medium text-muted">{getLocalizedText(locale, service.unitLabel)}</div>
            <div className="mt-2 text-3xl font-bold text-foreground">{selections.unitCount}</div>
          </div>
          <div className="text-sm text-muted">
            {getLocalizedText(locale, copy.included)}: {service.includedUnits}
          </div>
        </div>

        <input
          type="range"
          min={service.minUnits}
          max={service.maxUnits}
          value={selections.unitCount}
          onChange={(event) => onUnitCountChange(Number(event.target.value))}
          className="mt-6 w-full accent-primary"
        />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {designOptions.map((item) => {
          const active = item.id === selections.designId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onDesignChange(item.id)}
              className={`rounded-3xl p-5 text-left transition-all duration-200 ${active ? "site-card-selected" : "site-card-subtle"}`}
            >
              <div className="font-semibold text-foreground">{getLocalizedText(locale, item.label)}</div>
              <div className="mt-2 text-sm text-muted">{getLocalizedText(locale, item.helper)}</div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
