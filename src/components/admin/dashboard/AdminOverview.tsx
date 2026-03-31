import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  Clock3,
  FolderKanban,
  LayoutGrid,
  Sparkles,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { AdminDashboardSummary } from "@/lib/admin-dashboard";

const pulseToneClass = {
  neutral: "border-white/8 bg-white/[0.03]",
  accent: "border-primary/20 bg-primary/[0.07]",
  success: "border-emerald-500/20 bg-emerald-500/[0.07]",
  danger: "border-rose-500/20 bg-rose-500/[0.07]",
} as const;

const actionToneClass = {
  neutral: "border-white/8 from-white/[0.04] to-white/[0.02]",
  accent: "border-primary/18 from-primary/[0.10] to-white/[0.02]",
  success: "border-emerald-500/18 from-emerald-500/[0.09] to-white/[0.02]",
  danger: "border-rose-500/18 from-rose-500/[0.10] to-white/[0.02]",
} as const;

const workspaceToneClass = {
  healthy: "border-emerald-500/18 bg-emerald-500/[0.05]",
  progress: "border-amber-500/18 bg-amber-500/[0.05]",
  attention: "border-rose-500/18 bg-rose-500/[0.05]",
} as const;

export function AdminOverview({ summary }: { summary: AdminDashboardSummary }) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.25fr,0.95fr]">
        <div className="admin-panel overflow-hidden rounded-[28px] p-6 sm:p-7">
          <div className="flex items-start justify-between gap-6">
            <div className="max-w-3xl">
              <p className="site-kicker">İdarəetmə mərkəzi</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-[34px]">
                Bu gün diqqət istəyən işləri bir ekrandan gör
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
                Dashboard artıq sadəcə statistika vermir. Satış axını, layihələr, məzmun və
                saytın hazır vəziyyəti üçün əvvəl nə etməli olduğunu göstərir.
              </p>
            </div>

            <div className="hidden rounded-[20px] border border-white/8 bg-white/[0.03] p-4 text-right xl:block">
              <p className="text-xs uppercase tracking-[0.24em] text-muted">Fokus</p>
              <p className="mt-3 text-lg font-semibold text-foreground">Control center</p>
              <p className="mt-1 max-w-[14rem] text-sm leading-6 text-muted">
                Lead, proposal, portal və məzmun axınını eyni paneldə bağla.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {summary.snapshots.map((snapshot) => (
              <div
                key={snapshot.label}
                className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4"
              >
                <p className="text-xs uppercase tracking-[0.22em] text-muted">{snapshot.label}</p>
                <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                  {snapshot.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-panel rounded-[28px] p-6">
          <div className="flex items-center gap-3">
            <span className="admin-action-icon">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Əməliyyat prioritetləri</p>
              <p className="mt-1 text-xs leading-5 text-muted">
                Günə haradan başlamağın daha doğru olduğunu göstərən qısa növbə.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {summary.pulse.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-start justify-between gap-4 rounded-[18px] border px-4 py-4 transition hover:-translate-y-0.5 hover:border-primary/25 ${pulseToneClass[item.tone]}`}
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.detail}</p>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {summary.actionLanes.map((lane) => (
          <Link
            key={lane.title}
            href={lane.href}
            className={`rounded-[24px] border bg-gradient-to-br p-6 transition hover:-translate-y-1 hover:border-primary/25 ${actionToneClass[lane.tone]}`}
          >
            <p className="text-xs uppercase tracking-[0.24em] text-muted">{lane.eyebrow}</p>
            <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground">{lane.title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted">{lane.detail}</p>

            <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/8 pt-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Status</p>
                <p className="mt-2 text-sm font-medium text-foreground">{lane.stat}</p>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                {lane.cta}
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.3fr,0.9fr]">
        <div className="admin-panel rounded-[28px] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="site-kicker">Modul sağlamlığı</p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                Hər iş sahəsinin vəziyyəti
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                Hər modulun hazır, riskli və ya irəliləmə tələb edən hissəsini bir baxışda gör.
              </p>
            </div>

            <span className="hidden rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-muted xl:inline-flex">
              6 əsas sahə
            </span>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {summary.workspaceHealth.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`rounded-[20px] border p-5 transition hover:-translate-y-0.5 hover:border-primary/25 ${workspaceToneClass[item.health]}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-foreground">{item.label}</p>
                    <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted" />
                </div>

                <div className="mt-5 border-t border-white/8 pt-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">Vəziyyət</p>
                  <p className="mt-2 text-sm font-semibold text-foreground">{item.stat}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.note}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="admin-panel rounded-[28px] p-6">
            <div className="flex items-center gap-3">
              <span className="admin-action-icon">
                <Clock3 className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Son aktivlik</p>
                <p className="mt-1 text-xs leading-5 text-muted">
                  Lead, layihə və məzmun tərəfində ən son nə baş verib.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {summary.recentActivity.length ? (
                summary.recentActivity.map((item) => (
                  <Link
                    key={`${item.kind}-${item.title}-${item.timestamp}`}
                    href={item.href}
                    className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4 transition hover:-translate-y-0.5 hover:border-primary/25"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                        {item.kind}
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted" />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-2 text-xs leading-5 text-muted">{item.meta}</p>
                  </Link>
                ))
              ) : (
                <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-8 text-sm text-muted">
                  Hələ aktivlik görünmür.
                </div>
              )}
            </div>
          </div>

          <div className="admin-panel rounded-[28px] p-6">
            <div className="flex items-center gap-3">
              <span className="admin-action-icon">
                <LayoutGrid className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Sürətli keçidlər</p>
                <p className="mt-1 text-xs leading-5 text-muted">
                  Gün içində ən çox qayıtdığın əməliyyatlara qısa yol.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <Link
                href="/admin/sales/messages"
                className="flex items-center justify-between rounded-[16px] border border-white/8 bg-white/[0.03] px-4 py-3.5 transition hover:border-primary/25"
              >
                <span className="text-sm font-medium text-foreground">Lead CRM</span>
                <ArrowRight className="h-4 w-4 text-muted" />
              </Link>
              <Link
                href="/admin/sales/projects"
                className="flex items-center justify-between rounded-[16px] border border-white/8 bg-white/[0.03] px-4 py-3.5 transition hover:border-primary/25"
              >
                <span className="text-sm font-medium text-foreground">Layihələr və proposal-lar</span>
                <ArrowRight className="h-4 w-4 text-muted" />
              </Link>
              <Link
                href="/admin/blog"
                className="flex items-center justify-between rounded-[16px] border border-white/8 bg-white/[0.03] px-4 py-3.5 transition hover:border-primary/25"
              >
                <span className="text-sm font-medium text-foreground">Bloq və SEO</span>
                <ArrowRight className="h-4 w-4 text-muted" />
              </Link>
              <Link
                href="/admin/analytics"
                className="flex items-center justify-between rounded-[16px] border border-white/8 bg-white/[0.03] px-4 py-3.5 transition hover:border-primary/25"
              >
                <span className="text-sm font-medium text-foreground">Analytics paneli</span>
                <ArrowRight className="h-4 w-4 text-muted" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="admin-panel rounded-[28px] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="site-kicker">Readiness checklist</p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
              Public tərəfə təsir edən əsas yoxlamalar
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Ana səhifə, analytics, portfolio və məzmun axınını yayına hazır saxlamaq üçün qısa
              checklist.
            </p>
          </div>

          <span className="hidden items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-muted xl:inline-flex">
            <FolderKanban className="h-3.5 w-3.5" />
            Launch readiness
          </span>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {summary.checklist.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-[20px] border border-white/8 bg-white/[0.03] p-5 transition hover:-translate-y-0.5 hover:border-primary/25"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
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
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.detail}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-4">
                <span className="inline-flex items-center gap-2 text-xs font-medium text-muted">
                  {!item.complete ? <AlertTriangle className="h-3.5 w-3.5" /> : null}
                  {item.complete ? "Hazırdır" : "Yoxlama lazımdır"}
                </span>
                <ArrowRight className="h-4 w-4 text-muted" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
