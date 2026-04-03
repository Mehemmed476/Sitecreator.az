"use client";

import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { AdminConfirmDialog } from "@/components/admin/dashboard/shared";
import { ProjectChatPanel } from "@/components/portal/ProjectChatPanel";
import type { ProjectChatThreadRecord } from "@/lib/project-chat";

function formatThreadTime(value?: string | null) {
  if (!value) return "";

  return new Date(value).toLocaleString("az-AZ", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ProjectChatWorkspace({
  locale,
  threads,
  viewerRole,
  title,
  description,
  showThreadList = true,
}: {
  locale: "az" | "en" | "ru";
  threads: ProjectChatThreadRecord[];
  viewerRole: "admin" | "client";
  title: string;
  description: string;
  showThreadList?: boolean;
}) {
  const [threadItems, setThreadItems] = useState(threads);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(threads[0]?.projectId ?? null);
  const [clearing, setClearing] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const selectedThread = useMemo(
    () => threadItems.find((item) => item.projectId === selectedProjectId) ?? threadItems[0] ?? null,
    [selectedProjectId, threadItems]
  );

  async function handleClearThread() {
    if (!selectedThread || viewerRole !== "admin") return;

    try {
      setClearing(true);
      const response = await fetch(`/api/projects/${selectedThread.projectId}/messages`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Chat tarixçəsi silinmədi.");
      }

      setThreadItems((current) =>
        current.map((thread) =>
          thread.projectId === selectedThread.projectId
            ? { ...thread, latestMessage: "", latestMessageAt: null }
            : thread
        )
      );
      setRefreshKey((current) => current + 1);
      setConfirmClearOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setClearing(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="site-card-highlight rounded-[28px] p-7 sm:p-8">
        <p className="site-kicker">Realtime chat</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted sm:text-base">{description}</p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[360px_minmax(0,_1fr)]">
        {showThreadList ? (
          <aside className="site-card rounded-[28px] p-4">
            <div className="space-y-3">
              {threads.length ? (
                threads.map((thread) => {
                  const isActive = thread.projectId === selectedThread?.projectId;

                  return (
                    <button
                      key={thread.projectId}
                      type="button"
                      onClick={() => setSelectedProjectId(thread.projectId)}
                      className={`w-full rounded-[22px] border px-4 py-4 text-left transition-all ${
                        isActive
                          ? "border-primary/25 bg-primary/10"
                          : "border-border bg-white/5 hover:border-primary/20"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {thread.projectTitle}
                          </p>
                          <p className="mt-1 text-xs text-muted">
                            {thread.clientName ? `${thread.clientName} • ` : ""}
                            {thread.serviceName}
                          </p>
                        </div>
                        {thread.latestMessageAt ? (
                          <span className="shrink-0 text-[11px] text-muted-foreground">
                            {formatThreadTime(thread.latestMessageAt)}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
                        {thread.latestMessage || "Hələ mesaj yoxdur."}
                      </p>
                    </button>
                  );
                })
              ) : (
                <div className="rounded-[22px] border border-border bg-white/5 px-4 py-8 text-sm text-muted">
                  Hələ aktiv chat yoxdur.
                </div>
              )}
            </div>
          </aside>
        ) : null}

        <div className={`space-y-4 ${showThreadList ? "" : "xl:col-span-2"}`}>
          {selectedThread ? (
            <>
              {!showThreadList && threadItems.length > 1 ? (
                <div className="site-card rounded-[24px] p-4">
                  <div className="flex flex-wrap gap-2">
                    {threadItems.map((thread) => {
                      const isActive = thread.projectId === selectedThread.projectId;

                      return (
                        <button
                          key={thread.projectId}
                          type="button"
                          onClick={() => setSelectedProjectId(thread.projectId)}
                          className={`rounded-full px-4 py-2 text-sm transition-colors ${
                            isActive
                              ? "bg-primary text-white"
                              : "border border-border bg-white/5 text-foreground"
                          }`}
                        >
                          {thread.projectTitle}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <div className="site-card rounded-[24px] px-5 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-semibold">{selectedThread.projectTitle}</p>
                    <p className="mt-1 text-sm text-muted">
                      {selectedThread.clientName ? `${selectedThread.clientName} • ` : ""}
                      {selectedThread.serviceName}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {viewerRole === "admin" ? (
                      <button
                        type="button"
                        onClick={() => setConfirmClearOpen(true)}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-500/15"
                      >
                        <Trash2 className="h-4 w-4" />
                        Chatı sil
                      </button>
                    ) : null}
                    <Link
                      href={`/portal/projects/${selectedThread.projectId}`}
                      locale={locale}
                      className="btn-secondary text-sm"
                    >
                      Layihəyə bax
                    </Link>
                  </div>
                </div>
              </div>

              <ProjectChatPanel
                key={`${selectedThread.projectId}-${refreshKey}`}
                projectId={selectedThread.projectId}
                viewerRole={viewerRole}
                title="Mesajlaşma"
                description="Yazışmalar, foto və fayl paylaşımı bu thread daxilində saxlanılır."
              />
            </>
          ) : null}
        </div>
      </section>

      <AdminConfirmDialog
        open={confirmClearOpen}
        title="Chat tarixçəsi silinsin?"
        description="Bu əməliyyat yalnız seçilmiş layihənin yazışmalarını və attachment-larını siləcək."
        confirmText="Bəli, sil"
        cancelText="Ləğv et"
        confirmTone="danger"
        loading={clearing}
        onConfirm={() => void handleClearThread()}
        onClose={() => setConfirmClearOpen(false)}
      />
    </div>
  );
}
