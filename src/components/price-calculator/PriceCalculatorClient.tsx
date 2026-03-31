"use client";

import { MessageSquare } from "lucide-react";
import { type LocaleKey, type PriceCalculatorConfig } from "@/lib/price-calculator";
import { PriceCalculatorBenefitsGrid } from "@/components/price-calculator/PriceCalculatorBenefitsGrid";
import { PriceCalculatorDetailsSection } from "@/components/price-calculator/PriceCalculatorDetailsSection";
import { PriceCalculatorExtrasSection } from "@/components/price-calculator/PriceCalculatorExtrasSection";
import { PriceCalculatorHeader } from "@/components/price-calculator/PriceCalculatorHeader";
import { PriceCalculatorLeadForm } from "@/components/price-calculator/PriceCalculatorLeadForm";
import { PriceCalculatorServiceSection } from "@/components/price-calculator/PriceCalculatorServiceSection";
import { PriceCalculatorSummaryCard } from "@/components/price-calculator/PriceCalculatorSummaryCard";
import { usePriceCalculator } from "@/components/price-calculator/usePriceCalculator";

export function PriceCalculatorClient({
  locale,
  config,
}: {
  locale: LocaleKey;
  config: PriceCalculatorConfig;
}) {
  const {
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
  } = usePriceCalculator({ locale, config });

  return (
    <section className="price-calculator-shell site-section py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6">
          <PriceCalculatorHeader
            locale={locale}
            badge={copy.badge}
            title={copy.title}
            description={copy.description}
            steps={steps}
          />

          <PriceCalculatorSummaryCard
            locale={locale}
            copy={copy}
            estimate={estimate}
            money={money}
            onScrollToLeadForm={scrollToLeadForm}
            onDownload={downloadSummary}
          />
        </div>

        <div className="mt-8 grid items-start gap-8 md:grid-cols-[minmax(0,_1fr)_340px] xl:grid-cols-[minmax(0,_1fr)_380px]">
          <div className="space-y-6">
            <PriceCalculatorServiceSection
              locale={locale}
              copy={copy}
              services={safeConfig.services}
              selections={selections}
              onServiceChange={(serviceId, defaultUnits) =>
                setSelections((prev) => ({ ...prev, serviceId, unitCount: defaultUnits }))
              }
            />

            <PriceCalculatorDetailsSection
              locale={locale}
              copy={copy}
              service={estimate.service}
              designOptions={safeConfig.designOptions}
              selections={selections}
              onUnitCountChange={(unitCount) => setSelections((prev) => ({ ...prev, unitCount }))}
              onDesignChange={(designId) => setSelections((prev) => ({ ...prev, designId }))}
            />

            <PriceCalculatorExtrasSection
              locale={locale}
              copy={copy}
              buildGroup={estimate.buildGroup}
              seoGroup={estimate.seoGroup}
              logoOptions={safeConfig.logoOptions}
              timelineOptions={safeConfig.timelineOptions}
              supportOptions={safeConfig.supportOptions}
              selections={selections}
              money={money}
              onSelectionsChange={setSelections}
            />

            <section className="site-card-soft rounded-[1.75rem] border border-primary/15 p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
                    Növbəti addım
                  </p>
                  <h3 className="text-xl font-semibold text-foreground">
                    Seçimləri bizə göndərmək üçün formu doldur
                  </h3>
                  <p className="text-sm leading-6 text-muted">
                    Seçdiyin bütün xidmət və əlavələr müraciətinə birlikdə əlavə olunacaq.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={scrollToLeadForm}
                  className="btn-primary shrink-0 justify-center text-sm"
                >
                  <MessageSquare className="h-4 w-4" />
                  Forma keç
                </button>
              </div>
            </section>

            <PriceCalculatorLeadForm
              locale={locale}
              copy={copy}
              form={form}
              setForm={setForm}
              status={status}
              onSubmit={handleSubmit}
            />

            <PriceCalculatorBenefitsGrid locale={locale} benefits={benefits} />
          </div>

          <div className="md:self-start">
            <PriceCalculatorSummaryCard
              locale={locale}
              copy={copy}
              estimate={estimate}
              money={money}
              onScrollToLeadForm={scrollToLeadForm}
              onDownload={downloadSummary}
              sticky
            />
          </div>
        </div>
      </div>
    </section>
  );
}
