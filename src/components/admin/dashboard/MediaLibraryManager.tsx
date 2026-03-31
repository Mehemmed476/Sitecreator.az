"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from "react";
import { Copy, ImagePlus, RefreshCcw, Trash2 } from "lucide-react";
import {
  AdminAlert,
  AdminEmptyState,
  AdminLoadingState,
  AdminSectionHeader,
} from "@/components/admin/dashboard/shared";
import type { MediaLibraryAsset } from "@/lib/media-library";

type MediaFilter = "all" | "library" | "portfolio" | "insights";

const filterLabels: Record<MediaFilter, string> = {
  all: "Hamısı",
  library: "Library",
  portfolio: "Portfolio",
  insights: "Blog",
};

function formatBytes(value: number) {
  if (value >= 1024 * 1024) {
    return `${(value / (1024 * 1024)).toFixed(1)} MB`;
  }

  if (value >= 1024) {
    return `${Math.round(value / 1024)} KB`;
  }

  return `${value} B`;
}

function matchesFilter(asset: MediaLibraryAsset, filter: MediaFilter) {
  if (filter === "all") {
    return true;
  }

  if (filter === "library") {
    return asset.folder.includes("/library");
  }

  if (filter === "portfolio") {
    return asset.folder.includes("/portfolio");
  }

  return asset.folder.includes("/insights");
}

export function MediaLibraryManager() {
  const [items, setItems] = useState<MediaLibraryAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<MediaFilter>("all");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/media-library", {
        credentials: "include",
        cache: "no-store",
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setItems([]);
        setError(
          response.status === 401
            ? "Zəhmət olmasa yenidən daxil olun."
            : data?.error
              ? String(data.error)
              : "Media library yüklənmədi."
        );
        return;
      }

      setItems(Array.isArray(data) ? (data as MediaLibraryAsset[]) : []);
    } catch {
      setItems([]);
      setError("Media library yüklənmədi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  const filteredItems = useMemo(
    () => items.filter((item) => matchesFilter(item, filter)),
    [items, filter]
  );

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (!files.length) {
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setSuccess(null);

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/media-library", {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          setError(data?.error ? String(data.error) : "Şəkil yükləmək olmadı.");
          return;
        }
      }

      setSuccess(files.length === 1 ? "Şəkil yükləndi." : `${files.length} şəkil yükləndi.`);
      await fetchItems();
    } catch {
      setError("Şəkil yükləmək olmadı.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(publicId: string) {
    if (!confirm("Bu media faylı silinsin?")) {
      return;
    }

    try {
      setDeletingId(publicId);
      setError(null);
      setSuccess(null);

      const encoded = publicId.split("/").map(encodeURIComponent).join("/");
      const response = await fetch(`/api/media-library/${encoded}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.error ? String(data.error) : "Media faylını silmək olmadı.");
        return;
      }

      setSuccess("Media faylı silindi.");
      await fetchItems();
    } catch {
      setError("Media faylını silmək olmadı.");
    } finally {
      setDeletingId(null);
    }
  }

  async function copyText(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setSuccess(`${label} kopyalandı.`);
      setError(null);
    } catch {
      setError(`${label} kopyalanmadı.`);
    }
  }

  return (
    <div>
      <AdminSectionHeader
        title={`Media library (${items.length})`}
        description="Cloudinary-dəki portfolio, blog və ümumi library şəkillərini bir paneldən idarə et."
        actions={
          <div className="flex flex-wrap gap-2">
            <label className="btn-primary cursor-pointer text-sm">
              <ImagePlus className="h-4 w-4" />
              {uploading ? "Yüklənir..." : "Şəkil yüklə"}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
            <button onClick={() => void fetchItems()} className="btn-secondary cursor-pointer text-sm">
              <RefreshCcw className="h-4 w-4" />
              Yenilə
            </button>
          </div>
        }
      />

      {error ? <AdminAlert role="alert">{error}</AdminAlert> : null}
      {success ? (
        <AdminAlert tone="success" role="status">
          {success}
        </AdminAlert>
      ) : null}

      {loading ? (
        <AdminLoadingState />
      ) : (
        <div className="space-y-4">
          <div className="admin-panel-soft rounded-[24px] p-4">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(filterLabels) as MediaFilter[]).map((entry) => (
                <button
                  key={entry}
                  type="button"
                  onClick={() => setFilter(entry)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    filter === entry
                      ? "bg-primary text-white"
                      : "border border-border bg-background text-foreground hover:border-primary"
                  }`}
                >
                  {filterLabels[entry]}
                </button>
              ))}
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <AdminEmptyState
              title="Bu filter üçün media yoxdur."
              description="Yeni şəkil yükləyərək kitabxananı doldura bilərsən."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item) => (
                <article key={item.publicId} className="admin-panel-soft rounded-[24px] p-4">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] border border-border bg-surface">
                    <Image src={item.url} alt={item.filename} fill className="object-cover" />
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{item.filename}</p>
                        <p className="mt-1 truncate text-xs text-muted">{item.folder || item.publicId}</p>
                      </div>
                      <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                        {item.format}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-muted">
                      <span>{item.width} × {item.height}</span>
                      <span>{formatBytes(item.bytes)}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => void copyText(item.url, "Şəkil linki")}
                        className="btn-secondary cursor-pointer text-xs"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        URL kopyala
                      </button>
                      <button
                        type="button"
                        onClick={() => void copyText(item.publicId, "Public ID")}
                        className="btn-secondary cursor-pointer text-xs"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        ID kopyala
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(item.publicId)}
                        disabled={deletingId === item.publicId}
                        className="inline-flex items-center gap-1 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {deletingId === item.publicId ? "Silinir..." : "Sil"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
