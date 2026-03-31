import { ArrowRight, CheckCircle2, CircleDashed, Layers3, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  getLocalizedServiceContent,
  type ServiceLocale,
  type ServicePageRecord,
} from "@/lib/service-pages";

const secondaryLabels: Record<ServiceLocale, { deliverables: string; process: string; faq: string }> = {
  az: { deliverables: "Təhvil hissələri", process: "Mərhələlər", faq: "FAQ" },
  en: { deliverables: "Deliverables", process: "Process", faq: "FAQ" },
  ru: { deliverables: "Что входит", process: "Этапы", faq: "FAQ" },
};

export function ServiceDetailPageContent({
  locale,
  service,
}: {
  locale: ServiceLocale;
  service: ServicePageRecord;
}) {
  const content = getLocalizedServiceContent(service, locale);
  const labels = secondaryLabels[locale];

  return (
    <div className="site-section py-20 text-foreground sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="site-card-highlight rounded-[2rem] p-8 sm:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              {content.heroBadge}
            </span>
            <span className="rounded-full border border-border/80 bg-surface/70 px-4 py-1.5 text-xs font-medium text-muted">
              {content.cardTitle}
            </span>
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">
            {content.heroTitle}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-muted sm:text-lg">
            {content.heroDescription}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/price-calculator" className="btn-primary text-base">
              {content.primaryCta}
            </Link>
            <Link href="/contact" className="btn-secondary text-base">
              {content.secondaryCta}
            </Link>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
          <div className="space-y-6">
            <article className="site-card rounded-[1.75rem] p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                    {content.overviewTitle}
                  </p>
                </div>
              </div>
              <p className="mt-5 text-base leading-7 text-muted">{content.overviewDescription}</p>
            </article>

            <article className="site-card rounded-[1.75rem] p-7">
              <h2 className="text-2xl font-bold">{content.outcomesTitle}</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {content.outcomes.map((item, index) => (
                  <div key={`${item.title}-${index}`} className="site-card-soft rounded-2xl p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="site-card rounded-[1.75rem] p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <CircleDashed className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                    {labels.process}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold">{content.processTitle}</h2>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {content.processSteps.map((step, index) => (
                  <div key={`${step.title}-${index}`} className="site-card-soft rounded-2xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-sm font-semibold text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{step.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-muted">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="space-y-6">
            <article className="site-card rounded-[1.75rem] p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Layers3 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                    {labels.deliverables}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold">{content.deliverablesTitle}</h2>
                </div>
              </div>
              <ul className="mt-6 space-y-3">
                {content.deliverables.map((item, index) => (
                  <li key={`${item}-${index}`} className="site-card-soft flex gap-3 rounded-2xl p-4 text-sm leading-6 text-muted">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="site-card rounded-[1.75rem] p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                {labels.faq}
              </p>
              <h2 className="mt-1 text-2xl font-bold">{content.faqTitle}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{content.faqDescription}</p>

              <div className="mt-6 space-y-4">
                {content.faqItems.map((item, index) => (
                  <div key={`${item.question}-${index}`} className="site-card-soft rounded-2xl p-5">
                    <h3 className="text-base font-semibold">{item.question}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{item.answer}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="mt-10 site-card-highlight rounded-[2rem] p-8 sm:p-10">
          <h2 className="text-3xl font-bold tracking-tight">{content.finalCtaTitle}</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted sm:text-lg">
            {content.finalCtaDescription}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/contact" className="btn-primary text-base">
              {content.secondaryCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/price-calculator" className="btn-secondary text-base">
              {content.primaryCta}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
