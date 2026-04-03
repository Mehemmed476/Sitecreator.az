"use client";

import { useEffect, useMemo, useState } from "react";
import { FolderOpen, Trash2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  AdminConfirmDialog,
  AdminEmptyState,
} from "@/components/admin/dashboard/shared";
import { formatMoneyValue } from "@/lib/price-calculator-estimate";
import type { AdminProjectRecord } from "@/components/admin/dashboard/types";

type Summary = {
  projectCount: number;
  proposalCount: number;
  clientCount: number;
  projects: AdminProjectRecord[];
};

const projectStatusLabels: Record<AdminProjectRecord["status"], string> = {
  new: "Yeni",
  planning: "Planlama",
  in_progress: "İcra",
  review: "Yoxlama",
  completed: "Tamamlandı",
};

const proposalStatusLabels: Record<
  NonNullable<AdminProjectRecord["proposal"]["status"]>,
  string
> = {
  draft: "Draft",
  sent: "Göndərildi",
  approved: "Təsdiqləndi",
  rejected: "Rədd edildi",
};

export function ProjectsManager({
  locale,
  summary,
}: {
  locale: "az" | "en" | "ru";
  summary: Summary;
}) {
  const [projects, setProjects] = useState(summary.projects);
  const [selectedId, setSelectedId] = useState<string | null>(summary.projects[0]?._id ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [draft, setDraft] = useState<AdminProjectRecord | null>(summary.projects[0] ?? null);
  const [confirmDeleteProjectOpen, setConfirmDeleteProjectOpen] = useState(false);

  const selectedProject =
    projects.find((project) => project._id === selectedId) ?? projects[0] ?? null;

  useEffect(() => {
    setDraft(selectedProject ? JSON.parse(JSON.stringify(selectedProject)) : null);
  }, [selectedProject]);

  const metrics = useMemo(
    () => ({
      projectCount: projects.length,
      proposalCount: projects.filter((project) => project.proposal._id).length,
      clientCount: new Set(projects.map((project) => project.client._id).filter(Boolean)).size,
    }),
    [projects]
  );

  function updateDraft(next: Partial<AdminProjectRecord>) {
    setDraft((current) => (current ? { ...current, ...next } : current));
  }

  async function handleSave() {
    if (!draft) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const [projectRes, proposalRes] = await Promise.all([
        fetch(`/api/projects/${draft._id}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: draft.title,
            serviceName: draft.serviceName,
            summary: draft.summary,
            status: draft.status,
            total: Number(draft.total),
            monthlySupport: Number(draft.monthlySupport),
            timelineLabel: draft.timelineLabel,
            milestones: draft.milestones,
          }),
        }),
        fetch(`/api/proposals/${draft.proposal._id}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: draft.proposal.title,
            serviceName: draft.serviceName,
            summary: draft.proposal.summary,
            note: draft.proposal.note,
            status: draft.proposal.status,
            total: Number(draft.proposal.total ?? draft.total),
            monthlySupport: Number(draft.proposal.monthlySupport ?? draft.monthlySupport),
            lineItems: draft.proposal.lineItems ?? [],
          }),
        }),
      ]);

      const [projectData, proposalData] = await Promise.all([
        projectRes.json().catch(() => null),
        proposalRes.json().catch(() => null),
      ]);

      if (!projectRes.ok) {
        throw new Error(projectData?.error || "Layihə yenilənmədi.");
      }

      if (!proposalRes.ok) {
        throw new Error(proposalData?.error || "Təklif yenilənmədi.");
      }

      setProjects((current) =>
        current.map((project) =>
          project._id === draft._id
            ? {
                ...project,
                ...draft,
              }
            : project
        )
      );
      setSuccess("Layihə və təklif yeniləndi.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Yadda saxlamaq olmadı.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteProject() {
    if (!draft) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await fetch(`/api/projects/${draft._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Layihə silinmədi.");
      }

      setProjects((current) => {
        const next = current.filter((project) => project._id !== draft._id);
        setSelectedId(next[0]?._id ?? null);
        return next;
      });
      setSuccess("Layihə, ona bağlı təklif və chat tarixçəsi silindi.");
      setConfirmDeleteProjectOpen(false);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Layihə silinmədi.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Layihələr" value={String(metrics.projectCount)} />
        <MetricCard label="Təkliflər" value={String(metrics.proposalCount)} />
        <MetricCard label="Portal müştəriləri" value={String(metrics.clientCount)} />
      </section>

      {error ? <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div> : null}
      {success ? <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{success}</div> : null}

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,_1fr)]">
        <div className="space-y-3">
          {projects.length ? (
            projects.map((project) => (
              <button
                key={project._id}
                onClick={() => setSelectedId(project._id)}
                className={`admin-panel w-full rounded-[22px] p-4 text-left ${
                  selectedId === project._id ? "border-primary/30 bg-primary/10" : ""
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary">
                    {project.proposal.proposalNumber}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted">
                    {projectStatusLabels[project.status]}
                  </span>
                </div>
                <p className="mt-3 text-base font-semibold">{project.title}</p>
                <p className="mt-1 text-sm text-muted">{project.client.name} • {project.client.email}</p>
                <p className="mt-3 text-sm text-muted">₼ {formatMoneyValue(locale, project.total)}</p>
              </button>
            ))
          ) : (
            <AdminEmptyState
              icon={FolderOpen}
              title="Hələ heç layihə yoxdur."
              description="Lead-dən proposal və layihə yaradanda bu siyahıda görünəcək."
            />
          )}
        </div>

        {draft ? (
          <div className="space-y-6">
            <section className="admin-panel rounded-[24px] p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Layihə və təklif idarəsi</h2>
                  <p className="mt-2 text-sm text-muted">
                    Qiymətləri, mərhələləri və portalda görünən məlumatları buradan yenilə.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteProjectOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-500/15"
                  >
                    <Trash2 className="h-4 w-4" />
                    Layihəni sil
                  </button>
                  <Link href={`/portal/projects/${draft._id}`} locale={locale} className="btn-secondary text-sm">
                    Portal layihə görünüşü
                  </Link>
                  <button onClick={() => void handleSave()} disabled={saving} className="btn-primary text-sm disabled:opacity-60">
                    {saving ? "Saxlanılır..." : "Yadda saxla"}
                  </button>
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
              <div className="admin-panel rounded-[24px] p-6 space-y-4">
                <h3 className="text-lg font-semibold">Layihə məlumatı</h3>
                <Field label="Layihə adı">
                  <input value={draft.title} onChange={(e) => updateDraft({ title: e.target.value })} className="site-input w-full rounded-xl px-4 py-3 text-sm" />
                </Field>
                <Field label="Xidmət adı">
                  <input value={draft.serviceName} onChange={(e) => updateDraft({ serviceName: e.target.value })} className="site-input w-full rounded-xl px-4 py-3 text-sm" />
                </Field>
                <Field label="Status">
                  <select value={draft.status} onChange={(e) => updateDraft({ status: e.target.value as AdminProjectRecord["status"] })} className="site-input w-full rounded-xl px-4 py-3 text-sm">
                    {Object.entries(projectStatusLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Büdcə">
                  <input type="number" value={draft.total} onChange={(e) => updateDraft({ total: Number(e.target.value) })} className="site-input w-full rounded-xl px-4 py-3 text-sm" />
                </Field>
                <Field label="Aylıq dəstək">
                  <input type="number" value={draft.monthlySupport} onChange={(e) => updateDraft({ monthlySupport: Number(e.target.value) })} className="site-input w-full rounded-xl px-4 py-3 text-sm" />
                </Field>
                <Field label="Timeline etiketi">
                  <input value={draft.timelineLabel ?? ""} onChange={(e) => updateDraft({ timelineLabel: e.target.value })} className="site-input w-full rounded-xl px-4 py-3 text-sm" />
                </Field>
                <Field label="Layihə xülasəsi">
                  <textarea value={draft.summary} onChange={(e) => updateDraft({ summary: e.target.value })} rows={5} className="site-input w-full rounded-xl px-4 py-3 text-sm" />
                </Field>
              </div>

              <div className="admin-panel rounded-[24px] p-6 space-y-4">
                <h3 className="text-lg font-semibold">Təklif məlumatı</h3>
                <Field label="Təklif adı">
                  <input value={draft.proposal.title ?? ""} onChange={(e) => updateDraft({ proposal: { ...draft.proposal, title: e.target.value } })} className="site-input w-full rounded-xl px-4 py-3 text-sm" />
                </Field>
                <Field label="Təklif statusu">
                  <select value={draft.proposal.status} onChange={(e) => updateDraft({ proposal: { ...draft.proposal, status: e.target.value as AdminProjectRecord["proposal"]["status"] } })} className="site-input w-full rounded-xl px-4 py-3 text-sm">
                    {Object.entries(proposalStatusLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Təklif xülasəsi">
                  <textarea value={draft.proposal.summary ?? ""} onChange={(e) => updateDraft({ proposal: { ...draft.proposal, summary: e.target.value } })} rows={4} className="site-input w-full rounded-xl px-4 py-3 text-sm" />
                </Field>
                <Field label="Qeyd">
                  <textarea value={draft.proposal.note ?? ""} onChange={(e) => updateDraft({ proposal: { ...draft.proposal, note: e.target.value } })} rows={4} className="site-input w-full rounded-xl px-4 py-3 text-sm" />
                </Field>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
              <div className="admin-panel rounded-[24px] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Milestone-lar</h3>
                  <button
                    type="button"
                    onClick={() =>
                      updateDraft({
                        milestones: [...draft.milestones, { label: "Yeni mərhələ", done: false }],
                      })
                    }
                    className="btn-secondary text-sm"
                  >
                    Əlavə et
                  </button>
                </div>
                <div className="space-y-3">
                  {draft.milestones.map((item, index) => (
                    <div key={`${item.label}-${index}`} className="rounded-2xl border border-border p-4 space-y-3">
                      <input
                        value={item.label}
                        onChange={(e) =>
                          updateDraft({
                            milestones: draft.milestones.map((milestone, milestoneIndex) =>
                              milestoneIndex === index ? { ...milestone, label: e.target.value } : milestone
                            ),
                          })
                        }
                        className="site-input w-full rounded-xl px-4 py-3 text-sm"
                      />
                      <label className="flex items-center gap-3 text-sm text-muted">
                        <input
                          type="checkbox"
                          checked={item.done}
                          onChange={(e) =>
                            updateDraft({
                              milestones: draft.milestones.map((milestone, milestoneIndex) =>
                                milestoneIndex === index ? { ...milestone, done: e.target.checked } : milestone
                              ),
                            })
                          }
                        />
                        Tamamlandı
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="admin-panel rounded-[24px] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Qiymət sətirləri</h3>
                  <button
                    type="button"
                    onClick={() =>
                      updateDraft({
                        proposal: {
                          ...draft.proposal,
                          lineItems: [...(draft.proposal.lineItems ?? []), { label: "Yeni sətir", amount: 0 }],
                        },
                      })
                    }
                    className="btn-secondary text-sm"
                  >
                    Sətir əlavə et
                  </button>
                </div>
                <div className="space-y-3">
                  {(draft.proposal.lineItems ?? []).map((item, index) => (
                    <div key={`${item.label}-${index}`} className="grid gap-3 rounded-2xl border border-border p-4 md:grid-cols-[minmax(0,_1fr)_140px]">
                      <input
                        value={item.label}
                        onChange={(e) =>
                          updateDraft({
                            proposal: {
                              ...draft.proposal,
                              lineItems: (draft.proposal.lineItems ?? []).map((line, lineIndex) =>
                                lineIndex === index ? { ...line, label: e.target.value } : line
                              ),
                            },
                          })
                        }
                        className="site-input rounded-xl px-4 py-3 text-sm"
                      />
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) =>
                          updateDraft({
                            proposal: {
                              ...draft.proposal,
                              lineItems: (draft.proposal.lineItems ?? []).map((line, lineIndex) =>
                                lineIndex === index ? { ...line, amount: Number(e.target.value) } : line
                              ),
                            },
                          })
                        }
                        className="site-input rounded-xl px-4 py-3 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <section className="admin-panel rounded-[24px] p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Realtime chat</h3>
                  <p className="mt-2 text-sm text-muted">
                    Bu layihəyə aid yazışma, foto və faylları ayrıca chat modulundan idarə et.
                  </p>
                </div>
                <Link href="/admin/sales/chats" locale={locale} className="btn-secondary text-sm">
                  Chat modulunu aç
                </Link>
              </div>
            </section>
          </div>
        ) : (
          <div className="admin-panel rounded-[24px] p-8 text-sm text-muted">
            {projects.length ? "Layihə seçin." : "Hazırda göstərəcək layihə yoxdur."}
          </div>
        )}
      </div>

      <AdminConfirmDialog
        open={confirmDeleteProjectOpen}
        title="Layihə silinsin?"
        description="Bu əməliyyat layihəni, ona bağlı təklifi və bu layihənin chat tarixçəsini siləcək."
        confirmText="Bəli, sil"
        cancelText="Ləğv et"
        confirmTone="danger"
        loading={saving}
        onConfirm={() => void handleDeleteProject()}
        onClose={() => setConfirmDeleteProjectOpen(false)}
      />
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="admin-panel rounded-[24px] p-6">
      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
      <p className="mt-4 text-3xl font-semibold">{value}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
