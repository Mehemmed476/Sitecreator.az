import { Activity, ArrowRight, CheckCircle2, CircleDashed, FolderKanban, Inbox } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { AdminDashboardSummary } from "@/lib/admin-dashboard";

const metricToneClass = {
  neutral: "border-border bg-surface/50",
  accent: "border-primary/20 bg-primary/6",
  success: "border-emerald-500/20 bg-emerald-500/6",
} as const;

export function AdminOverview({ summary }: { summary: AdminDashboardSummary }) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.4fr,0.9fr]">
        <div className="admin-panel rounded-[24px] p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="max-w-3xl">
              <p className="site-kicker">Ümumi baxış</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-[34px]">
                Bütün saytı daha rahat idarə et
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
                Əvvəl nəyin diqqət tələb etdiyini gör, sonra uzun admin səhifəsi gəzmədən doğru modula keç.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link href="/admin/sales/messages" className="admin-action-card rounded-[18px] px-4 py-3.5">
              <div className="flex items-center gap-3">
                <span className="admin-action-icon">
                  <Inbox className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Yeni müraciətlərə bax</p>
                  <p className="mt-1 text-xs text-muted">Birbaşa mesaj qutusuna keç.</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted" />
            </Link>

            <Link href="/admin/blog" className="admin-action-card rounded-[18px] px-4 py-3.5">
              <div className="flex items-center gap-3">
                <span className="admin-action-icon">
                  <Activity className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold">SEO məzmunu paylaş</p>
                  <p className="mt-1 text-xs text-muted">Çoxdilli məqalələrlə görünürlüğü artır.</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted" />
            </Link>
          </div>
        </div>

        <div className="admin-panel rounded-[24px] p-6">
          <div className="flex items-center gap-3">
            <span className="admin-action-icon">
              <FolderKanban className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">Sürətli modul xəritəsi</p>
              <p className="mt-1 text-xs text-muted">Axtarmadan istədiyin bölməni aç.</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {summary.modules.slice(0, 4).map((module) => (
              <Link key={module.label} href={module.href} className="admin-module-row rounded-[16px] px-4 py-3.5">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{module.label}</p>
                  <p className="mt-1 text-xs leading-5 text-muted">{module.description}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs font-semibold text-primary">{module.stat}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">Aç</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summary.metrics.map((metric) => (
          <div
            key={metric.label}
            className={`admin-metric-card rounded-[20px] border p-5 ${metricToneClass[metric.tone]}`}
          >
            <p className="text-xs uppercase tracking-[0.24em] text-muted">{metric.label}</p>
            <p className="mt-4 text-2xl font-bold tracking-tight">{metric.value}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{metric.note}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr,1.1fr,0.9fr]">
        <div className="admin-panel rounded-[24px] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Son mesajlar</h3>
              <p className="mt-1 text-sm text-muted">Mesaj qutusuna gələn son əlaqə müraciətləri.</p>
            </div>
            <Link href="/admin/sales/messages" className="text-sm font-medium text-primary">
              Hamısına bax
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {summary.recentMessages.length ? (
              summary.recentMessages.map((message) => (
                <Link
                  key={`${message.title}-${message.meta}`}
                  href={message.href}
                  className="admin-feed-item rounded-[16px] px-4 py-3.5"
                >
                  <p className="text-sm font-semibold">{message.title}</p>
                  <p className="mt-1 text-xs leading-5 text-muted">{message.meta}</p>
                </Link>
              ))
            ) : (
              <div className="admin-empty-slot rounded-[16px] px-4 py-8 text-sm text-muted">
                Hələ mesaj yoxdur.
              </div>
            )}
          </div>
        </div>

        <div className="admin-panel rounded-[24px] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Son məqalə fəaliyyəti</h3>
              <p className="mt-1 text-sm text-muted">Bloq və SEO bölməsində son yenilənənləri gör.</p>
            </div>
            <Link href="/admin/blog" className="text-sm font-medium text-primary">
              Editora keç
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {summary.recentPosts.length ? (
              summary.recentPosts.map((item) => (
                <Link
                  key={`${item.title}-${item.meta}`}
                  href={item.href}
                  className="admin-feed-item rounded-[16px] px-4 py-3.5"
                >
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-muted">{item.meta}</p>
                </Link>
              ))
            ) : (
              <div className="admin-empty-slot rounded-[16px] px-4 py-8 text-sm text-muted">
                Hələ məqalə yoxdur.
              </div>
            )}
          </div>
        </div>

        <div className="admin-panel rounded-[24px] p-6">
          <div>
            <h3 className="text-lg font-semibold">Saytın hazır vəziyyəti</h3>
            <p className="mt-1 text-sm text-muted">
              Saytın görünən hissələri üçün qısa yoxlama siyahısı.
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {summary.checklist.map((item) => (
              <div key={item.label} className="admin-check-item rounded-[16px] px-4 py-3.5">
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      item.complete
                        ? "bg-emerald-500/12 text-emerald-300"
                        : "bg-amber-500/12 text-amber-300"
                    }`}
                  >
                    {item.complete ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <CircleDashed className="h-4 w-4" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="mt-1 text-xs leading-5 text-muted">{item.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="admin-panel rounded-[24px] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Modul keçidləri</h3>
            <p className="mt-1 text-sm text-muted">
              Lazım olan admin bölməsinə daha rahat keç.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {summary.modules.map((module) => (
            <Link key={module.label} href={module.href} className="admin-shortcut-card rounded-[18px] p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-base font-semibold">{module.label}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{module.description}</p>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted" />
              </div>
              <div className="mt-4 border-t border-white/6 pt-4">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Vəziyyət</p>
                <p className="mt-2 text-sm font-semibold text-primary">{module.stat}</p>
                <p className="mt-1 text-xs leading-5 text-muted">{module.note}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
