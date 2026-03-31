import { Link } from "@/i18n/navigation";
import { formatMoneyValue } from "@/lib/price-calculator-estimate";

export function ClientPortalOverview({
  locale,
  data,
}: {
  locale: "az" | "en" | "ru";
  data: NonNullable<
    Awaited<ReturnType<typeof import("@/lib/client-portal").getClientPortalOverview>>
  >;
}) {
  return (
    <div className="space-y-6">
      <section className="site-card-highlight rounded-[28px] p-7 sm:p-8">
        <p className="site-kicker">Panel</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Layihə və təklifləriniz</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
          Burada sizin üçün hazırlanmış təklifləri, aktiv layihələri və aylıq dəstək dəyərlərini
          izləyə bilərsiniz.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="site-card-soft rounded-2xl px-5 py-5">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Təkliflər</p>
            <p className="mt-3 text-3xl font-semibold">{data.proposals.length}</p>
          </div>
          <div className="site-card-soft rounded-2xl px-5 py-5">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Layihələr</p>
            <p className="mt-3 text-3xl font-semibold">{data.projects.length}</p>
          </div>
          <div className="site-card-soft rounded-2xl px-5 py-5">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Şirkət</p>
            <p className="mt-3 text-lg font-semibold">{data.client.company || "—"}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="site-card rounded-[28px] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Təkliflər</h2>
              <p className="mt-1 text-sm text-muted">Sizə təqdim olunan büdcə və xidmət xülasəsi.</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {data.proposals.length ? (
              data.proposals.map((proposal) => (
                <Link
                  key={proposal._id.toString()}
                  href={`/portal/proposals/${proposal._id.toString()}`}
                  locale={locale}
                  className="site-card-soft flex items-start justify-between rounded-2xl px-4 py-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{proposal.title}</p>
                    <p className="mt-1 text-xs text-muted">
                      {proposal.proposalNumber} • {proposal.serviceName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary">₼ {formatMoneyValue(locale, proposal.total)}</p>
                    <p className="mt-1 text-xs text-muted">{proposal.status}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="site-card-soft rounded-2xl px-4 py-8 text-sm text-muted">
                Hələ təklif yaradılmayıb.
              </div>
            )}
          </div>
        </div>

        <div className="site-card rounded-[28px] p-6">
          <div>
            <h2 className="text-xl font-semibold">Aktiv layihələr</h2>
            <p className="mt-1 text-sm text-muted">Hazırkı mərhələləri və dəstək dəyərini yoxlayın.</p>
          </div>

          <div className="mt-5 space-y-3">
            {data.projects.length ? (
              data.projects.map((project) => (
                <Link
                  key={project._id.toString()}
                  href={`/portal/projects/${project._id.toString()}`}
                  locale={locale}
                  className="site-card-soft flex items-start justify-between rounded-2xl px-4 py-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{project.title}</p>
                    <p className="mt-1 text-xs text-muted">
                      {project.serviceName} • {project.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary">₼ {formatMoneyValue(locale, project.total)}</p>
                    <p className="mt-1 text-xs text-muted">
                      Aylıq dəstək: ₼ {formatMoneyValue(locale, project.monthlySupport)}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="site-card-soft rounded-2xl px-4 py-8 text-sm text-muted">
                Hələ layihə yaradılmayıb.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
