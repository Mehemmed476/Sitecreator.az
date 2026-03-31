import { BarChart3, ChartNoAxesCombined, Globe2, MousePointerClick } from "lucide-react";
import type { AnalyticsSummary } from "@/lib/analytics";

const iconMap = [Globe2, ChartNoAxesCombined, MousePointerClick, BarChart3];

export function AdminAnalytics({ summary }: { summary: AnalyticsSummary }) {
  return (
    <div className="space-y-6">
      <section className="admin-panel rounded-[24px] p-6 sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="site-kicker">Google Analytics 4</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-[34px]">
              Sayt trafikini birbaşa admin paneldən izləyin
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
              Public saytın sessiya, istifadəçi, səhifə baxışı və əsas trafik kanalları bu paneldə toplanır.
            </p>
          </div>

          <div className="rounded-[18px] border border-primary/15 bg-primary/8 px-4 py-3 text-sm text-primary">
            <p className="font-semibold">Measurement ID</p>
            <p className="mt-1 text-foreground">{summary.measurementId}</p>
            {summary.propertyId ? (
              <p className="mt-2 text-xs text-muted">Property: {summary.propertyId}</p>
            ) : null}
          </div>
        </div>
      </section>

      {!summary.reportingReady ? (
        <section className="admin-panel rounded-[24px] p-6">
          <h3 className="text-lg font-semibold">GA4 Data API hələ tamam qurulmayıb</h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
            Tracking aktivdir, amma admin içində statistikaları çəkmək üçün serverdə əlavə env-lər lazımdır:
            <span className="mt-2 block font-mono text-xs text-foreground">
              GA4_PROPERTY_ID, GA4_CLIENT_EMAIL, GA4_PRIVATE_KEY
            </span>
          </p>
          {summary.error ? (
            <div className="mt-4 rounded-[18px] border border-amber-500/20 bg-amber-500/8 px-4 py-3 text-sm text-amber-200">
              {summary.error}
            </div>
          ) : null}
        </section>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {summary.metrics.map((metric, index) => {
              const Icon = iconMap[index] ?? BarChart3;
              return (
                <div key={metric.label} className="admin-panel-soft rounded-[20px] p-5">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted">
                    <Icon className="h-4 w-4 text-primary" />
                    {metric.label}
                  </div>
                  <p className="mt-4 text-3xl font-bold tracking-tight">{metric.value}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{metric.note}</p>
                </div>
              );
            })}
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.05fr,0.95fr]">
            <div className="admin-panel rounded-[24px] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Ən çox baxılan səhifələr</h3>
                  <p className="mt-1 text-sm text-muted">{summary.rangeLabel} üzrə top page-lər.</p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {summary.topPages.length ? (
                  summary.topPages.map((item) => (
                    <div key={item.path} className="admin-module-row rounded-[16px] px-4 py-3.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{item.path}</p>
                        <p className="mt-1 text-xs text-muted">Public route</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-semibold text-primary">{item.views}</p>
                        <p className="mt-1 text-[11px] text-muted-foreground">views</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="admin-empty-slot rounded-[16px] px-4 py-8 text-sm text-muted">
                    Hələ page view məlumatı görünmür.
                  </div>
                )}
              </div>
            </div>

            <div className="admin-panel rounded-[24px] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Trafik kanalları</h3>
                  <p className="mt-1 text-sm text-muted">{summary.rangeLabel} üzrə əsas mənbələr.</p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {summary.trafficSources.length ? (
                  summary.trafficSources.map((item) => (
                    <div key={item.source} className="admin-feed-item rounded-[16px] px-4 py-3.5">
                      <p className="text-sm font-semibold">{item.source}</p>
                      <p className="mt-1 text-xs text-muted">Session default channel group</p>
                      <div className="mt-3 text-sm font-semibold text-primary">{item.sessions} sessions</div>
                    </div>
                  ))
                ) : (
                  <div className="admin-empty-slot rounded-[16px] px-4 py-8 text-sm text-muted">
                    Hələ trafik kanal məlumatı görünmür.
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
