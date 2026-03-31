import type { Dispatch, SetStateAction } from "react";
import { Sparkles } from "lucide-react";
import { getLocalizedText, type LocaleKey, type PriceCalculatorConfig } from "@/lib/price-calculator";
import { MANAT, type PriceCalculatorSelections, toggleValue } from "@/lib/price-calculator-estimate";
import { SectionHeader } from "@/components/price-calculator/PriceCalculatorServiceSection";

export function PriceCalculatorExtrasSection({
  locale,
  copy,
  buildGroup,
  seoGroup,
  logoOptions,
  timelineOptions,
  supportOptions,
  selections,
  money,
  onSelectionsChange,
}: {
  locale: LocaleKey;
  copy: PriceCalculatorConfig["copy"];
  buildGroup: PriceCalculatorConfig["addOnGroups"][number];
  seoGroup: PriceCalculatorConfig["addOnGroups"][number];
  logoOptions: PriceCalculatorConfig["logoOptions"];
  timelineOptions: PriceCalculatorConfig["timelineOptions"];
  supportOptions: PriceCalculatorConfig["supportOptions"];
  selections: PriceCalculatorSelections;
  money: (value: number) => string;
  onSelectionsChange: Dispatch<SetStateAction<PriceCalculatorSelections>>;
}) {
  return (
    <section className="site-card-strong rounded-[2rem] p-6 sm:p-8">
      <SectionHeader
        step="03"
        title={getLocalizedText(locale, copy.extrasTitle)}
        description={getLocalizedText(locale, copy.extrasDescription)}
        icon={<Sparkles className="h-5 w-5" />}
      />

      {[buildGroup, seoGroup].map((group) => {
        const selected = group.id === "build" ? selections.selectedBuild : selections.selectedSeo;

        return (
          <div key={group.id} className="site-card-subtle mt-5 rounded-3xl p-5 first:mt-0">
            <h3 className="text-lg font-semibold">{getLocalizedText(locale, group.title)}</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {group.items.map((item) => {
                const active = selected.includes(item.id);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      onSelectionsChange((prev) => ({
                        ...prev,
                        [group.id === "build" ? "selectedBuild" : "selectedSeo"]: toggleValue(selected, item.id),
                      }))
                    }
                    className={`rounded-2xl px-4 py-4 text-left transition-all duration-200 ${active ? "site-card-selected" : "site-card-subtle"}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-sm font-medium text-foreground">{getLocalizedText(locale, item.label)}</span>
                      <span className="text-sm font-semibold text-primary">+{MANAT} {money(item.price)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {[
          { title: getLocalizedText(locale, copy.logoOption), items: logoOptions, key: "logoId" as const },
          { title: getLocalizedText(locale, copy.timeline), items: timelineOptions, key: "timelineId" as const },
          { title: getLocalizedText(locale, copy.monthlySupport), items: supportOptions, key: "supportId" as const },
        ].map((group) => (
          <div key={group.title} className="site-card-subtle rounded-3xl p-5">
            <h3 className="text-lg font-semibold">{group.title}</h3>
            <div className="mt-4 space-y-3">
              {group.items.map((item) => {
                const active = item.id === selections[group.key];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectionsChange((prev) => ({ ...prev, [group.key]: item.id }))}
                    className={`w-full rounded-2xl px-4 py-3 text-left transition-all duration-200 ${active ? "site-card-selected" : "site-card-subtle"}`}
                  >
                    <div className="font-medium text-foreground">{getLocalizedText(locale, item.label)}</div>
                    <div className="mt-1 text-sm text-muted">{getLocalizedText(locale, item.helper)}</div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
