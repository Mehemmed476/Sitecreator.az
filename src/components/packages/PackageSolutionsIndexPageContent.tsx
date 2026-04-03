import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { MANAT, formatMoneyValue } from "@/lib/price-calculator-estimate";
import type { PackageLocale } from "@/lib/package-solutions";
import type { PackageListItem } from "@/lib/package-solutions-store";

const ctaCopy: Record<PackageLocale, { details: string; calculator: string }> = {
  az: { details: "Detallara bax", calculator: "Fərdiləşdir" },
  en: { details: "View details", calculator: "Customize" },
  ru: { details: "Смотреть детали", calculator: "Настроить" },
};

export function PackageSolutionsIndexPageContent({
  locale,
  badge,
  title,
  description,
  packages,
}: {
  locale: PackageLocale;
  badge: string;
  title: string;
  description: string;
  packages: PackageListItem[];
}) {
  const copy = ctaCopy[locale];

  return (
    <div className="site-section py-20 text-foreground sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="site-card-highlight rounded-[2rem] p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">{badge}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-muted sm:text-lg">{description}</p>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          {packages.map((item) => (
            <article
              key={item.id}
              className="site-card group overflow-hidden rounded-[1.75rem] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-elevated"
            >
              <div className="relative aspect-[16/11] overflow-hidden">
                {item.coverImageUrl ? (
                  <Image
                    src={item.coverImageUrl}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-secondary/15 to-surface" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
              </div>

              <div className="p-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {MANAT} {formatMoneyValue(locale, item.startingPrice)}
                </div>

                <h2 className="mt-4 text-2xl font-bold tracking-tight">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted sm:text-base">{item.description}</p>

                <div className="mt-6 flex flex-col gap-3">
                  <Link href={`/packages/${item.slug}`} className="btn-primary w-full justify-center text-sm">
                    {copy.details}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/price-calculator" className="btn-secondary w-full justify-center text-sm">
                    {copy.calculator}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
