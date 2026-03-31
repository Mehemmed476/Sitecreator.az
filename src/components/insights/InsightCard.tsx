import Image from "next/image";
import { CalendarDays, Clock3, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { InsightLocale, InsightRecord } from "@/lib/insight-types";
import { estimateReadingTime, getInsightContent, getInsightCoverImage } from "@/lib/insight-utils";

export function InsightCard({
  insight,
  locale,
  priority = false,
}: {
  insight: InsightRecord;
  locale: string;
  priority?: boolean;
}) {
  const t = useTranslations("blog");
  const content = getInsightContent(insight, locale as InsightLocale);
  const coverImageUrl = getInsightCoverImage(insight, locale as InsightLocale);
  const readingTime = estimateReadingTime(content.content);
  const typeLabel = t(insight.type === "case-study" ? "typeCaseStudy" : "typeBlog");
  const publishedLabel = insight.publishedAt
    ? new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(insight.publishedAt))
    : null;

  return (
    <article className="site-card group overflow-hidden rounded-[28px] border border-border/80">
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        {coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt={content.title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.24),transparent_40%),linear-gradient(135deg,rgba(15,23,42,1),rgba(30,41,59,0.92))]" />
        )}

        <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-4">
          <span className="rounded-full border border-white/10 bg-black/45 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
            {typeLabel}
          </span>
          {insight.featured ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold text-amber-200">
              <Sparkles className="h-3 w-3" />
              {t("featuredBadge")}
            </span>
          ) : null}
        </div>
      </div>

      <div className="space-y-4 p-6">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
          {publishedLabel ? (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-primary" />
              {publishedLabel}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5 text-primary" />
            {t("readTime", { count: readingTime })}
          </span>
        </div>

        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            {content.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted">{content.excerpt}</p>
        </div>

        {content.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {content.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        <Link
          href={`/blog/${content.slug}`}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          {t("readMore")}
        </Link>
      </div>
    </article>
  );
}
