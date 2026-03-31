import { formatMoneyValue } from "@/lib/price-calculator-estimate";

function getProposalStatusLabel(status: string) {
  switch (status) {
    case "draft":
      return "Hazırlanır";
    case "sent":
      return "Göndərildi";
    case "approved":
      return "Təsdiqləndi";
    case "rejected":
      return "Rədd edildi";
    default:
      return status;
  }
}

function getClientFacingSummary(proposal: {
  summary?: string;
  serviceName?: string;
  total: number;
  monthlySupport: number;
}) {
  if (proposal.summary && !proposal.summary.includes("Service:")) {
    return proposal.summary;
  }

  return `${proposal.serviceName || "Layihə"} üçün ilkin təklif hazırdır. Aşağıda qiymət breakdown-u və aylıq dəstək məlumatı səliqəli şəkildə göstərilir.`;
}

export function ClientProposalView({
  locale,
  proposal,
}: {
  locale: "az" | "en" | "ru";
  proposal: NonNullable<
    Awaited<ReturnType<typeof import("@/lib/client-portal").getClientProposalDetail>>
  >;
}) {
  return (
    <div className="space-y-6">
      <section className="site-card-highlight rounded-[28px] p-7 sm:p-8">
        <p className="site-kicker">Təklif</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">{proposal.title}</h1>
        <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
          {getClientFacingSummary(proposal)}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="site-card-soft rounded-2xl px-5 py-5">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Təklif nömrəsi
            </p>
            <p className="mt-3 text-lg font-semibold">{proposal.proposalNumber}</p>
          </div>
          <div className="site-card-soft rounded-2xl px-5 py-5">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Status</p>
            <p className="mt-3 text-lg font-semibold">{getProposalStatusLabel(proposal.status)}</p>
          </div>
          <div className="site-card-soft rounded-2xl px-5 py-5">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Yekun</p>
            <p className="mt-3 text-2xl font-semibold text-primary">
              ₼ {formatMoneyValue(locale, proposal.total)}
            </p>
          </div>
        </div>
      </section>

      <section className="site-card rounded-[28px] p-6">
        <h2 className="text-xl font-semibold">Qiymət xülasəsi</h2>
        <div className="mt-5 space-y-3">
          {proposal.lineItems.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className="flex items-center justify-between rounded-2xl border border-border px-4 py-3"
            >
              <span className="text-sm text-muted">{item.label}</span>
              <span className="text-sm font-semibold">
                ₼ {formatMoneyValue(locale, item.amount)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-border px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">Aylıq dəstək</span>
            <span className="text-sm font-semibold">
              ₼ {formatMoneyValue(locale, proposal.monthlySupport)}
            </span>
          </div>
        </div>

        {proposal.note ? (
          <div className="mt-6 rounded-2xl border border-border px-5 py-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">Qeyd</p>
            <p className="mt-3 text-sm leading-7 text-muted">{proposal.note}</p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
