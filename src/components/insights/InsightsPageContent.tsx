import { Newspaper, Rocket, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { InsightsGrid } from "@/components/insights/InsightsGrid";
import type { InsightRecord } from "@/lib/insight-types";

export function InsightsPageContent({
  insights,
  locale,
}: {
  insights: InsightRecord[];
  locale: string;
}) {
  const t = useTranslations("blog");
  const featured = insights.filter((item) => item.featured);
  const caseStudies = insights.filter((item) => item.type === "case-study");
  const articles = insights.filter((item) => item.type === "blog");

  return (
    <section className="site-section py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="site-card-strong overflow-hidden rounded-[36px] border border-border/70 px-6 py-8 sm:px-8 sm:py-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.8fr)] lg:items-end">
            <div className="max-w-3xl">
              <p className="site-kicker">{t("badge")}</p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {t("title")}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-muted sm:text-lg">
                {t("description")}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/price-calculator" className="btn-primary text-sm">
                  {t("ctaPrimary")}
                </Link>
                <Link href="/contact" className="btn-secondary text-sm">
                  {t("ctaSecondary")}
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="site-card-soft rounded-[24px] p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Newspaper className="h-4 w-4 text-primary" />
                  {t("statArticles")}
                </div>
                <p className="mt-3 text-3xl font-bold">{articles.length}</p>
              </div>
              <div className="site-card-soft rounded-[24px] p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  {t("statCaseStudies")}
                </div>
                <p className="mt-3 text-3xl font-bold">{caseStudies.length}</p>
              </div>
              <div className="site-card-soft rounded-[24px] p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Rocket className="h-4 w-4 text-primary" />
                  {t("statFeatured")}
                </div>
                <p className="mt-3 text-3xl font-bold">{featured.length}</p>
              </div>
              <div className="site-card-soft rounded-[24px] p-5 sm:col-span-3 lg:col-span-1">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Rocket className="h-4 w-4 text-primary" />
                  {t("statLocales")}
                </div>
                <p className="mt-3 text-3xl font-bold">3</p>
              </div>
            </div>
          </div>
        </div>

        {insights.length === 0 ? (
          <div className="site-card-soft mt-12 rounded-[28px] px-6 py-16 text-center">
            <p className="text-2xl font-semibold text-foreground">{t("emptyTitle")}</p>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted">
              {t("emptyDescription")}
            </p>
          </div>
        ) : null}

        {featured.length > 0 ? (
          <section className="mt-14">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="site-kicker">{t("featuredEyebrow")}</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                  {t("featuredTitle")}
                </h2>
              </div>
            </div>
            <InsightsGrid insights={featured.slice(0, 2)} locale={locale} />
          </section>
        ) : null}

        {caseStudies.length > 0 ? (
          <section className="mt-16">
            <div className="mb-6">
              <p className="site-kicker">{t("caseStudiesEyebrow")}</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                {t("caseStudiesTitle")}
              </h2>
            </div>
            <InsightsGrid insights={caseStudies} locale={locale} />
          </section>
        ) : null}

        {articles.length > 0 ? (
          <section className="mt-16">
            <div className="mb-6">
              <p className="site-kicker">{t("articlesEyebrow")}</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                {t("articlesTitle")}
              </h2>
            </div>
            <InsightsGrid insights={articles} locale={locale} />
          </section>
        ) : null}
      </div>
    </section>
  );
}
