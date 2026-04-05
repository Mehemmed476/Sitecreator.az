"use client";

import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { FolderKanban, Globe2, Plus, Star } from "lucide-react";
import {
  AdminAlert,
  AdminConfirmDialog,
  AdminEmptyState,
  AdminLoadingState,
  AdminSectionHeader,
} from "@/components/admin/dashboard/shared";
import type { PortfolioItem } from "@/components/admin/dashboard/types";
import {
  FeaturedProjectsPanel,
  PortfolioFormModal,
  PortfolioListItem,
  PortfolioSummaryCard,
  type PortfolioFormState,
} from "@/components/admin/dashboard/portfolio/PortfolioPanels";
import {
  createEmptyPortfolioTranslations,
  normalizePortfolioTranslations,
  portfolioLocales,
  type PortfolioLocale,
  type PortfolioTranslations,
} from "@/lib/portfolio-types";

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
    if (!nextFile) return;

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
        <PortfolioSummaryCard label="Ümumi layihə" value={items.length} icon={FolderKanban} />
        <PortfolioSummaryCard label="Ana səhifədə seçilən" value={featuredSlots.filter(Boolean).length} icon={Star} />
        <PortfolioSummaryCard label="3 dil hazır" value={localizedReadyCount} icon={Globe2} />
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
