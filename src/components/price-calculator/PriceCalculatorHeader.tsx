import { getLocalizedText, type LocaleKey, type LocalizedText } from "@/lib/price-calculator";

export function PriceCalculatorHeader({
  locale,
  badge,
  title,
  description,
  steps,
}: {
  locale: LocaleKey;
  badge: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  steps: LocalizedText[];
}) {
  return (
    <div className="site-card-highlight relative overflow-hidden rounded-[2rem] p-8 sm:p-10">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-12 right-0 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-secondary/15 blur-3xl" />
      </div>

      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
        {getLocalizedText(locale, badge)}
      </p>
      <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">
        {getLocalizedText(locale, title)}
      </h1>
      <p className="mt-5 max-w-3xl text-base leading-7 text-muted sm:text-lg">
        {getLocalizedText(locale, description)}
      </p>

      <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((step, index) => (
          <div key={`${index}-${step.az}`} className="site-card-subtle rounded-2xl px-4 py-4">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Step 0{index + 1}
            </div>
            <div className="mt-2 text-sm font-medium text-foreground">
              {getLocalizedText(locale, step)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
