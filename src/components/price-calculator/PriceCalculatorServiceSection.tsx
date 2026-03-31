import type { ReactNode } from "react";
import { BriefcaseBusiness, CheckCircle2, Globe2, Settings2, ShoppingCart, Smartphone } from "lucide-react";
import { getLocalizedText, type LocaleKey, type PriceCalculatorConfig } from "@/lib/price-calculator";
import { getMoneyFormatter, type PriceCalculatorSelections } from "@/lib/price-calculator-estimate";

const MANAT = "\u20BC";

const serviceIcons = {
  website: Globe2,
  ecommerce: ShoppingCart,
  "mobile-app": Smartphone,
  "custom-system": Settings2,
} as const;

function getStartingPriceLabel(locale: LocaleKey, value: number) {
  const amount = getMoneyFormatter(locale)(value);

  if (locale === "en") {
    return `from ${MANAT} ${amount}`;
  }

  if (locale === "ru") {
    return `от ${MANAT} ${amount}`;
  }

  return `${MANAT} ${amount}-dən`;
}

export function PriceCalculatorServiceSection({
  locale,
  copy,
  services,
  selections,
  onServiceChange,
}: {
  locale: LocaleKey;
  copy: PriceCalculatorConfig["copy"];
  services: PriceCalculatorConfig["services"];
  selections: PriceCalculatorSelections;
  onServiceChange: (serviceId: PriceCalculatorSelections["serviceId"], defaultUnits: number) => void;
}) {
  return (
    <section className="site-card-strong rounded-[2rem] p-6 sm:p-8">
      <SectionHeader
        step="01"
        title={getLocalizedText(locale, copy.serviceTitle)}
        description={getLocalizedText(locale, copy.serviceDescription)}
        icon={<BriefcaseBusiness className="h-5 w-5" />}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {services.map((item) => {
          const Icon = serviceIcons[item.id];
          const active = item.id === selections.serviceId;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onServiceChange(item.id, item.defaultUnits)}
              className={`rounded-3xl p-5 text-left transition-all duration-200 ${
                active ? "site-card-selected shadow-lg shadow-primary/10" : "site-card-subtle"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${active ? "bg-primary text-white" : "bg-primary/10 text-primary"}`}>
                  <Icon className="h-5 w-5" />
                </div>
                {active ? <CheckCircle2 className="h-5 w-5 text-primary" /> : null}
              </div>
              <h3 className="mt-4 text-xl font-semibold">{getLocalizedText(locale, item.name)}</h3>
              <p className="mt-2 text-sm text-muted">{getLocalizedText(locale, item.note)}</p>
              <div className="mt-4 text-sm font-semibold text-primary">
                {getStartingPriceLabel(locale, item.basePrice)}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function SectionHeader({
  step,
  title,
  description,
  icon,
}: {
  step: string;
  title: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <div className="mb-6 flex items-start gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <p className="site-kicker">{step}</p>
        <h2 className="mt-2 text-2xl font-bold">{title}</h2>
        <p className="mt-3 max-w-2xl text-muted">{description}</p>
      </div>
    </div>
  );
}
