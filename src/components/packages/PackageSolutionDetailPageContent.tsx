import Image from "next/image";
import { CheckCircle2, Sparkles } from "lucide-react";
import { PackageLeadModalTrigger } from "@/components/packages/PackageLeadModalTrigger";
import { MANAT, formatMoneyValue } from "@/lib/price-calculator-estimate";
import type { PackagePresetSummary } from "@/lib/package-calculator-preset";
import {
  getLocalizedPackageContent,
  type PackageLocale,
  type PackageSolutionRecord,
} from "@/lib/package-solutions";

const sectionCopy: Record<
  PackageLocale,
  {
    price: string;
    included: string;
    overview: string;
    service: string;
    design: string;
    logo: string;
    support: string;
    duration: string;
    nextStep: string;
  }
> = {
  az: {
    price: "Start qiymət",
    included: "Nə daxildir?",
    overview: "Paket xülasəsi",
    service: "Xidmət",
    design: "Dizayn",
    logo: "Logo",
    support: "Dəstək",
    duration: "Müddət",
    nextStep: "Növbəti addım",
  },
  en: {
    price: "Starting price",
    included: "What is included?",
    overview: "Package overview",
    service: "Service",
    design: "Design",
    logo: "Logo",
    support: "Support",
    duration: "Timeline",
    nextStep: "Next step",
  },
  ru: {
    price: "Стартовая цена",
    included: "Что входит?",
    overview: "Обзор пакета",
    service: "Услуга",
    design: "Дизайн",
    logo: "Логотип",
    support: "Поддержка",
    duration: "Срок",
    nextStep: "Следующий шаг",
  },
};

export function PackageSolutionDetailPageContent({
  locale,
  pkg,
  presetSummary,
}: {
  locale: PackageLocale;
  pkg: PackageSolutionRecord;
  presetSummary: PackagePresetSummary;
}) {
  const content = getLocalizedPackageContent(pkg, locale);
  const labels = sectionCopy[locale];

  return (
    <div className="site-section py-20 text-foreground sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="site-card-highlight overflow-hidden rounded-[2rem]">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
            <div className="p-8 sm:p-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  {content.heroBadge}
                </span>
                <span className="rounded-full border border-border/70 bg-surface/70 px-4 py-1.5 text-xs font-medium text-muted">
                  {pkg.category}
                </span>
              </div>

              <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
                {content.heroTitle}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-muted sm:text-lg">
                {content.heroDescription}
              </p>

              <div className="mt-8">
                <PackageLeadModalTrigger
                  locale={locale}
                  pkg={pkg}
                  title={content.cardTitle}
                  primaryCta={content.primaryCta}
                  secondaryCta={content.secondaryCta}
                />
              </div>
            </div>

            <div className="relative min-h-[320px]">
              {pkg.coverImageUrl ? (
                <Image
                  src={pkg.coverImageUrl}
                  alt={content.cardTitle}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 42vw, 100vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-secondary/15 to-surface" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/35 to-transparent" />
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
          <div className="space-y-6">
            <article className="site-card rounded-[1.75rem] p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                    {labels.overview}
                  </p>
                </div>
              </div>
              <p className="mt-5 text-base leading-7 text-muted">{content.cardDescription}</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {[
                  { label: labels.service, value: `${presetSummary.serviceName} · ${presetSummary.unitCount} ${presetSummary.unitLabel.toLowerCase()}` },
                  { label: labels.design, value: presetSummary.designLabel },
                  { label: labels.logo, value: presetSummary.logoLabel },
                  { label: labels.support, value: presetSummary.supportLabel },
                  { label: labels.duration, value: presetSummary.timelineLabel },
                ].map((item) => (
                  <div key={item.label} className="site-card-soft rounded-2xl p-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{item.label}</div>
                    <div className="mt-2 text-base font-semibold text-foreground">{item.value}</div>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="space-y-6">
            <article className="site-card rounded-[1.75rem] p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{labels.price}</p>
              <div className="mt-2 text-4xl font-bold tracking-tight">
                {MANAT} {formatMoneyValue(locale, pkg.startingPrice)}
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">{presetSummary.timelineLabel}</p>

              <div className="mt-6 border-t border-border/80 pt-6">
                <h2 className="text-xl font-bold">{labels.included}</h2>
                <ul className="mt-4 space-y-3">
                  {presetSummary.includedModules.map((item, index) => (
                    <li key={`${item}-${index}`} className="site-card-soft flex gap-3 rounded-2xl p-4 text-sm leading-6 text-muted">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            <article className="site-card rounded-[1.75rem] p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{labels.nextStep}</p>
              <h2 className="mt-1 text-2xl font-bold">{content.primaryCta}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{content.heroDescription}</p>
              <div className="mt-6 rounded-2xl border border-border/70 bg-surface/40 p-5">
                <PackageLeadModalTrigger
                  locale={locale}
                  pkg={pkg}
                  title={content.cardTitle}
                  primaryCta={content.primaryCta}
                  secondaryCta={content.secondaryCta}
                />
              </div>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}
