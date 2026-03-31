"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import { FolderKanban, Pencil, Plus, Save, Star, Trash2, X } from "lucide-react";
import {
  AdminAlert,
  AdminEmptyState,
  AdminLoadingState,
  AdminSectionHeader,
} from "@/components/admin/dashboard/shared";
import type { PortfolioItem } from "@/components/admin/dashboard/types";

type PortfolioFormState = {
  title: string;
  description: string;
  imageUrl: string;
  techStack: string;
  projectUrl: string;
};

const emptyForm: PortfolioFormState = {
  title: "",
  description: "",
  imageUrl: "",
  techStack: "",
  projectUrl: "",
};

function padFeaturedSlots(projectIds: string[]) {
  const next = [...projectIds];

  while (next.length < 3) {
    next.push("");
  }

  return next.slice(0, 3);
}

export function PortfolioManager() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [featuredSlots, setFeaturedSlots] = useState<string[]>(["", "", ""]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [featuredSaving, setFeaturedSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [form, setForm] = useState<PortfolioFormState>(emptyForm);

  const revokePreview = useCallback((previewUrl: string) => {
    if (previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [portfolioRes, featuredRes] = await Promise.all([
        fetch("/api/portfolio", { credentials: "include", cache: "no-store" }),
        fetch("/api/homepage-featured", { credentials: "include", cache: "no-store" }),
      ]);

      const portfolioData = await portfolioRes.json().catch(() => null);
      const featuredData = await featuredRes.json().catch(() => null);

      if (!portfolioRes.ok) {
        setItems([]);
        setFeaturedSlots(["", "", ""]);
        setError(
          portfolioRes.status === 401
            ? "Zəhmət olmasa yenidən daxil olun."
            : portfolioData?.error
              ? String(portfolioData.error)
              : "Portfolio layihələrini yükləmək olmadı."
        );
        return;
      }

      if (!featuredRes.ok) {
        setItems(Array.isArray(portfolioData) ? (portfolioData as PortfolioItem[]) : []);
        setFeaturedSlots(["", "", ""]);
        setError(
          featuredData?.error
            ? String(featuredData.error)
            : "Ana səhifədə göstərilən layihələri yükləmək olmadı."
        );
        return;
      }

      setItems(Array.isArray(portfolioData) ? (portfolioData as PortfolioItem[]) : []);
      const projectIds = Array.isArray(featuredData?.projectIds)
        ? featuredData.projectIds.map(String)
        : [];
      setFeaturedSlots(padFeaturedSlots(projectIds));
    } catch {
      setItems([]);
      setFeaturedSlots(["", "", ""]);
      setError("Portfolio məlumatlarını yükləmək olmadı.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    return () => revokePreview(imagePreview);
  }, [imagePreview, revokePreview]);

  function resetForm() {
    revokePreview(imagePreview);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview("");
    setEditingId(null);
    setShowForm(false);
    setError(null);
  }

  function startCreate() {
    resetForm();
    setSuccess(null);
    setShowForm(true);
  }

  function startEdit(item: PortfolioItem) {
    revokePreview(imagePreview);
    setForm({
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      techStack: item.techStack.join(", "),
      projectUrl: item.projectUrl ?? "",
    });
    setImageFile(null);
    setImagePreview(item.imageUrl);
    setEditingId(item._id);
    setShowForm(true);
    setError(null);
    setSuccess(null);
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null;
    if (!nextFile) {
      return;
    }

    revokePreview(imagePreview);
    setImageFile(nextFile);
    setImagePreview(URL.createObjectURL(nextFile));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!imageFile && !form.imageUrl) {
      setError("Layihə şəkli əlavə et.");
      return;
    }

    const body = new FormData();
    body.append("title", form.title);
    body.append("description", form.description);
    body.append("techStack", form.techStack);
    body.append("projectUrl", form.projectUrl);

    if (imageFile) {
      body.append("image", imageFile);
    } else if (form.imageUrl) {
      body.append("imageUrl", form.imageUrl);
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = editingId
        ? await fetch(`/api/portfolio/${editingId}`, {
            method: "PUT",
            credentials: "include",
            body,
          })
        : await fetch("/api/portfolio", {
            method: "POST",
            credentials: "include",
            body,
          });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.error ? String(data.error) : "Layihəni saxlamaq olmadı.");
        return;
      }

      resetForm();
      setSuccess(editingId ? "Layihə yeniləndi." : "Layihə əlavə olundu.");
      await fetchAll();
    } catch {
      setError("Layihəni saxlamaq olmadı.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu layihə silinsin?")) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);

      const response = await fetch(`/api/portfolio/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error ? String(data.error) : "Layihəni silmək olmadı.");
        return;
      }

      setSuccess("Layihə silindi.");
      await fetchAll();
    } catch {
      setError("Layihəni silmək olmadı.");
    }
  }

  async function handleSaveFeatured() {
    try {
      setFeaturedSaving(true);
      setError(null);
      setSuccess(null);

      const response = await fetch("/api/homepage-featured", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ projectIds: featuredSlots.filter(Boolean) }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(
          data?.error ? String(data.error) : "Ana səhifədə göstərilən layihələri saxlamaq olmadı."
        );
        return;
      }

      setSuccess("Ana səhifədə görünəcək layihələr yeniləndi.");
      await fetchAll();
    } catch {
      setError("Ana səhifədə göstərilən layihələri saxlamaq olmadı.");
    } finally {
      setFeaturedSaving(false);
    }
  }

  if (loading) {
    return <AdminLoadingState />;
  }

  return (
    <div>
      <AdminSectionHeader
        title={`Portfolio layihələri (${items.length})`}
        description="Layihə kartlarını, cover şəkillərini və ana səhifədə görünəcək seçilən layihələri bir yerdən idarə et."
        actions={
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleSaveFeatured}
              disabled={featuredSaving || loading || items.length === 0}
              className="btn-secondary cursor-pointer text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Star className="h-4 w-4" />
              {featuredSaving ? "Saxlanılır..." : "Seçilənləri yadda saxla"}
            </button>
            <button onClick={startCreate} className="btn-primary cursor-pointer text-sm">
              <Plus className="h-4 w-4" />
              Layihə əlavə et
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

      {showForm ? (
        <PortfolioFormModal
          editingId={editingId}
          form={form}
          imagePreview={imagePreview}
          onClose={resetForm}
          onFileChange={handleImageChange}
          onSubmit={handleSubmit}
          onFormChange={setForm}
          saving={saving}
        />
      ) : null}

      {items.length === 0 ? (
        <AdminEmptyState
          icon={FolderKanban}
          title="Hələ portfolio layihəsi yoxdur."
          description='"Layihə əlavə et" ilə başla.'
        />
      ) : (
        <div className="space-y-4">
          <FeaturedProjectsPanel
            items={items}
            slots={featuredSlots}
            onChangeSlot={(index, value) =>
              setFeaturedSlots((current) => {
                const next = [...current];
                next[index] = value;
                return next;
              })
            }
          />

          <div className="space-y-3">
            {items.map((item) => (
              <PortfolioListItem
                key={item._id}
                item={item}
                isFeatured={featuredSlots.includes(item._id)}
                onDelete={handleDelete}
                onEdit={startEdit}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FeaturedProjectsPanel({
  items,
  slots,
  onChangeSlot,
}: {
  items: PortfolioItem[];
  slots: string[];
  onChangeSlot: (index: number, value: string) => void;
}) {
  return (
    <section className="admin-panel rounded-[28px] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Ana səhifədə göstərilən layihələr</h3>
          <p className="mt-1 text-sm text-muted">
            Maksimum 3 layihə seç. Buradakı sıra ana səhifədə görünmə sırasını müəyyən edir.
          </p>
        </div>
        <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          3 yer
        </span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <div key={index} className="space-y-2">
            <div className="text-sm font-medium text-foreground">Yer {index + 1}</div>
            <select
              value={slots[index] ?? ""}
              onChange={(event) => onChangeSlot(index, event.target.value)}
              className="site-input w-full"
            >
              <option value="">Seçilməyib</option>
              {items.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </section>
  );
}

function PortfolioFormModal({
  editingId,
  form,
  imagePreview,
  onClose,
  onFileChange,
  onSubmit,
  onFormChange,
  saving,
}: {
  editingId: string | null;
  form: PortfolioFormState;
  imagePreview: string;
  onClose: () => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onFormChange: Dispatch<SetStateAction<PortfolioFormState>>;
  saving: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="admin-panel max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[28px] p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold">
            {editingId ? "Layihəni redaktə et" : "Yeni layihə əlavə et"}
          </h3>
          <button onClick={onClose} className="cursor-pointer text-muted transition-colors hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Başlıq</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(event) => onFormChange((prev) => ({ ...prev, title: event.target.value }))}
              className="site-input w-full"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Təsvir</label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(event) =>
                onFormChange((prev) => ({ ...prev, description: event.target.value }))
              }
              className="site-input min-h-28 w-full resize-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Layihə şəkli</label>
            <div className="rounded-2xl border border-border bg-surface p-4">
              {imagePreview ? (
                <div className="relative h-48 overflow-hidden rounded-2xl border border-border">
                  <Image src={imagePreview} alt="Project preview" fill unoptimized className="object-cover" />
                </div>
              ) : (
                <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-border bg-background text-sm text-muted">
                  Hələ şəkil seçilməyib
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="mt-4 block w-full text-sm text-muted"
              />
              <p className="mt-2 text-xs text-muted">PNG, JPG, WEBP və ya GIF. Maksimum 6MB.</p>
              {editingId ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  Yeni şəkil yükləməsən, hazırkı şəkil olduğu kimi qalacaq.
                </p>
              ) : null}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Texnologiyalar (vergüllə ayır)</label>
            <input
              type="text"
              required
              value={form.techStack}
              onChange={(event) => onFormChange((prev) => ({ ...prev, techStack: event.target.value }))}
              placeholder="React, Next.js, MongoDB"
              className="site-input w-full"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Layihə URL-i (istəyə bağlı)</label>
            <input
              type="url"
              value={form.projectUrl}
              onChange={(event) => onFormChange((prev) => ({ ...prev, projectUrl: event.target.value }))}
              placeholder="https://example.com"
              className="site-input w-full"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex-1 justify-center text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saxlanılır..." : editingId ? "Yenilə" : "Yarat"}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center text-sm">
              Ləğv et
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PortfolioListItem({
  item,
  isFeatured,
  onDelete,
  onEdit,
}: {
  item: PortfolioItem;
  isFeatured: boolean;
  onDelete: (id: string) => void;
  onEdit: (item: PortfolioItem) => void;
}) {
  return (
    <div className="admin-panel-soft flex items-center gap-4 rounded-[24px] p-4 transition-all duration-200 hover:shadow-card">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface">
        <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="truncate text-sm font-semibold">{item.title}</h4>
          {isFeatured ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              <Star className="h-3 w-3 fill-current" />
              Ana səhifə
            </span>
          ) : null}
        </div>
        <p className="truncate text-xs text-muted">{item.description}</p>
        <div className="mt-1 flex gap-1">
          {item.techStack.slice(0, 3).map((tech) => (
            <span key={tech} className="rounded-full bg-primary/5 px-1.5 py-0.5 text-[10px] text-primary">
              {tech}
            </span>
          ))}
          {item.techStack.length > 3 ? (
            <span className="text-[10px] text-muted">+{item.techStack.length - 3}</span>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 gap-1.5">
        <button
          onClick={() => onEdit(item)}
          className="cursor-pointer rounded-lg p-2 text-muted transition-all hover:bg-primary/5 hover:text-primary"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(item._id)}
          className="cursor-pointer rounded-lg p-2 text-muted transition-all hover:bg-red-500/5 hover:text-red-500"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
