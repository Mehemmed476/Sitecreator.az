import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { ServiceListItem } from "@/lib/service-pages-store";
import type { ServiceLocale } from "@/lib/service-pages";

const ctaCopy: Record<ServiceLocale, string> = {
  az: "Detallara bax",
  en: "View details",
  ru: "Смотреть детали",
};

export function ServicesIndexPageContent({
  locale,
  services,
  badge,
  title,
  description,
}: {
  locale: ServiceLocale;
  services: ServiceListItem[];
  badge: string;
  title: string;
  description: string;
}) {
  const cta = ctaCopy[locale];

  return (
    <div className="site-section py-20 text-foreground sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="site-card-highlight rounded-[2rem] p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">{badge}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">{description}</p>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="site-card group rounded-[1.75rem] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-elevated"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {service.title}
                  </div>
                  <p className="text-sm leading-7 text-muted sm:text-base">{service.description}</p>
                </div>
                <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
              </div>

              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                {cta}
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
