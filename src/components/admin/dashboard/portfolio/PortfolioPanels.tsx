"use client";

import Image from "next/image";
import {
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import { FolderKanban, Globe2, Pencil, Save, Star, Trash2, X } from "lucide-react";
import type { PortfolioItem } from "@/components/admin/dashboard/types";
import {
  getPortfolioTranslation,
  portfolioLocales,
  type PortfolioLocale,
  type PortfolioTranslations,
} from "@/lib/portfolio-types";

export type PortfolioFormState = {
  title: string;
  imageUrl: string;
  techStack: string;
  translations: PortfolioTranslations;
};

export const portfolioLocaleLabels: Record<PortfolioLocale, string> = {
  az: "AZ",
  en: "EN",
  ru: "RU",
};

export function PortfolioSummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof FolderKanban | typeof Star | typeof Globe2;
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

export function FeaturedProjectsPanel({
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

export function PortfolioFormModal({
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
                  <p className="mt-1 text-xs text-muted">Hər dil üçün ayrıca təsvir və link yaz.</p>
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
                      {portfolioLocaleLabels[locale]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">
                    {portfolioLocaleLabels[activeLocale]} təsviri
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
                    {portfolioLocaleLabels[activeLocale]} layihə linki
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
                  {portfolioLocaleLabels[activeLocale]} portfolio kartı
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

export function PortfolioListItem({
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
