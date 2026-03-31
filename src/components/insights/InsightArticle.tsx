import Image from "next/image";
import { CalendarDays, Clock3, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { InsightLocale, InsightRecord } from "@/lib/insight-types";
import {
  estimateReadingTime,
  getInsightContent,
  getInsightCoverImage,
  splitInsightContentIntoBlocks,
} from "@/lib/insight-utils";

export function InsightArticle({
  insight,
  locale,
}: {
  insight: InsightRecord;
  locale: string;
}) {
  const t = useTranslations("blog");
  const content = getInsightContent(insight, locale as InsightLocale);
  const coverImageUrl = getInsightCoverImage(insight, locale as InsightLocale);
  const readingTime = estimateReadingTime(content.content);
  const blocks = splitInsightContentIntoBlocks(content.content);
  const typeLabel = t(insight.type === "case-study" ? "typeCaseStudy" : "typeBlog");
  const publishedLabel = insight.publishedAt
    ? new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(insight.publishedAt))
    : null;

  return (
    <article className="site-section py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="site-card-strong rounded-[36px] border border-border/70 px-6 py-8 sm:px-10 sm:py-12">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-primary/15 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              {typeLabel}
            </span>
            {insight.featured ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
                <Sparkles className="h-3.5 w-3.5" />
                {t("featuredBadge")}
              </span>
            ) : null}
          </div>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {content.title}
          </h1>
          <p className="mt-4 text-base leading-8 text-muted sm:text-lg">{content.excerpt}</p>

          <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-muted">
            {publishedLabel ? (
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                {publishedLabel}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-primary" />
              {t("readTime", { count: readingTime })}
            </span>
          </div>

          {coverImageUrl ? (
            <div className="relative mt-8 aspect-[16/8] overflow-hidden rounded-[28px] border border-border/80">
              <Image
                src={coverImageUrl}
                alt={content.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          ) : null}

          <div className="prose prose-invert mt-10 max-w-none">
            <div className="space-y-6">
              {blocks.map((block, index) => {
                if (block.type === "heading") {
                  return (
                    <h2 key={index} className="text-2xl font-semibold tracking-tight text-foreground">
                      {block.content}
                    </h2>
                  );
                }

                if (block.type === "subheading") {
                  return (
                    <h3 key={index} className="text-xl font-semibold tracking-tight text-foreground">
                      {block.content}
                    </h3>
                  );
                }

                if (block.type === "list") {
                  return (
                    <ul key={index} className="space-y-3 pl-5 text-base leading-8 text-muted">
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  );
                }

                return (
                  <p key={index} className="text-base leading-8 text-muted">
                    {block.content}
                  </p>
                );
              })}
            </div>
          </div>

          {content.tags.length > 0 ? (
            <div className="mt-10 flex flex-wrap gap-2">
              {content.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <section className="site-card-soft mt-10 rounded-[30px] border border-border/70 px-6 py-8 sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="site-kicker">{t("ctaEyebrow")}</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
                {t("ctaTitle")}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted">{t("ctaDescription")}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/price-calculator" className="btn-primary text-sm">
                {t("ctaPrimary")}
              </Link>
              <Link href="/contact" className="btn-secondary text-sm">
                {t("ctaSecondary")}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}
