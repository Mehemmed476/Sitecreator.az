"use client";

import { BellRing, FolderPlus, KeyRound, Mail, Phone, Save, Search, Trash2 } from "lucide-react";
import { type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { AdminEmptyState } from "@/components/admin/dashboard/shared";
import type { LeadRecord } from "@/components/admin/dashboard/types";
import {
  formatLeadActivityLabel,
  leadSourceMeta,
  leadStatusMeta,
  leadStatuses,
  type LeadStatus,
} from "@/lib/leads";

export function MessagesFiltersBar({
  followUpFilter,
  search,
  sourceFilter,
  sourceOptions,
  statusFilter,
  onFollowUpFilterChange,
  onSearchChange,
  onSourceFilterChange,
  onStatusFilterChange,
}: {
  followUpFilter: "all" | "due" | "scheduled";
  search: string;
  sourceFilter: "all" | LeadRecord["source"];
  sourceOptions: { value: string; label: string }[];
  statusFilter: "all" | LeadStatus;
  onFollowUpFilterChange: (value: "all" | "due" | "scheduled") => void;
  onSearchChange: (value: string) => void;
  onSourceFilterChange: (value: "all" | LeadRecord["source"]) => void;
  onStatusFilterChange: (value: "all" | LeadStatus) => void;
}) {
  return (
    <section className="admin-panel rounded-[24px] p-4">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,_1fr)_190px_190px_210px]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Ad, email və ya şirkət üzrə axtar"
            className="site-input w-full rounded-xl py-3 pl-11 pr-4 text-sm"
          />
        </label>

        <select
          value={sourceFilter}
          onChange={(event) => onSourceFilterChange(event.target.value as "all" | LeadRecord["source"])}
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
          onChange={(event) => onStatusFilterChange(event.target.value as "all" | LeadStatus)}
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
          onChange={(event) => onFollowUpFilterChange(event.target.value as "all" | "due" | "scheduled")}
          className="site-input rounded-xl px-4 py-3 text-sm"
        >
          <option value="all">Bütün follow-up-lar</option>
          <option value="due">Vaxtı çatanlar</option>
          <option value="scheduled">Planlaşdırılanlar</option>
        </select>
      </div>
    </section>
  );
}

export function MessagesLeadList({
  filteredLeads,
  selectedLeadId,
  onSelectLead,
}: {
  filteredLeads: LeadRecord[];
  selectedLeadId: string | null;
  onSelectLead: (lead: LeadRecord) => void;
}) {
  return (
    <div className="space-y-3">
      {filteredLeads.length ? (
        filteredLeads.map((lead) => (
          <button
            key={lead._id}
            onClick={() => onSelectLead(lead)}
            className={`admin-panel w-full rounded-[22px] p-4 text-left ${
              selectedLeadId === lead._id ? "border-primary/30 bg-primary/10" : ""
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
        <AdminEmptyState icon={Search} title="Nəticə yoxdur." description="Filteri dəyişib yenidən yoxla." />
      )}
    </div>
  );
}

export function MessagesLeadDetail({
  locale,
  selectedLead,
  draftFollowUpAt,
  draftNotes,
  draftOutcomeReason,
  draftStatus,
  saving,
  converting,
  resettingPassword,
  conversionResult,
  onConvert,
  onDelete,
  onDraftFollowUpAtChange,
  onDraftNotesChange,
  onDraftOutcomeReasonChange,
  onDraftStatusChange,
  onResetPassword,
  onSave,
}: {
  locale: "az" | "en" | "ru";
  selectedLead: LeadRecord;
  draftFollowUpAt: string;
  draftNotes: string;
  draftOutcomeReason: string;
  draftStatus: LeadStatus;
  saving: boolean;
  converting: boolean;
  resettingPassword: boolean;
  conversionResult: {
    temporaryPassword?: string | null;
    client?: { id?: string; email: string; name?: string } | null;
    proposal?: { id: string } | null;
    project?: { id: string } | null;
  } | null;
  onConvert: () => void;
  onDelete: () => void;
  onDraftFollowUpAtChange: (value: string) => void;
  onDraftNotesChange: (value: string) => void;
  onDraftOutcomeReasonChange: (value: string) => void;
  onDraftStatusChange: (value: LeadStatus) => void;
  onResetPassword: () => void;
  onSave: () => void;
}) {
  return (
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
            <p className="mt-2 text-sm text-muted">{selectedLead.company || "Şirkət qeyd edilməyib"}</p>
          </div>

          <button type="button" onClick={onDelete} className="btn-secondary text-sm text-red-300">
            <Trash2 className="h-4 w-4" />
            Sil
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <InfoLink icon={Mail} label="Email" value={selectedLead.email} href={`mailto:${selectedLead.email}`} />
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
            onChange={(event) => onDraftStatusChange(event.target.value as LeadStatus)}
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
            onChange={(event) => onDraftFollowUpAtChange(event.target.value)}
            className="site-input rounded-xl px-4 py-3 text-sm"
          />

          <input
            value={draftOutcomeReason}
            onChange={(event) => onDraftOutcomeReasonChange(event.target.value)}
            placeholder="Nəticə qeydi"
            className="site-input rounded-xl px-4 py-3 text-sm"
          />
        </div>

        <textarea
          value={draftNotes}
          onChange={(event) => onDraftNotesChange(event.target.value)}
          rows={5}
          placeholder="Daxili qeyd"
          className="site-input mt-4 w-full rounded-xl px-4 py-3 text-sm"
        />

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="btn-primary text-sm disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "Yadda saxlanır..." : "Dəyişiklikləri saxla"}
          </button>

          <button
            type="button"
            onClick={onConvert}
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
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-muted">{selectedLead.message}</p>
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
                    <p className="mt-1 text-xs text-muted">{formatDateTime(activity.createdAt)}</p>
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
                  onClick={onResetPassword}
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

          {selectedLead.source === "package" ? (
            <div className="admin-panel rounded-[24px] p-6">
              <h4 className="text-lg font-semibold">Paket sorğusu</h4>
              <div className="mt-4 space-y-4 text-sm text-muted">
                <div className="space-y-2">
                  <p>Paket: {selectedLead.packageRequest?.title || "-"}</p>
                  <p>Kateqoriya: {selectedLead.packageRequest?.category || "-"}</p>
                  <p>Dil: {selectedLead.packageRequest?.locale || "-"}</p>
                  <p>Slug: {selectedLead.packageRequest?.slug || "-"}</p>
                  <p>
                    Start qiymət:{" "}
                    {typeof selectedLead.packageRequest?.startingPrice === "number"
                      ? `₼ ${formatWholeNumber(selectedLead.packageRequest.startingPrice)}`
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

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

                <CalculatorList title="Layihə əlavələri" items={selectedLead.calculator?.buildLabels} />
                <CalculatorList title="SEO əlavələri" items={selectedLead.calculator?.seoLabels} />

                {(selectedLead.calculator?.lineItems ?? []).length ? (
                  <div className="rounded-2xl border border-border p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted">Qiymət breakdown</p>
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
                    <p className="text-xs uppercase tracking-[0.18em] text-muted">Göndərilən tam xülasə</p>
                    <p className="mt-3 whitespace-pre-wrap leading-7">{selectedLead.calculator.summary}</p>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </section>
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

function CalculatorList({ title, items }: { title: string; items?: string[] }) {
  return items?.length ? (
    <div className="rounded-2xl border border-border p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-muted">{title}</p>
      <ul className="mt-3 space-y-2 text-sm text-foreground">
        {items.map((item) => (
          <li key={item} className="list-disc pl-2 marker:text-primary">
            {item}
          </li>
        ))}
      </ul>
    </div>
  ) : null;
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
