"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { MessageSquare, RefreshCcw } from "lucide-react";
import {
  AdminAlert,
  AdminConfirmDialog,
  AdminEmptyState,
  AdminLoadingState,
  AdminSectionHeader,
} from "@/components/admin/dashboard/shared";
import {
  MessagesFiltersBar,
  MessagesLeadDetail,
  MessagesLeadList,
} from "@/components/admin/dashboard/messages/MessagesInboxSections";
import type { LeadRecord } from "@/components/admin/dashboard/types";
import {
  leadSourceMeta,
  leadSources,
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
        lead.packageRequest?.title,
        lead.packageRequest?.category,
        lead.packageRequest?.slug,
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

      <MessagesFiltersBar
        followUpFilter={followUpFilter}
        search={search}
        sourceFilter={sourceFilter}
        sourceOptions={sourceOptions}
        statusFilter={statusFilter}
        onFollowUpFilterChange={setFollowUpFilter}
        onSearchChange={setSearch}
        onSourceFilterChange={setSourceFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,_1fr)]">
        <MessagesLeadList
          filteredLeads={filteredLeads}
          selectedLeadId={selectedLead?._id ?? null}
          onSelectLead={(lead) => void handleSelectLead(lead)}
        />

        {selectedLead ? (
          <MessagesLeadDetail
            locale={locale}
            selectedLead={selectedLead}
            draftFollowUpAt={draftFollowUpAt}
            draftNotes={draftNotes}
            draftOutcomeReason={draftOutcomeReason}
            draftStatus={draftStatus}
            saving={saving}
            converting={converting}
            resettingPassword={resettingPassword}
            conversionResult={conversionResult}
            onConvert={() => void handleConvert()}
            onDelete={() => setPendingDeleteId(selectedLead._id)}
            onDraftFollowUpAtChange={setDraftFollowUpAt}
            onDraftNotesChange={setDraftNotes}
            onDraftOutcomeReasonChange={setDraftOutcomeReason}
            onDraftStatusChange={setDraftStatus}
            onResetPassword={() => void handleResetPassword()}
            onSave={() => void handleSave()}
          />
        ) : null}
      </div>
    </div>
  );
}

function toDatetimeLocalInput(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60_000);
  return localDate.toISOString().slice(0, 16);
}
