"use client";

import { SectionCard } from "@/components/admin/dashboard/content-editor-shared";
import type { PackageCalculatorPreset, PackageLocale, PackageSolutionRecord } from "@/lib/package-solutions";
import type { PriceCalculatorConfig } from "@/lib/price-calculator";
import type { PackagePresetSummary } from "@/lib/package-calculator-preset";
import { getLocalizedText } from "@/lib/price-calculator";

export function PackagePresetEditor({
  activeLocale,
  activePackage,
  calculatorConfig,
  activePresetSummary,
  onUpdatePreset,
}: {
  activeLocale: PackageLocale;
  activePackage: PackageSolutionRecord;
  calculatorConfig: PriceCalculatorConfig;
  activePresetSummary: PackagePresetSummary | null;
  onUpdatePreset: <K extends keyof PackageCalculatorPreset>(
    key: K,
    value: PackageCalculatorPreset[K]
  ) => void;
}) {
  return (
    <>
      <SectionCard title="Kalkulyator preset">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Xidmət</span>
            <select
              value={activePackage.calculatorPreset.serviceId}
              onChange={(event) =>
                onUpdatePreset("serviceId", event.target.value as PackageCalculatorPreset["serviceId"])
              }
              className="site-input w-full"
            >
              {calculatorConfig.services.map((service) => (
                <option key={service.id} value={service.id}>
                  {getLocalizedText(activeLocale, service.name)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">
              {activePresetSummary?.unitLabel || "Sayı"}
            </span>
            <input
              type="number"
              min={1}
              value={activePackage.calculatorPreset.unitCount}
              onChange={(event) =>
                onUpdatePreset("unitCount", Math.max(1, Number(event.target.value) || 1))
              }
              className="site-input w-full"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Dizayn</span>
            <select
              value={activePackage.calculatorPreset.designId}
              onChange={(event) => onUpdatePreset("designId", event.target.value)}
              className="site-input w-full"
            >
              {calculatorConfig.designOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {getLocalizedText(activeLocale, option.label)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Logo</span>
            <select
              value={activePackage.calculatorPreset.logoId}
              onChange={(event) => onUpdatePreset("logoId", event.target.value)}
              className="site-input w-full"
            >
              {calculatorConfig.logoOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {getLocalizedText(activeLocale, option.label)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Müddət</span>
            <select
              value={activePackage.calculatorPreset.timelineId}
              onChange={(event) => onUpdatePreset("timelineId", event.target.value)}
              className="site-input w-full"
            >
              {calculatorConfig.timelineOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {getLocalizedText(activeLocale, option.label)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Dəstək</span>
            <select
              value={activePackage.calculatorPreset.supportId}
              onChange={(event) => onUpdatePreset("supportId", event.target.value)}
              className="site-input w-full"
            >
              {calculatorConfig.supportOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {getLocalizedText(activeLocale, option.label)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </SectionCard>

      <SectionCard title="Kalkulyator əlavələri">
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="space-y-3">
            <div className="text-sm font-semibold text-foreground">Layihə əlavələri</div>
            <div className="grid gap-3">
              {(calculatorConfig.addOnGroups.find((group) => group.id === "build")?.items ?? []).map((item) => {
                const checked = activePackage.calculatorPreset.selectedBuild.includes(item.id);

                return (
                  <label key={item.id} className="site-card-subtle flex items-start gap-3 rounded-2xl p-4">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        onUpdatePreset(
                          "selectedBuild",
                          checked
                            ? activePackage.calculatorPreset.selectedBuild.filter((entry) => entry !== item.id)
                            : [...activePackage.calculatorPreset.selectedBuild, item.id]
                        )
                      }
                      className="mt-1 h-4 w-4 rounded border-border bg-transparent accent-[var(--color-primary)]"
                    />
                    <span className="text-sm text-foreground">
                      {getLocalizedText(activeLocale, item.label)}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold text-foreground">SEO əlavələri</div>
            <div className="grid gap-3">
              {(calculatorConfig.addOnGroups.find((group) => group.id === "seo")?.items ?? []).map((item) => {
                const checked = activePackage.calculatorPreset.selectedSeo.includes(item.id);

                return (
                  <label key={item.id} className="site-card-subtle flex items-start gap-3 rounded-2xl p-4">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        onUpdatePreset(
                          "selectedSeo",
                          checked
                            ? activePackage.calculatorPreset.selectedSeo.filter((entry) => entry !== item.id)
                            : [...activePackage.calculatorPreset.selectedSeo, item.id]
                        )
                      }
                      className="mt-1 h-4 w-4 rounded border-border bg-transparent accent-[var(--color-primary)]"
                    />
                    <span className="text-sm text-foreground">
                      {getLocalizedText(activeLocale, item.label)}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Avtomatik xülasə">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="site-card-subtle rounded-2xl p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-muted">Start qiymət</div>
            <div className="mt-2 text-2xl font-semibold text-foreground">
              ₼ {activePackage.startingPrice.toLocaleString("en-US")}
            </div>
          </div>
          <div className="site-card-subtle rounded-2xl p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-muted">Müddət</div>
            <div className="mt-2 text-base font-semibold text-foreground">
              {activePresetSummary?.timelineLabel || "-"}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {(activePresetSummary?.includedModules ?? []).map((item, index) => (
            <div key={`${item}-${index}`} className="site-card-subtle rounded-2xl p-4 text-sm text-foreground">
              {item}
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}
