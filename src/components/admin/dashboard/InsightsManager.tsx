"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  BookOpenText,
  CalendarDays,
  CheckCircle2,
  Copy,
  Globe2,
  Languages,
  Newspaper,
  Pencil,
  Plus,
  Save,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import {
  AdminAlert,
  AdminConfirmDialog,
  AdminEmptyState,
  AdminLoadingState,
  AdminSectionHeader,
} from "@/components/admin/dashboard/shared";
import {
  insightLocales,
  type InsightLocale,
  type InsightLocaleContent,
  type InsightRecord,
  type InsightTranslations,
  type InsightType,
} from "@/lib/insight-types";
import {
  createEmptyInsightTranslations,
  getInsightContent,
  getInsightCoverImage,
  getInsightLocaleStatus,
  isInsightLocaleComplete,
  normalizeInsightTags,
  slugifyInsight,
} from "@/lib/insight-utils";

type InsightFormState = {
  type: InsightType;
  translations: InsightTranslations;
  published: boolean;
  featured: boolean;
  publishedAt: string;
};

type InsightCoverImageFiles = Partial<Record<InsightLocale, File | null>>;
type InsightCoverImagePreviews = Partial<Record<InsightLocale, string>>;

const localeLabels: Record<InsightLocale, string> = {
  az: "AZ",
  en: "EN",
  ru: "RU",
};

function cloneTranslations(translations: InsightTranslations): InsightTranslations {
  return {
    az: { ...translations.az, tags: [...translations.az.tags] },
    en: { ...translations.en, tags: [...translations.en.tags] },
    ru: { ...translations.ru, tags: [...translations.ru.tags] },
  };
}

function createEmptyForm(): InsightFormState {
  return {
    type: "blog",
    translations: createEmptyInsightTranslations(),
    published: true,
    featured: false,
    publishedAt: "",
  };
}

function formatDateTimeLocal(value?: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

function isFormReadyInAllLocales(translations: InsightTranslations) {
  return insightLocales.every((locale) => isInsightLocaleComplete(translations[locale]));
}

export function InsightsManager() {
  const [items, setItems] = useState<InsightRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [coverImageFiles, setCoverImageFiles] = useState<InsightCoverImageFiles>({});
  const [coverImagePreviews, setCoverImagePreviews] = useState<InsightCoverImagePreviews>({});
  const [activeLocale, setActiveLocale] = useState<InsightLocale>("az");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [form, setForm] = useState<InsightFormState>(createEmptyForm);

  const publishedCount = useMemo(() => items.filter((item) => item.published).length, [items]);
  const featuredCount = useMemo(() => items.filter((item) => item.featured).length, [items]);
  const localizedReadyCount = useMemo(
    () => items.filter((item) => isFormReadyInAllLocales(item.translations)).length,
    [items]
  );

  const revokePreview = useCallback((previewUrl: string) => {
    if (previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
  }, []);

  const revokePreviewMap = useCallback(
    (previews: InsightCoverImagePreviews) => {
      Object.values(previews).forEach((previewUrl) => {
        if (previewUrl) {
          revokePreview(previewUrl);
        }
      });
    },
    [revokePreview]
  );

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/insights", { credentials: "include" });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setItems([]);
        setError(
          response.status === 401
            ? "Zəhmət olmasa yenidən daxil olun."
            : data?.error
              ? String(data.error)
              : "Bloq yazılarını yükləmək olmadı."
        );
        return;
      }

      setItems(Array.isArray(data) ? (data as InsightRecord[]) : []);
    } catch {
      setItems([]);
      setError("Bloq yazılarını yükləmək olmadı.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    return () => revokePreviewMap(coverImagePreviews);
  }, [coverImagePreviews, revokePreviewMap]);

  function resetForm() {
    revokePreviewMap(coverImagePreviews);
    setForm(createEmptyForm());
    setCoverImageFiles({});
    setCoverImagePreviews({});
    setEditingId(null);
    setShowForm(false);
    setActiveLocale("az");
    setError(null);
  }

  function startCreate() {
    resetForm();
    setShowForm(true);
  }

  function startEdit(item: InsightRecord) {
    revokePreviewMap(coverImagePreviews);
    setForm({
      type: item.type,
      translations: cloneTranslations(item.translations),
      published: item.published,
      featured: item.featured,
      publishedAt: formatDateTimeLocal(item.publishedAt),
    });
    setCoverImageFiles({});
    setCoverImagePreviews(
      Object.fromEntries(
        insightLocales.map((locale) => [locale, item.translations[locale].coverImageUrl ?? ""])
      ) as InsightCoverImagePreviews
    );
    setEditingId(item._id);
    setShowForm(true);
    setActiveLocale("az");
    setError(null);
  }

  function updateLocaleField(
    locale: InsightLocale,
    field: keyof InsightLocaleContent,
    value: string | string[]
  ) {
    setForm((current) => {
      const currentLocale = current.translations[locale];
      const nextLocale = {
        ...currentLocale,
        [field]: value,
      };

      if (field === "title") {
        const suggestedSlug = slugifyInsight(String(value));
        const shouldSyncSlug =
          currentLocale.slug.trim().length === 0 ||
          currentLocale.slug === slugifyInsight(currentLocale.title);

        nextLocale.slug = shouldSyncSlug ? suggestedSlug : currentLocale.slug;
      }

      return {
        ...current,
        translations: {
          ...current.translations,
          [locale]: nextLocale,
        },
      };
    });
  }

  function updateForm<K extends keyof Omit<InsightFormState, "translations">>(
    key: K,
    value: InsightFormState[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function copyTranslation(source: InsightLocale, target: InsightLocale) {
    setForm((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [target]: {
          ...current.translations[source],
          tags: [...current.translations[source].tags],
        },
      },
    }));
  }

  function fillEmptyLocalesFrom(locale: InsightLocale) {
    setForm((current) => {
      const source = current.translations[locale];
      const nextTranslations = cloneTranslations(current.translations);

      for (const candidate of insightLocales) {
        if (candidate === locale) {
          continue;
        }

        const target = nextTranslations[candidate];
        if (!target.title && !target.excerpt && !target.content) {
          nextTranslations[candidate] = {
            ...source,
            tags: [...source.tags],
          };
        }
      }

      return {
        ...current,
        translations: nextTranslations,
      };
    });
  }

  function handleCoverImageChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null;
    if (!nextFile) {
      return;
    }

    setCoverImageFiles((current) => ({
      ...current,
      [activeLocale]: nextFile,
    }));
    setCoverImagePreviews((current) => {
      const previousPreview = current[activeLocale];
      if (previousPreview) {
        revokePreview(previousPreview);
      }

      return {
        ...current,
        [activeLocale]: URL.createObjectURL(nextFile),
      };
    });
    event.target.value = "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const hasAnyLocaleContent = insightLocales.some((locale) => {
      const translation = form.translations[locale];
      return translation.title || translation.excerpt || translation.content;
    });

    if (!hasAnyLocaleContent) {
      setError("Ən azı bir dildə məzmun olmalıdır.");
      return;
    }

    if (form.published) {
      const missingLocales = insightLocales.filter(
        (locale) => !isInsightLocaleComplete(form.translations[locale])
      );

      if (missingLocales.length > 0) {
        setError(
          `Paylaşmadan əvvəl bütün dilləri tamamla: ${missingLocales.join(", ").toUpperCase()}.`
        );
        return;
      }
    }

    const body = new FormData();
    body.append("type", form.type);
    body.append("translations", JSON.stringify(form.translations));
    body.append("published", String(form.published));
    body.append("featured", String(form.featured));
    body.append("publishedAt", form.publishedAt);

    for (const locale of insightLocales) {
      const coverImageFile = coverImageFiles[locale];
      if (coverImageFile) {
        body.append(`coverImage_${locale}`, coverImageFile);
      }
    }

    try {
      setSaving(true);
      setError(null);

      const response = editingId
        ? await fetch(`/api/insights/${editingId}`, {
            method: "PUT",
            credentials: "include",
            body,
          })
        : await fetch("/api/insights", {
            method: "POST",
            credentials: "include",
            body,
          });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.error ? String(data.error) : "Məqaləni saxlamaq olmadı.");
        return;
      }

      resetForm();
      await fetchItems();
    } catch {
      setError("Məqaləni saxlamaq olmadı.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const response = await fetch(`/api/insights/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.error ? String(data.error) : "Məqaləni silmək olmadı.");
        return;
      }

      setDeleteTargetId(null);
      await fetchItems();
    } catch {
      setError("Məqaləni silmək olmadı.");
    }
  }

  if (loading) {
    return <AdminLoadingState />;
  }

  return (
    <div>
      <AdminSectionHeader
        title={`Bloq və case study-lər (${items.length})`}
        description="Çoxdilli SEO məqalələrini və case study-ləri qarışıqlıq olmadan idarə et."
        actions={
          <button onClick={startCreate} className="btn-primary cursor-pointer text-sm">
            <Plus className="h-4 w-4" />
            Məqalə əlavə et
          </button>
        }
      />

      <div className="mb-6 grid gap-3 md:grid-cols-4">
        <SummaryCard label="Ümumi yazı" value={items.length} icon={Newspaper} />
        <SummaryCard label="Paylaşılan" value={publishedCount} icon={CheckCircle2} />
        <SummaryCard label="Seçilən" value={featuredCount} icon={Sparkles} />
        <SummaryCard label="3 dil hazır" value={localizedReadyCount} icon={Languages} />
      </div>

      {error ? <AdminAlert role="alert">{error}</AdminAlert> : null}

      <AdminConfirmDialog
        open={Boolean(deleteTargetId)}
        title="Məqalə silinsin?"
        description={
          deleteTargetId
            ? `"${items.find((item) => item._id === deleteTargetId)?.translations.az.title || "Bu məqalə"}" silinəcək.`
            : ""
        }
        confirmText="Məqaləni sil"
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) {
            void handleDelete(deleteTargetId);
          }
        }}
      />

      {showForm ? (
        <InsightFormModal
          editingId={editingId}
          form={form}
          coverImagePreview={coverImagePreviews[activeLocale] ?? form.translations[activeLocale].coverImageUrl ?? ""}
          activeLocale={activeLocale}
          onActiveLocaleChange={setActiveLocale}
          onClose={resetForm}
          onCoverImageChange={handleCoverImageChange}
          onLocaleFieldChange={updateLocaleField}
          onCopyTranslation={copyTranslation}
          onFillEmptyLocalesFrom={fillEmptyLocalesFrom}
          onFormChange={updateForm}
          onSubmit={handleSubmit}
          saving={saving}
        />
      ) : null}

      {items.length === 0 ? (
        <AdminEmptyState
          icon={BookOpenText}
          title="Hələ bloq yazısı və ya case study yoxdur."
          description='"Məqalə əlavə et" ilə ilk yazını yarat.'
        />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <InsightListItem
              key={item._id}
              item={item}
              onEdit={startEdit}
              onDelete={setDeleteTargetId}
            />
          ))}
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
  icon: typeof Globe2;
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

function InsightListItem({
  item,
  onEdit,
  onDelete,
}: {
  item: InsightRecord;
  onEdit: (item: InsightRecord) => void;
  onDelete: (id: string) => void;
}) {
  const primaryContent = getInsightContent(item, "az");
  const previewImage = getInsightCoverImage(item, "az");
  const localeStatus = getInsightLocaleStatus(item);
  const publishedLabel = item.publishedAt
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(item.publishedAt))
    : "Draft";

  return (
    <div className="admin-panel-soft rounded-[28px] border border-border/70 p-4 sm:p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-2xl border border-border/70 bg-surface">
            {previewImage ? (
              <Image src={previewImage} alt={primaryContent.title} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.24),transparent_45%),linear-gradient(135deg,rgba(15,23,42,1),rgba(30,41,59,0.92))]" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                {item.type === "case-study" ? "Case study" : "Bloq"}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                  item.published
                    ? "border border-emerald-400/15 bg-emerald-400/10 text-emerald-300"
                    : "border border-white/10 bg-white/5 text-muted"
                }`}
              >
                {item.published ? "Paylasilib" : "Draft"}
              </span>
              {item.featured ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold text-amber-200">
                  <Sparkles className="h-3 w-3" />
                  Secilen
                </span>
              ) : null}
            </div>

            <h3 className="mt-3 text-lg font-semibold text-foreground">{primaryContent.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{primaryContent.excerpt}</p>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-primary" />
                {publishedLabel}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Newspaper className="h-3.5 w-3.5 text-primary" />
                /az/blog/{item.translations.az.slug || "-"}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {insightLocales.map((locale) => (
                <button
                  key={locale}
                  type="button"
                  className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                    localeStatus[locale]
                      ? "border-emerald-400/15 bg-emerald-400/10 text-emerald-300"
                      : "border-amber-400/20 bg-amber-400/10 text-amber-200"
                  }`}
                >
                  {localeLabels[locale]} {localeStatus[locale] ? "hazir" : "catismir"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 gap-2 self-start">
          <button
            onClick={() => onEdit(item)}
            className="btn-secondary cursor-pointer text-sm"
          >
            <Pencil className="h-4 w-4" />
            Redakte et
          </button>
          <button
            onClick={() => onDelete(item._id)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition-colors hover:border-red-500/40 hover:bg-red-500/15"
          >
            <Trash2 className="h-4 w-4" />
            Sil
          </button>
        </div>
      </div>
    </div>
  );
}

function InsightFormModal({
  editingId,
  form,
  coverImagePreview,
  activeLocale,
  onActiveLocaleChange,
  onClose,
  onCoverImageChange,
  onLocaleFieldChange,
  onCopyTranslation,
  onFillEmptyLocalesFrom,
  onFormChange,
  onSubmit,
  saving,
}: {
  editingId: string | null;
  form: InsightFormState;
  coverImagePreview: string;
  activeLocale: InsightLocale;
  onActiveLocaleChange: (locale: InsightLocale) => void;
  onClose: () => void;
  onCoverImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onLocaleFieldChange: (
    locale: InsightLocale,
    field: keyof InsightLocaleContent,
    value: string | string[]
  ) => void;
  onCopyTranslation: (source: InsightLocale, target: InsightLocale) => void;
  onFillEmptyLocalesFrom: (locale: InsightLocale) => void;
  onFormChange: <K extends keyof Omit<InsightFormState, "translations">>(
    key: K,
    value: InsightFormState[K]
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  saving: boolean;
}) {
  const localeContent = form.translations[activeLocale];
  const localeStatus = Object.fromEntries(
    insightLocales.map((locale) => [locale, isInsightLocaleComplete(form.translations[locale])])
  ) as Record<InsightLocale, boolean>;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/65 px-4 py-8 backdrop-blur">
      <form
        onSubmit={onSubmit}
        className="admin-shell w-full max-w-6xl rounded-[32px] border border-border/70 bg-background p-5 shadow-2xl sm:p-6"
      >
        <div className="mb-6 flex flex-col gap-4 border-b border-border/70 pb-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="site-kicker">{editingId ? "Yazini yenile" : "Yeni meqale"}</p>
            <h3 className="mt-2 text-2xl font-bold text-foreground">
              {editingId ? "Coxdilli meqaleni redakte et" : "Coxdilli bloq yazisi yarat"}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              AZ, EN ve RU ucun bir yerde yaz, dil tablari ve copy yardimcilari ile daha rahat
              redakte et.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="site-control flex h-11 w-11 cursor-pointer items-center justify-center rounded-full"
            aria-label="Bagla"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-border/70 bg-surface/50 p-4">
          <div className="flex flex-wrap gap-2">
            {insightLocales.map((locale) => (
              <button
                key={locale}
                type="button"
                onClick={() => onActiveLocaleChange(locale)}
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

          <div className="flex flex-wrap gap-2">
            {activeLocale !== "az" ? (
              <button
                type="button"
                onClick={() => onCopyTranslation("az", activeLocale)}
                className="btn-secondary cursor-pointer text-sm"
              >
                <Copy className="h-4 w-4" />
                AZ-dan {localeLabels[activeLocale]} diline kocur
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => onFillEmptyLocalesFrom(activeLocale)}
              className="btn-secondary cursor-pointer text-sm"
            >
              <Copy className="h-4 w-4" />
              Bos dilleri {localeLabels[activeLocale]} dilinden doldur
            </button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(290px,0.9fr)]">
          <div className="space-y-6">
            <section className="admin-panel-soft rounded-[28px] p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                    {localeLabels[activeLocale]} mezmunu
                  </h4>
                  <p className="mt-1 text-xs text-muted">
                    Aktiv dil ucun basliq, qisa tesvir ve esas mezmun.
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                    localeStatus[activeLocale]
                      ? "border border-emerald-400/15 bg-emerald-400/10 text-emerald-300"
                      : "border border-amber-400/20 bg-amber-400/10 text-amber-200"
                  }`}
                >
                  {localeStatus[activeLocale] ? "Hazir" : "Mezmun lazimdir"}
                </span>
              </div>

              <div className="grid gap-4">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">Basliq</span>
                  <input
                    value={localeContent.title}
                    onChange={(event) =>
                      onLocaleFieldChange(activeLocale, "title", event.target.value)
                    }
                    className="site-input w-full"
                    placeholder="Daha cevik sayt ile muracietleri nece artirdiq"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">Slug</span>
                  <input
                    value={localeContent.slug}
                    onChange={(event) =>
                      onLocaleFieldChange(activeLocale, "slug", event.target.value)
                    }
                    className="site-input w-full"
                    placeholder="how-we-increased-leads"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">Qisa tesvir</span>
                  <textarea
                    value={localeContent.excerpt}
                    onChange={(event) =>
                      onLocaleFieldChange(activeLocale, "excerpt", event.target.value)
                    }
                    className="site-input min-h-28 w-full"
                    placeholder="Siyahida ve metadata-da goruenecek qisa aciqlama."
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">Mezmun</span>
                  <textarea
                    value={localeContent.content}
                    onChange={(event) =>
                      onLocaleFieldChange(activeLocale, "content", event.target.value)
                    }
                    className="site-input min-h-[340px] w-full"
                    placeholder={"Paraqraflar arasinda bos setir burax.\n\n## basliqlar desteklenir\n- siyahi da yazila biler"}
                  />
                </label>
              </div>
            </section>

            <section className="admin-panel-soft rounded-[28px] p-5">
              <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                {localeLabels[activeLocale]} SEO
              </h4>
              <div className="mt-4 grid gap-4">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">Tagler</span>
                  <input
                    value={localeContent.tags.join(", ")}
                    onChange={(event) =>
                      onLocaleFieldChange(
                        activeLocale,
                        "tags",
                        normalizeInsightTags(event.target.value)
                      )
                    }
                    className="site-input w-full"
                    placeholder="seo, sayt, case-study"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">SEO basligi</span>
                  <input
                    value={localeContent.seoTitle ?? ""}
                    onChange={(event) =>
                      onLocaleFieldChange(activeLocale, "seoTitle", event.target.value)
                    }
                    className="site-input w-full"
                    placeholder="Google ucun opsional basliq"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">SEO tesviri</span>
                  <textarea
                    value={localeContent.seoDescription ?? ""}
                    onChange={(event) =>
                      onLocaleFieldChange(activeLocale, "seoDescription", event.target.value)
                    }
                    className="site-input min-h-24 w-full"
                    placeholder="Google snippet ucun opsional tesvir"
                  />
                </label>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="admin-panel-soft rounded-[28px] p-5">
              <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                Dil veziyyeti
              </h4>
              <div className="mt-4 space-y-3">
                {insightLocales.map((locale) => (
                  <button
                    key={locale}
                    type="button"
                    onClick={() => onActiveLocaleChange(locale)}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 text-left ${
                      activeLocale === locale
                        ? "border-primary bg-primary/10"
                        : "border-border/70 bg-background"
                    }`}
                  >
                    <span>
                      <span className="block text-sm font-semibold text-foreground">
                        {localeLabels[locale]}
                      </span>
                      <span className="mt-1 block text-xs text-muted">
                        {form.translations[locale].title || "Hele basliq yoxdur"}
                      </span>
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                        localeStatus[locale]
                          ? "border border-emerald-400/15 bg-emerald-400/10 text-emerald-300"
                          : "border border-amber-400/20 bg-amber-400/10 text-amber-200"
                      }`}
                    >
                      {localeStatus[locale] ? "Hazir" : "Catismir"}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="admin-panel-soft rounded-[28px] p-5">
              <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                Paylasim
              </h4>
              <div className="mt-4 space-y-4">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">Nov</span>
                  <select
                    value={form.type}
                    onChange={(event) =>
                      onFormChange("type", event.target.value as InsightType)
                    }
                    className="site-input w-full"
                  >
                    <option value="blog">Bloq</option>
                    <option value="case-study">Case study</option>
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">Paylasim tarixi</span>
                  <input
                    type="datetime-local"
                    value={form.publishedAt}
                    onChange={(event) => onFormChange("publishedAt", event.target.value)}
                    className="site-input w-full"
                  />
                </label>

                <label className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Paylasilib</p>
                    <p className="text-xs text-muted">
                      AZ, EN ve RU mezmunu tam olmalidir.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(event) => onFormChange("published", event.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />
                </label>

                <label className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Secilen</p>
                    <p className="text-xs text-muted">Bu yazini on plana cixan bolmeye gonder.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) => onFormChange("featured", event.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />
                </label>
              </div>
            </section>

            <section className="admin-panel-soft rounded-[28px] p-5">
              <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                {localeLabels[activeLocale]} cover sekli
              </h4>
              <div className="mt-4 space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onCoverImageChange}
                  className="site-input w-full cursor-pointer"
                />

                <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] border border-border/70 bg-surface">
                  {coverImagePreview ? (
                    <Image
                      src={coverImagePreview}
                      alt="Preview"
                      fill
                      unoptimized={coverImagePreview.startsWith("blob:")}
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-muted">
                      Dile aid cover onizlemesi
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="admin-panel-soft rounded-[28px] p-5">
              <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                Qisa onizleme
              </h4>
              <div className="mt-4 space-y-3">
                <p className="text-xs uppercase tracking-[0.16em] text-primary">
                  {localeLabels[activeLocale]} / {form.type === "case-study" ? "Case study" : "Bloq"}
                </p>
                <h5 className="text-xl font-semibold text-foreground">
                  {localeContent.title || "Meqale basligi burada gorunecek"}
                </h5>
                <p className="text-sm leading-6 text-muted">
                  {localeContent.excerpt || "Qisa tesvir istifadecinin meqaleni acib-acmamagina komek edir."}
                </p>
                <p className="text-xs text-muted">
                  /{activeLocale}/blog/{localeContent.slug || "slug-preview"}
                </p>
                {localeContent.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {localeContent.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs text-primary"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </section>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-border/70 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary cursor-pointer text-sm"
          >
            Legv et
          </button>
          <button type="submit" className="btn-primary cursor-pointer text-sm" disabled={saving}>
            <Save className="h-4 w-4" />
            {saving ? "Saxlanilir..." : editingId ? "Deyisiklikleri yadda saxla" : "Meqaleni paylas"}
          </button>
        </div>
      </form>
    </div>
  );
}
