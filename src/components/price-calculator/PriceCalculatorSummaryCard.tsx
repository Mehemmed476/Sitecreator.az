import { Download, Gauge, MessageSquare } from "lucide-react";
import { getLocalizedText, type LocaleKey, type PriceCalculatorConfig } from "@/lib/price-calculator";
import { MANAT, type PriceCalculatorEstimate } from "@/lib/price-calculator-estimate";

export function PriceCalculatorSummaryCard({
  locale,
  copy,
  estimate,
  money,
  onScrollToLeadForm,
  onDownload,
  sticky = false,
}: {
  locale: LocaleKey;
  copy: PriceCalculatorConfig["copy"];
  estimate: PriceCalculatorEstimate;
  money: (value: number) => string;
  onScrollToLeadForm: () => void;
  onDownload: () => void;
  sticky?: boolean;
}) {
  return (
    <aside
      className={
        sticky
          ? "hidden md:sticky md:top-24 md:block"
          : "site-card-strong rounded-[2rem] p-6 sm:p-8 md:hidden"
      }
    >
      <div className={sticky ? "site-card-strong rounded-[2rem] p-6 sm:p-8" : ""}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="site-kicker">{getLocalizedText(locale, copy.leadBadge)}</p>
            <h2 className="mt-3 text-2xl font-bold">{getLocalizedText(locale, copy.summaryTitle)}</h2>
            <p className="mt-3 text-sm text-muted">{getLocalizedText(locale, copy.summaryDescription)}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Gauge className="h-5 w-5" />
          </div>
        </div>

        <div className="site-card-subtle mt-6 space-y-3 rounded-3xl p-5">
          <SummaryLine label={getLocalizedText(locale, estimate.service.name)} value={`${MANAT} ${money(estimate.service.basePrice)}`} />
          <SummaryLine label={getLocalizedText(locale, copy.overage)} value={`${MANAT} ${money(estimate.scopePrice)}`} />
          <SummaryLine label={getLocalizedText(locale, copy.designImpact)} value={`${MANAT} ${money(estimate.designImpact)}`} />
          <SummaryLine label={getLocalizedText(locale, copy.buildExtras)} value={`${MANAT} ${money(estimate.buildTotal)}`} />
          <SummaryLine label={getLocalizedText(locale, copy.seoExtras)} value={`${MANAT} ${money(estimate.seoTotal)}`} />
          <SummaryLine label={getLocalizedText(locale, copy.logoOption)} value={`${MANAT} ${money(estimate.logoTotal)}`} />

          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="text-base font-semibold text-foreground">{getLocalizedText(locale, copy.total)}</span>
            <span className="text-2xl font-bold text-primary">{MANAT} {money(estimate.total)}</span>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          <button type="button" onClick={onScrollToLeadForm} className="btn-primary justify-center text-sm">
            <MessageSquare className="h-4 w-4" />
            {getLocalizedText(locale, copy.requestButton)}
          </button>
          <button type="button" onClick={onDownload} className="btn-secondary justify-center text-sm">
            <Download className="h-4 w-4" />
            {getLocalizedText(locale, copy.downloadButton)}
          </button>
        </div>

        <div className="site-card-subtle mt-5 rounded-2xl px-4 py-3 text-sm text-muted">
          {getLocalizedText(locale, copy.monthlySupport)}: {MANAT} {money(estimate.monthlySupport)}
        </div>
        <p className="mt-3 text-sm text-muted">{getLocalizedText(locale, copy.vatNote)}</p>
      </div>
    </aside>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
