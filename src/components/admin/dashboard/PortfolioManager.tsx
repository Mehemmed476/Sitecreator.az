"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import { FolderKanban, Globe2, Pencil, Plus, Save, Star, Trash2, X } from "lucide-react";
import {
  AdminAlert,
  AdminConfirmDialog,
  AdminEmptyState,
  AdminLoadingState,
  AdminSectionHeader,
} from "@/components/admin/dashboard/shared";
import type { PortfolioItem } from "@/components/admin/dashboard/types";
import {
  createEmptyPortfolioTranslations,
  getPortfolioTranslation,
  normalizePortfolioTranslations,
  portfolioLocales,
  type PortfolioLocale,
  type PortfolioTranslations,
} from "@/lib/portfolio-types";

type PortfolioFormState = {
  title: string;
  imageUrl: string;
  techStack: string;
  translations: PortfolioTranslations;
};

const localeLabels: Record<PortfolioLocale, string> = {
  az: "AZ",
  en: "EN",
  ru: "RU",
};

const emptyForm: PortfolioFormState = {
  title: "",
  imageUrl: "",
  techStack: "",
  translations: createEmptyPortfolioTranslations(),
};

function cloneTranslations(translations: PortfolioTranslations): PortfolioTranslations {
  return {
    az: { ...translations.az },
    en: { ...translations.en },
    ru: { ...translations.ru },
  };
}

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
  const [activeLocale, setActiveLocale] = useState<PortfolioLocale>("az");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [form, setForm] = useState<PortfolioFormState>(emptyForm);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const localizedReadyCount = useMemo(
    () =>
      items.filter((item) =>
        portfolioLocales.every((locale) => item.translations[locale].description.trim().length > 0)
      ).length,
    [items]
  );

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

      const nextItems = Array.isArray(portfolioData)
        ? (portfolioData as PortfolioItem[]).map((item) => ({
            ...item,
            translations: normalizePortfolioTranslations(item.translations),
          }))
        : [];

      setItems(nextItems);
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
    setActiveLocale("az");
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
      imageUrl: item.imageUrl,
      techStack: item.techStack.join(", "),
      translations: cloneTranslations(normalizePortfolioTranslations(item.translations)),
    });
    setImageFile(null);
    setImagePreview(item.imageUrl);
    setEditingId(item._id);
    setShowForm(true);
    setActiveLocale("az");
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

  function updateTranslation(
    locale: PortfolioLocale,
    field: "description" | "projectUrl",
    value: string
  ) {
    setForm((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [locale]: {
          ...current.translations[locale],
          [field]: value,
        },
      },
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!imageFile && !form.imageUrl) {
      setError("Layihə üçün şəkil əlavə et.");
      return;
    }

    const missingLocales = portfolioLocales.filter(
      (locale) => !form.translations[locale].description.trim()
    );

    if (missingLocales.length > 0) {
      setError(`Təsvir bütün dillər üçün doldurulmalıdır: ${missingLocales.join(", ").toUpperCase()}.`);
      return;
    }

    const body = new FormData();
    body.append("title", form.title);
    body.append("techStack", form.techStack);
    body.append("translations", JSON.stringify(form.translations));

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

  async function handleDeleteConfirmed(id: string) {
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

      setPendingDeleteId(null);
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
          data?.error ? String(data.error) : "Ana səhifə üçün seçilən layihələri saxlamaq olmadı."
        );
        return;
      }

      setSuccess("Ana səhifədə görünəcək layihələr yeniləndi.");
      await fetchAll();
    } catch {
      setError("Ana səhifə üçün seçilən layihələri saxlamaq olmadı.");
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
        description="Portfolio kartlarını və ana səhifədə görünəcək seçilən layihələri bir yerdən idarə et."
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

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <SummaryCard label="Ümumi layihə" value={items.length} icon={FolderKanban} />
        <SummaryCard label="Ana səhifədə seçilən" value={featuredSlots.filter(Boolean).length} icon={Star} />
        <SummaryCard label="3 dil hazır" value={localizedReadyCount} icon={Globe2} />
      </div>

      {error ? <AdminAlert role="alert">{error}</AdminAlert> : null}
      {success ? (
        <AdminAlert tone="success" role="status">
          {success}
        </AdminAlert>
      ) : null}

      <AdminConfirmDialog
        open={Boolean(pendingDeleteId)}
        title="Layihə silinsin?"
        description={
          pendingDeleteId
            ? `"${items.find((item) => item._id === pendingDeleteId)?.title ?? "Bu layihə"}" silinəcək.`
            : ""
        }
        confirmText="Layihəni sil"
        onClose={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId) {
            void handleDeleteConfirmed(pendingDeleteId);
          }
        }}
      />

      {showForm ? (
        <PortfolioFormModal
          activeLocale={activeLocale}
          editingId={editingId}
          form={form}
          imagePreview={imagePreview}
          onClose={resetForm}
          onFileChange={handleImageChange}
          onFormChange={setForm}
          onLocaleChange={setActiveLocale}
          onSubmit={handleSubmit}
          onTranslationChange={updateTranslation}
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
                onDelete={setPendingDeleteId}
                onEdit={startEdit}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof FolderKanban;
}) {
  return (
    <div className="admin-panel-soft rounded-[26px] p-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </div>
      <p className="mt-3 text-3xl font-bold">{value}</p>
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
  activeLocale,
  editingId,
  form,
  imagePreview,
  onClose,
  onFileChange,
  onFormChange,
  onLocaleChange,
  onSubmit,
  onTranslationChange,
  saving,
}: {
  activeLocale: PortfolioLocale;
  editingId: string | null;
  form: PortfolioFormState;
  imagePreview: string;
  onClose: () => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onFormChange: Dispatch<SetStateAction<PortfolioFormState>>;
  onLocaleChange: (locale: PortfolioLocale) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onTranslationChange: (
    locale: PortfolioLocale,
    field: "description" | "projectUrl",
    value: string
  ) => void;
  saving: boolean;
}) {
  const localeContent = form.translations[activeLocale];

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/65 px-4 py-8 backdrop-blur">
      <div className="admin-shell w-full max-w-6xl rounded-[32px] border border-border/70 bg-background p-5 shadow-2xl sm:p-6">
        <div className="mb-6 flex flex-col gap-4 border-b border-border/70 pb-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="site-kicker">{editingId ? "Layihəni yenilə" : "Yeni layihə"}</p>
            <h3 className="mt-2 text-2xl font-bold text-foreground">
              {editingId ? "Portfolio layihəsini redaktə et" : "Çoxdilli portfolio layihəsi yarat"}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Şəkil və başlıq ümumi qalır, təsvir və layihə linki isə hər dil üçün ayrıca idarə olunur.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="site-control flex h-11 w-11 cursor-pointer items-center justify-center rounded-full"
            aria-label="Bağla"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.9fr)]">
          <div className="space-y-6">
            <section className="admin-panel-soft rounded-[28px] p-5">
              <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                Ümumi məlumat
              </h4>
              <div className="mt-4 grid gap-4">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">Başlıq</span>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(event) =>
                      onFormChange((prev) => ({ ...prev, title: event.target.value }))
                    }
                    className="site-input w-full"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">Texnologiyalar</span>
                  <input
                    type="text"
                    required
                    value={form.techStack}
                    onChange={(event) =>
                      onFormChange((prev) => ({ ...prev, techStack: event.target.value }))
                    }
                    placeholder="React, Next.js, MongoDB"
                    className="site-input w-full"
                  />
                </label>
              </div>
            </section>

            <section className="admin-panel-soft rounded-[28px] p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                    Dilə görə məzmun
                  </h4>
                  <p className="mt-1 text-xs text-muted">
                    Hər dil üçün ayrıca təsvir və link yaz.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {portfolioLocales.map((locale) => (
                    <button
                      key={locale}
                      type="button"
                      onClick={() => onLocaleChange(locale)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                        activeLocale === locale
                          ? "bg-primary text-white"
                          : "border border-border bg-background text-foreground hover:border-primary"
                      }`}
                    >
                      {localeLabels[locale]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">
                    {localeLabels[activeLocale]} təsviri
                  </span>
                  <textarea
                    required
                    rows={4}
                    value={localeContent.description}
                    onChange={(event) =>
                      onTranslationChange(activeLocale, "description", event.target.value)
                    }
                    className="site-input min-h-32 w-full resize-none"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">
                    {localeLabels[activeLocale]} layihə linki
                  </span>
                  <input
                    type="url"
                    value={localeContent.projectUrl ?? ""}
                    onChange={(event) =>
                      onTranslationChange(activeLocale, "projectUrl", event.target.value)
                    }
                    placeholder="https://example.com"
                    className="site-input w-full"
                  />
                </label>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="admin-panel-soft rounded-[28px] p-5">
              <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                Layihə şəkli
              </h4>
              <div className="mt-4 rounded-2xl border border-border bg-surface p-4">
                {imagePreview ? (
                  <div className="relative h-56 overflow-hidden rounded-2xl border border-border">
                    <Image
                      src={imagePreview}
                      alt="Project preview"
                      fill
                      unoptimized={imagePreview.startsWith("blob:")}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-border bg-background text-sm text-muted">
                    Hələ şəkil seçilməyib
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="site-input mt-4 w-full cursor-pointer"
                />
                <p className="mt-2 text-xs text-muted">PNG, JPG, WEBP və ya GIF. Maksimum 6MB.</p>
                {editingId ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Yeni şəkil yükləməsən, hazırkı şəkil olduğu kimi qalacaq.
                  </p>
                ) : null}
              </div>
            </section>

            <section className="admin-panel-soft rounded-[28px] p-5">
              <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                Tez baxış
              </h4>
              <div className="mt-4 space-y-3">
                <p className="text-xs uppercase tracking-[0.16em] text-primary">
                  {localeLabels[activeLocale]} portfolio kartı
                </p>
                <h5 className="text-xl font-semibold text-foreground">
                  {form.title || "Layihə başlığı burada görünəcək"}
                </h5>
                <p className="text-sm leading-6 text-muted">
                  {localeContent.description || "Seçilən dil üçün qısa təsvir burada görünəcək."}
                </p>
                <p className="text-xs text-muted">
                  {localeContent.projectUrl || "Layihə linki əlavə edilməyib"}
                </p>
              </div>
            </section>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex-1 justify-center text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saxlanılır..." : editingId ? "Dəyişiklikləri yadda saxla" : "Layihəni yarat"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1 justify-center text-sm"
              >
                Ləğv et
              </button>
            </div>
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
  const preview = getPortfolioTranslation(item, "az");

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
        <p className="truncate text-xs text-muted">{preview.description}</p>
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
