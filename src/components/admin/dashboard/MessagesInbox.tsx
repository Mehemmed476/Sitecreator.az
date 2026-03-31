"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocale } from "next-intl";
import {
  BellRing,
  FolderPlus,
  KeyRound,
  Mail,
  MessageSquare,
  Phone,
  RefreshCcw,
  Save,
  Search,
  Trash2,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  AdminAlert,
  AdminConfirmDialog,
  AdminEmptyState,
  AdminLoadingState,
  AdminSectionHeader,
} from "@/components/admin/dashboard/shared";
import type { LeadRecord } from "@/components/admin/dashboard/types";
import {
  formatLeadActivityLabel,
  leadSourceMeta,
  leadSources,
  leadStatusMeta,
  leadStatuses,
  type LeadStatus,
} from "@/lib/leads";

type FollowUpFilter = "all" | "due" | "scheduled";

type ConversionResult = {
  temporaryPassword?: string | null;
  client?: { id?: string; email: string; name?: string } | null;
  proposal?: { id: string } | null;
  project?: { id: string } | null;
  lead?: {
    clientUserId?: string | null;
    proposalId?: string | null;
    projectId?: string | null;
    convertedAt?: string | null;
    status?: LeadStatus;
  } | null;
};

const sourceOptions = [{ value: "all", label: "Bütün mənbələr" }].concat(
  leadSources.map((source) => ({
    value: source,
    label: leadSourceMeta[source].label,
  }))
);

export function MessagesInbox() {
  const locale = useLocale() as "az" | "en" | "ru";
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<"all" | LeadRecord["source"]>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | LeadStatus>("all");
  const [followUpFilter, setFollowUpFilter] = useState<FollowUpFilter>("all");
  const [draftStatus, setDraftStatus] = useState<LeadStatus>("new");
  const [draftNotes, setDraftNotes] = useState("");
  const [draftOutcomeReason, setDraftOutcomeReason] = useState("");
  const [draftFollowUpAt, setDraftFollowUpAt] = useState("");
  const [saving, setSaving] = useState(false);
  const [converting, setConverting] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/contact", {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setLeads([]);
        setError(res.status === 401 ? "Zəhmət olmasa yenidən daxil olun." : "Lead siyahısı yüklənmədi.");
        return;
      }

      const records = Array.isArray(data) ? (data as LeadRecord[]) : [];
      setLeads(records);
      setSelectedId((prev) => prev ?? records[0]?._id ?? null);
    } catch {
      setLeads([]);
      setError("Lead siyahısı yüklənmədi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchLeads();
  }, [fetchLeads]);

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();
    const now = Date.now();

    return leads.filter((lead) => {
      if (sourceFilter !== "all" && lead.source !== sourceFilter) return false;
      if (statusFilter !== "all" && lead.status !== statusFilter) return false;

      const followUpTime = lead.nextFollowUpAt ? new Date(lead.nextFollowUpAt).getTime() : null;
      if (followUpFilter === "due" && (!followUpTime || followUpTime > now)) return false;
      if (followUpFilter === "scheduled" && !followUpTime) return false;

      if (!query) return true;

      return [
        lead.name,
        lead.email,
        lead.company,
        lead.message,
        lead.phone,
        lead.calculator?.serviceName,
        lead.notes,
        lead.outcomeReason,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [followUpFilter, leads, search, sourceFilter, statusFilter]);

  const selectedLead =
    filteredLeads.find((lead) => lead._id === selectedId) ??
    leads.find((lead) => lead._id === selectedId) ??
    null;

  useEffect(() => {
    if (!selectedLead) return;
    setDraftStatus(selectedLead.status);
    setDraftNotes(selectedLead.notes ?? "");
    setDraftOutcomeReason(selectedLead.outcomeReason ?? "");
    setDraftFollowUpAt(toDatetimeLocalInput(selectedLead.nextFollowUpAt ?? null));
  }, [selectedLead]);

  useEffect(() => {
    setConversionResult(null);
  }, [selectedLead?._id]);

  async function patchLead(id: string, payload: Record<string, unknown>) {
    const res = await fetch(`/api/contact/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.error || "Lead yenilənmədi.");
    }

    const updated = data as LeadRecord;
    setLeads((prev) => prev.map((lead) => (lead._id === updated._id ? updated : lead)));
    return updated;
  }

  async function handleSelectLead(lead: LeadRecord) {
    setSelectedId(lead._id);

    if (!lead.isRead) {
      try {
        await patchLead(lead._id, { isRead: true });
      } catch {
        setError("Lead oxunmuş kimi işarələnmədi.");
      }
    }
  }

  async function handleSave() {
    if (!selectedLead) return;

    try {
      setSaving(true);
      setError(null);
      await patchLead(selectedLead._id, {
        status: draftStatus,
        notes: draftNotes,
        outcomeReason: draftOutcomeReason,
        nextFollowUpAt: draftFollowUpAt ? new Date(draftFollowUpAt).toISOString() : null,
        isRead: true,
      });
      setSuccess("Lead yeniləndi.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Lead yenilənmədi.");
    } finally {
      setSaving(false);
    }
  }

  async function handleConvert() {
    if (!selectedLead) return;

    try {
      setConverting(true);
      setError(null);
      const res = await fetch(`/api/leads/${selectedLead._id}/convert`, {
        method: "POST",
        credentials: "include",
      });
      const data = (await res.json().catch(() => null)) as ConversionResult & { error?: string };

      if (!res.ok) {
        throw new Error(data?.error || "Lead çevrilmədi.");
      }

      setConversionResult(data);
      setLeads((prev) =>
        prev.map((lead) =>
          lead._id === selectedLead._id
            ? {
                ...lead,
                status: data.lead?.status ?? lead.status,
                clientUserId: data.lead?.clientUserId ?? lead.clientUserId,
                proposalId: data.lead?.proposalId ?? lead.proposalId,
                projectId: data.lead?.projectId ?? lead.projectId,
                convertedAt: data.lead?.convertedAt ?? lead.convertedAt,
              }
            : lead
        )
      );
      setSuccess(data.temporaryPassword ? "Portal hesabı yaradıldı." : "Portal axını yeniləndi.");
    } catch (convertError) {
      setError(convertError instanceof Error ? convertError.message : "Lead çevrilmədi.");
    } finally {
      setConverting(false);
    }
  }

  async function handleResetPassword() {
    if (!selectedLead?.clientUserId) return;

    try {
      setResettingPassword(true);
      setError(null);
      const res = await fetch(`/api/clients/${selectedLead.clientUserId}/reset-password`, {
        method: "POST",
        credentials: "include",
      });
      const data = (await res.json().catch(() => null)) as ConversionResult & { error?: string };

      if (!res.ok) {
        throw new Error(data?.error || "Şifrə yenilənmədi.");
      }

      setConversionResult({
        client: data.client ?? {
          id: selectedLead.clientUserId,
          email: selectedLead.email,
        },
        temporaryPassword: data.temporaryPassword ?? null,
        proposal: selectedLead.proposalId ? { id: selectedLead.proposalId } : null,
        project: selectedLead.projectId ? { id: selectedLead.projectId } : null,
      });
      setSuccess("Yeni müvəqqəti şifrə yaradıldı.");
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : "Şifrə yenilənmədi.");
    } finally {
      setResettingPassword(false);
    }
  }

  // Legacy browser confirm flow kept temporarily for reference during alert redesign.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function _handleDeleteLegacy(id: string) {
    if (!confirm("Bu lead silinsin?")) return;

    const res = await fetch(`/api/contact/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      setError(data?.error || "Lead silinmədi.");
      return;
    }

    setLeads((prev) => prev.filter((lead) => lead._id !== id));
    setSelectedId((prev) => (prev === id ? null : prev));
    setSuccess("Lead silindi.");
  }

  async function handleDeleteConfirmed(id: string) {
    const res = await fetch(`/api/contact/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      setError(data?.error || "Lead silinmədi.");
      return;
    }

    setLeads((prev) => prev.filter((lead) => lead._id !== id));
    setSelectedId((prev) => (prev === id ? null : prev));
    setPendingDeleteId(null);
    setSuccess("Lead silindi.");
  }

  if (loading) return <AdminLoadingState />;

  if (!leads.length) {
    return (
      <AdminEmptyState
        icon={MessageSquare}
        title="Hələ lead yoxdur."
        description="Public saytdan gələn müraciətlər burada görünəcək."
      />
    );
  }

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        title={`Lead CRM (${leads.length})`}
        description="Lead-ləri idarə et, reminder təyin et və client portal axınını başlat."
        actions={
          <button type="button" onClick={() => void fetchLeads()} className="btn-secondary text-sm">
            <RefreshCcw className="h-4 w-4" />
            Yenilə
          </button>
        }
      />

      {error ? <AdminAlert role="alert">{error}</AdminAlert> : null}
      {success ? <AdminAlert tone="success">{success}</AdminAlert> : null}

      <AdminConfirmDialog
        open={Boolean(pendingDeleteId)}
        title="Lead silinsin?"
        description={
          pendingDeleteId
            ? `"${leads.find((lead) => lead._id === pendingDeleteId)?.name ?? "Bu lead"}" CRM-dən silinəcək.`
            : ""
        }
        confirmText="Lead-i sil"
        onClose={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId) {
            void handleDeleteConfirmed(pendingDeleteId);
          }
        }}
      />

      <section className="admin-panel rounded-[24px] p-4">
        <div className="grid gap-3 xl:grid-cols-[minmax(0,_1fr)_190px_190px_210px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Ad, email və ya şirkət üzrə axtar"
              className="site-input w-full rounded-xl py-3 pl-11 pr-4 text-sm"
            />
          </label>

          <select
            value={sourceFilter}
            onChange={(event) => setSourceFilter(event.target.value as "all" | LeadRecord["source"])}
            className="site-input rounded-xl px-4 py-3 text-sm"
          >
            {sourceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as "all" | LeadStatus)}
            className="site-input rounded-xl px-4 py-3 text-sm"
          >
            <option value="all">Bütün statuslar</option>
            {leadStatuses.map((status) => (
              <option key={status} value={status}>
                {leadStatusMeta[status].label}
              </option>
            ))}
          </select>

          <select
            value={followUpFilter}
            onChange={(event) => setFollowUpFilter(event.target.value as FollowUpFilter)}
            className="site-input rounded-xl px-4 py-3 text-sm"
          >
            <option value="all">Bütün follow-up-lar</option>
            <option value="due">Vaxtı çatanlar</option>
            <option value="scheduled">Planlaşdırılanlar</option>
          </select>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,_1fr)]">
        <div className="space-y-3">
          {filteredLeads.length ? (
            filteredLeads.map((lead) => (
              <button
                key={lead._id}
                onClick={() => void handleSelectLead(lead)}
                className={`admin-panel w-full rounded-[22px] p-4 text-left ${
                  selectedLead?._id === lead._id ? "border-primary/30 bg-primary/10" : ""
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={leadStatusMeta[lead.status].className}>
                    {leadStatusMeta[lead.status].label}
                  </Badge>
                  <Badge className={leadSourceMeta[lead.source].className}>
                    {leadSourceMeta[lead.source].label}
                  </Badge>
                  {lead.projectId ? (
                    <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
                      Portal
                    </Badge>
                  ) : null}
                </div>

                <p className="mt-3 text-base font-semibold">{lead.name}</p>
                <p className="mt-1 text-sm text-muted">{lead.email}</p>
                <p className="mt-3 line-clamp-2 text-sm text-muted">{lead.message}</p>
              </button>
            ))
          ) : (
            <AdminEmptyState
              icon={Search}
              title="Nəticə yoxdur."
              description="Filteri dəyişib yenidən yoxla."
            />
          )}
        </div>

        {selectedLead ? (
          <div className="space-y-6">
            <section className="admin-panel rounded-[28px] p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={leadStatusMeta[selectedLead.status].className}>
                      {leadStatusMeta[selectedLead.status].label}
                    </Badge>
                    {selectedLead.nextFollowUpAt ? (
                      <Badge className="border-white/10 bg-white/5 text-foreground">
                        <BellRing className="mr-1 inline h-3 w-3" />
                        {formatDateTime(selectedLead.nextFollowUpAt)}
                      </Badge>
                    ) : null}
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold">{selectedLead.name}</h3>
                  <p className="mt-2 text-sm text-muted">
                    {selectedLead.company || "Şirkət qeyd edilməyib"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setPendingDeleteId(selectedLead._id)}
                  className="btn-secondary text-sm text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                  Sil
                </button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <InfoLink
                  icon={Mail}
                  label="Email"
                  value={selectedLead.email}
                  href={`mailto:${selectedLead.email}`}
                />
                <InfoLink
                  icon={Phone}
                  label="Telefon"
                  value={selectedLead.phone || "-"}
                  href={selectedLead.phone ? `tel:${selectedLead.phone}` : undefined}
                />
              </div>

              <div className="mt-6 grid gap-4 xl:grid-cols-[220px_260px_minmax(0,_1fr)]">
                <select
                  value={draftStatus}
                  onChange={(event) => setDraftStatus(event.target.value as LeadStatus)}
                  className="site-input rounded-xl px-4 py-3 text-sm"
                >
                  {leadStatuses.map((status) => (
                    <option key={status} value={status}>
                      {leadStatusMeta[status].label}
                    </option>
                  ))}
                </select>

                <input
                  type="datetime-local"
                  value={draftFollowUpAt}
                  onChange={(event) => setDraftFollowUpAt(event.target.value)}
                  className="site-input rounded-xl px-4 py-3 text-sm"
                />

                <input
                  value={draftOutcomeReason}
                  onChange={(event) => setDraftOutcomeReason(event.target.value)}
                  placeholder="Nəticə qeydi"
                  className="site-input rounded-xl px-4 py-3 text-sm"
                />
              </div>

              <textarea
                value={draftNotes}
                onChange={(event) => setDraftNotes(event.target.value)}
                rows={5}
                placeholder="Daxili qeyd"
                className="site-input mt-4 w-full rounded-xl px-4 py-3 text-sm"
              />

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={saving}
                  className="btn-primary text-sm disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Yadda saxlanır..." : "Dəyişiklikləri saxla"}
                </button>

                <button
                  type="button"
                  onClick={() => void handleConvert()}
                  disabled={converting}
                  className="btn-secondary text-sm disabled:opacity-60"
                >
                  <FolderPlus className="h-4 w-4" />
                  {converting ? "Yaradılır..." : "Proposal və layihə yarat"}
                </button>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[minmax(0,_1fr)_340px]">
              <div className="space-y-6">
                <div className="admin-panel rounded-[24px] p-6">
                  <h4 className="text-lg font-semibold">Müraciət mətni</h4>
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-muted">
                    {selectedLead.message}
                  </p>
                </div>

                <div className="admin-panel rounded-[24px] p-6">
                  <h4 className="text-lg font-semibold">Timeline</h4>
                  <div className="mt-4 space-y-4">
                    {(selectedLead.activities ?? []).length ? (
                      selectedLead.activities?.map((activity, index) => (
                        <div
                          key={`${activity.createdAt}-${index}`}
                          className="border-b border-white/6 pb-4 last:border-b-0 last:pb-0"
                        >
                          <p className="text-sm font-semibold">
                            {activity.title || formatLeadActivityLabel(activity.type)}
                          </p>
                          <p className="mt-1 text-xs text-muted">
                            {formatDateTime(activity.createdAt)}
                          </p>
                          {activity.detail ? (
                            <p className="mt-2 text-sm text-muted">{activity.detail}</p>
                          ) : null}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted">Hələ history yoxdur.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="admin-panel rounded-[24px] p-6">
                  <h4 className="text-lg font-semibold">Client portal</h4>
                  <p className="mt-3 text-sm text-muted">
                    Bu lead üçün portal girişi, proposal və project axını yaradılır.
                  </p>

                  {selectedLead.clientUserId ? (
                    <div className="mt-4 rounded-2xl border border-border px-4 py-4 text-sm">
                      <p>
                        <span className="text-muted">Portal email:</span>{" "}
                        {conversionResult?.client?.email ?? selectedLead.email}
                      </p>
                      <p className="mt-2">
                        <span className="text-muted">Status:</span> Aktiv client hesabı
                      </p>
                    </div>
                  ) : null}

                  {conversionResult?.temporaryPassword ? (
                    <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/8 px-4 py-4 text-sm">
                      <p>
                        <span className="text-muted">Email:</span> {conversionResult.client?.email}
                      </p>
                      <p className="mt-2">
                        <span className="text-muted">Müvəqqəti şifrə:</span>{" "}
                        {conversionResult.temporaryPassword}
                      </p>
                    </div>
                  ) : null}

                  {selectedLead.clientUserId ? (
                    <div className="mt-4 grid gap-3">
                      <button
                        type="button"
                        onClick={() => void handleResetPassword()}
                        disabled={resettingPassword}
                        className="btn-secondary justify-center text-sm disabled:opacity-60"
                      >
                        <KeyRound className="h-4 w-4" />
                        {resettingPassword ? "Yenilənir..." : "Yeni müvəqqəti şifrə yarat"}
                      </button>
                    </div>
                  ) : null}

                  {selectedLead.projectId || conversionResult?.project?.id ? (
                    <div className="mt-4 grid gap-3">
                      <Link
                        href={`/portal/projects/${conversionResult?.project?.id ?? selectedLead.projectId}`}
                        locale={locale}
                        className="btn-secondary justify-center text-sm"
                      >
                        Portalda layihəyə bax
                      </Link>
                      <Link
                        href={`/portal/proposals/${conversionResult?.proposal?.id ?? selectedLead.proposalId}`}
                        locale={locale}
                        className="btn-secondary justify-center text-sm"
                      >
                        Portalda təklifə bax
                      </Link>
                    </div>
                  ) : null}
                </div>

                {selectedLead.source === "calculator" ? (
                  <div className="admin-panel rounded-[24px] p-6">
                    <h4 className="text-lg font-semibold">Kalkulyator xülasəsi</h4>
                    <div className="mt-4 space-y-4 text-sm text-muted">
                      <div className="space-y-2">
                        <p>Xidmət: {selectedLead.calculator?.serviceName || "-"}</p>
                        <p>
                          {selectedLead.calculator?.unitLabel || "Həcm"}:{" "}
                          {typeof selectedLead.calculator?.unitCount === "number"
                            ? selectedLead.calculator.unitCount
                            : "-"}
                        </p>
                        <p>Dizayn: {selectedLead.calculator?.designLabel || "-"}</p>
                        <p>Logo: {selectedLead.calculator?.logoLabel || "-"}</p>
                        <p>Təslim: {selectedLead.calculator?.timelineLabel || "-"}</p>
                        <p>Aylıq dəstək: {selectedLead.calculator?.supportLabel || "-"}</p>
                        <p>
                          Yekun:{" "}
                          {typeof selectedLead.calculator?.total === "number"
                            ? `₼ ${formatWholeNumber(selectedLead.calculator.total)}`
                            : "-"}
                        </p>
                      </div>

                      <CalculatorList
                        title="Layihə əlavələri"
                        items={selectedLead.calculator?.buildLabels}
                      />
                      <CalculatorList
                        title="SEO əlavələri"
                        items={selectedLead.calculator?.seoLabels}
                      />

                      {(selectedLead.calculator?.lineItems ?? []).length ? (
                        <div className="rounded-2xl border border-border p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-muted">
                            Qiymət breakdown
                          </p>
                          <div className="mt-3 space-y-2">
                            {selectedLead.calculator?.lineItems?.map((item, index) => (
                              <div
                                key={`${item.label}-${index}`}
                                className="flex items-center justify-between gap-4 text-sm"
                              >
                                <span>{item.label}</span>
                                <span className="font-medium text-foreground">
                                  ₼ {formatWholeNumber(item.amount)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {selectedLead.calculator?.summary ? (
                        <div className="rounded-2xl border border-border p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-muted">
                            Göndərilən tam xülasə
                          </p>
                          <p className="mt-3 whitespace-pre-wrap leading-7">
                            {selectedLead.calculator.summary}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Badge({ className, children }: { className: string; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${className}`}
    >
      {children}
    </span>
  );
}

function InfoLink({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="site-card-subtle rounded-[18px] p-4">
      <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>
      {href && value !== "-" ? (
        <a href={href} className="mt-3 block text-sm font-medium text-primary hover:underline">
          {value}
        </a>
      ) : (
        <p className="mt-3 text-sm font-medium">{value}</p>
      )}
    </div>
  );
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("az-AZ", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatWholeNumber(value: number) {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function toDatetimeLocalInput(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60_000);
  return localDate.toISOString().slice(0, 16);
}

function CalculatorList({ title, items }: { title: string; items?: string[] }) {
  return (
    <div className="rounded-2xl border border-border p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-muted">{title}</p>
      {items?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-foreground"
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm">-</p>
      )}
    </div>
  );
}
