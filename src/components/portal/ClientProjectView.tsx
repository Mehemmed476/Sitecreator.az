import { formatMoneyValue } from "@/lib/price-calculator-estimate";
import { Link } from "@/i18n/navigation";

function getProjectStatusLabel(status: string) {
  switch (status) {
    case "new":
      return "Yeni";
    case "planning":
      return "Planlama";
    case "in_progress":
      return "İcradadır";
    case "review":
      return "Yoxlanılır";
    case "completed":
      return "Tamamlandı";
    default:
      return status;
  }
}

function getProjectSummary(project: {
  summary?: string;
  serviceName?: string;
  total: number;
  timelineLabel?: string;
}) {
  if (project.summary && !project.summary.includes("Service:")) {
    return project.summary;
  }

  return `${project.serviceName || "Layihə"} üzrə iş axını başladılıb. Təxmini büdcə ₼ ${project.total} və timeline ${project.timelineLabel || "standart"} kimi planlaşdırılıb. Aşağıda mərhələləri izləyə bilərsiniz.`;
}

export function ClientProjectView({
  locale,
  project,
}: {
  locale: "az" | "en" | "ru";
  project: NonNullable<
    Awaited<ReturnType<typeof import("@/lib/client-portal").getClientProjectDetail>>
  >;
}) {
  return (
    <div className="space-y-6">
      <section className="site-card-highlight rounded-[28px] p-7 sm:p-8">
        <p className="site-kicker">Layihə</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">{project.title}</h1>
        <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
          {getProjectSummary(project)}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="site-card-soft rounded-2xl px-5 py-5">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Status</p>
            <p className="mt-3 text-lg font-semibold">{getProjectStatusLabel(project.status)}</p>
          </div>
          <div className="site-card-soft rounded-2xl px-5 py-5">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Xidmət</p>
            <p className="mt-3 text-lg font-semibold">{project.serviceName}</p>
          </div>
          <div className="site-card-soft rounded-2xl px-5 py-5">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Büdcə</p>
            <p className="mt-3 text-lg font-semibold">
              ₼ {formatMoneyValue(locale, project.total)}
            </p>
          </div>
          <div className="site-card-soft rounded-2xl px-5 py-5">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Dəstək</p>
            <p className="mt-3 text-lg font-semibold">
              ₼ {formatMoneyValue(locale, project.monthlySupport)}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <div className="site-card rounded-[28px] p-6">
          <h2 className="text-xl font-semibold">Mərhələlər</h2>
          <div className="mt-5 space-y-3">
            {project.milestones.map((item, index) => (
              <div key={`${item.label}-${index}`} className="site-card-soft rounded-2xl px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      item.done ? "bg-emerald-500/15 text-emerald-300" : "bg-white/8 text-muted"
                    }`}
                  >
                    {item.done ? "Tamamlandı" : "Gözləyir"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="site-card rounded-[28px] p-6">
          <h2 className="text-xl font-semibold">Qısa məlumat</h2>
          <div className="mt-5 space-y-3 text-sm text-muted">
            <div className="rounded-2xl border border-border px-4 py-3">
              Timeline: {project.timelineLabel || "Standart"}
            </div>
            <div className="rounded-2xl border border-border px-4 py-3">
              Təklif ID: {project.proposalId?._id?.toString?.() || "-"}
            </div>
            <div className="rounded-2xl border border-border px-4 py-3">
              Son yenilənmə: {new Date(project.updatedAt).toLocaleDateString("az-AZ")}
            </div>
          </div>
        </div>
      </section>

      <section className="site-card rounded-[28px] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Layihə chatı</h2>
            <p className="mt-2 text-sm text-muted">
              Komanda ilə yazışma, foto və fayl paylaşımı üçün ayrıca chat səhifəsini açın.
            </p>
          </div>
          <Link href="/portal/chat" className="btn-primary text-sm">
            Chat səhifəsini aç
          </Link>
        </div>
      </section>
    </div>
  );
}
