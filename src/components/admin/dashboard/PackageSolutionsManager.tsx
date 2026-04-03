"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Copy, Plus, Save, Sparkles, Trash2 } from "lucide-react";
import {
  AdminAlert,
  AdminLoadingState,
  AdminSectionHeader,
} from "@/components/admin/dashboard/shared";
import {
  BulletsEditor,
  FaqEditor,
  Field,
  InfoListEditor,
  SectionCard,
} from "@/components/admin/dashboard/content-editor-shared";
import {
  createEmptyPackageRecord,
  createInstagramDraftForPackage,
  defaultPackageSolutionsConfig,
  packageLocales,
  sanitizePackageSolutionsConfig,
  type PackageFaqItem,
  type PackageInstagramDraft,
  type PackageLocale,
  type PackageLocaleContent,
  type PackageInfoItem,
  type PackageSolutionRecord,
  type PackageSolutionsConfig,
} from "@/lib/package-solutions";

type PackageSolutionsMode = "content" | "packages" | "instagram";

const localeLabels: Record<PackageLocale, string> = {
  az: "AZ",
  en: "EN",
  ru: "RU",
};

function cloneInstagramDraft(draft: PackageInstagramDraft): PackageInstagramDraft {
  return {
    ...draft,
    slides: draft.slides.map((item) => ({ ...item })),
  };
}

function cloneLocaleContent(content: PackageLocaleContent): PackageLocaleContent {
  return {
    ...content,
    perfectFor: [...content.perfectFor],
    includedModules: [...content.includedModules],
    highlights: content.highlights.map((item) => ({ ...item })),
    faqItems: content.faqItems.map((item) => ({ ...item })),
    instagram: cloneInstagramDraft(content.instagram),
  };
}

function clonePackageRecord(record: PackageSolutionRecord): PackageSolutionRecord {
  return {
    ...record,
    slugs: { ...record.slugs },
    content: {
      az: cloneLocaleContent(record.content.az),
      en: cloneLocaleContent(record.content.en),
      ru: cloneLocaleContent(record.content.ru),
    },
  };
}

function cloneConfig(config: PackageSolutionsConfig): PackageSolutionsConfig {
  return {
    directory: {
      az: { ...config.directory.az },
      en: { ...config.directory.en },
      ru: { ...config.directory.ru },
    },
    packages: config.packages.map(clonePackageRecord),
  };
}

export function PackageSolutionsManager({ mode }: { mode: PackageSolutionsMode }) {
  const [config, setConfig] = useState<PackageSolutionsConfig>(defaultPackageSolutionsConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeLocale, setActiveLocale] = useState<PackageLocale>("az");
  const [activePackageId, setActivePackageId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewVersion, setPreviewVersion] = useState(() => Date.now());

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch("/api/package-solutions", {
        credentials: "include",
        cache: "no-store",
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(response.status === 401 ? "Zəhmət olmasa yenidən daxil olun." : "Paketlər yüklənmədi.");
        return;
      }

      const nextConfig = cloneConfig(sanitizePackageSolutionsConfig(data));
      setConfig(nextConfig);
      setActivePackageId(nextConfig.packages[0]?.id ?? "");
      setPreviewVersion(Date.now());
    } catch {
      setError("Paketləri yükləmək mümkün olmadı.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchConfig();
  }, [fetchConfig]);

  const activePackage = useMemo(
    () => config.packages.find((item) => item.id === activePackageId) ?? config.packages[0] ?? null,
    [activePackageId, config.packages]
  );

  function updateDirectoryField(locale: PackageLocale, key: "badge" | "title" | "description", value: string) {
    setConfig((current) => ({
      ...current,
      directory: {
        ...current.directory,
        [locale]: {
          ...current.directory[locale],
          [key]: value,
        },
      },
    }));
  }

  function updatePackage(updateFn: (pkg: PackageSolutionRecord) => PackageSolutionRecord) {
    if (!activePackage) return;

    setConfig((current) => ({
      ...current,
      packages: current.packages.map((item) => (item.id === activePackage.id ? updateFn(item) : item)),
    }));
  }

  function updateLocaleField<K extends keyof PackageLocaleContent>(
    locale: PackageLocale,
    key: K,
    value: PackageLocaleContent[K]
  ) {
    updatePackage((pkg) => ({
      ...pkg,
      content: {
        ...pkg.content,
        [locale]: {
          ...pkg.content[locale],
          [key]: value,
        },
      },
    }));
  }

  function updateSlug(locale: PackageLocale, value: string) {
    updatePackage((pkg) => ({
      ...pkg,
      slugs: {
        ...pkg.slugs,
        [locale]: value,
      },
    }));
  }

  function updateHighlight(index: number, field: keyof PackageInfoItem, value: string) {
    updatePackage((pkg) => ({
      ...pkg,
      content: {
        ...pkg.content,
        [activeLocale]: {
          ...pkg.content[activeLocale],
          highlights: pkg.content[activeLocale].highlights.map((item, itemIndex) =>
            itemIndex === index ? { ...item, [field]: value } : item
          ),
        },
      },
    }));
  }

  function addHighlight() {
    updatePackage((pkg) => ({
      ...pkg,
      content: {
        ...pkg.content,
        [activeLocale]: {
          ...pkg.content[activeLocale],
          highlights: [...pkg.content[activeLocale].highlights, { title: "", description: "" }],
        },
      },
    }));
  }

  function removeHighlight(index: number) {
    updatePackage((pkg) => ({
      ...pkg,
      content: {
        ...pkg.content,
        [activeLocale]: {
          ...pkg.content[activeLocale],
          highlights: pkg.content[activeLocale].highlights.filter((_, itemIndex) => itemIndex !== index),
        },
      },
    }));
  }

  function updateFaq(index: number, field: keyof PackageFaqItem, value: string) {
    updatePackage((pkg) => ({
      ...pkg,
      content: {
        ...pkg.content,
        [activeLocale]: {
          ...pkg.content[activeLocale],
          faqItems: pkg.content[activeLocale].faqItems.map((item, itemIndex) =>
            itemIndex === index ? { ...item, [field]: value } : item
          ),
        },
      },
    }));
  }

  function addFaq() {
    updatePackage((pkg) => ({
      ...pkg,
      content: {
        ...pkg.content,
        [activeLocale]: {
          ...pkg.content[activeLocale],
          faqItems: [...pkg.content[activeLocale].faqItems, { question: "", answer: "" }],
        },
      },
    }));
  }

  function removeFaq(index: number) {
    updatePackage((pkg) => ({
      ...pkg,
      content: {
        ...pkg.content,
        [activeLocale]: {
          ...pkg.content[activeLocale],
          faqItems: pkg.content[activeLocale].faqItems.filter((_, itemIndex) => itemIndex !== index),
        },
      },
    }));
  }

  function updateInstagramField(
    field: Exclude<keyof PackageInstagramDraft, "slides">,
    value: string
  ) {
    updatePackage((pkg) => ({
      ...pkg,
      content: {
        ...pkg.content,
        [activeLocale]: {
          ...pkg.content[activeLocale],
          instagram: {
            ...pkg.content[activeLocale].instagram,
            [field]: value,
          },
        },
      },
    }));
  }

  function updateInstagramSlide(index: number, field: "title" | "body", value: string) {
    updatePackage((pkg) => ({
      ...pkg,
      content: {
        ...pkg.content,
        [activeLocale]: {
          ...pkg.content[activeLocale],
          instagram: {
            ...pkg.content[activeLocale].instagram,
            slides: pkg.content[activeLocale].instagram.slides.map((item, itemIndex) =>
              itemIndex === index ? { ...item, [field]: value } : item
            ),
          },
        },
      },
    }));
  }

  function addPackage() {
    const nextOrder = config.packages.length + 1;
    const nextId = `package-${nextOrder}`;
    const nextPackage = createEmptyPackageRecord(nextId, nextOrder);

    setConfig((current) => ({
      ...current,
      packages: [...current.packages, nextPackage],
    }));
    setActivePackageId(nextPackage.id);
    setSuccess(null);
    setError(null);
  }

  function removePackage(id: string) {
    const remaining = config.packages.filter((item) => item.id !== id);
    setConfig((current) => ({
      ...current,
      packages: current.packages.filter((item) => item.id !== id).map((item, index) => ({ ...item, order: index + 1 })),
    }));
    setActivePackageId(remaining[0]?.id ?? "");
    setSuccess(null);
    setError(null);
  }

  function movePackage(id: string, direction: -1 | 1) {
    const index = config.packages.findIndex((item) => item.id === id);
    if (index < 0) return;

    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= config.packages.length) return;

    setConfig((current) => {
      const nextPackages = [...current.packages];
      const [item] = nextPackages.splice(index, 1);
      nextPackages.splice(targetIndex, 0, item);

      return {
        ...current,
        packages: nextPackages.map((entry, entryIndex) => ({ ...entry, order: entryIndex + 1 })),
      };
    });
  }

  function generateInstagramDraft() {
    if (!activePackage) return;

    const nextDraft = createInstagramDraftForPackage(activeLocale, activePackage);
    updateLocaleField(activeLocale, "instagram", nextDraft);
    setSuccess("Instagram draftı yeniləndi. İstəsən redaktə edib sonra saxla.");
  }

  async function generateInstagramAssets() {
    if (!activePackage) return;

    const nextConfig = cloneConfig(config);
    const pkg = nextConfig.packages.find((item) => item.id === activePackage.id);
    if (!pkg) return;

    pkg.content[activeLocale].instagram = createInstagramDraftForPackage(activeLocale, pkg);

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await fetch("/api/package-solutions", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextConfig),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(typeof data?.error === "string" ? data.error : "Instagram vizualları hazırlanmadı.");
        return;
      }

      const persistedConfig = cloneConfig(sanitizePackageSolutionsConfig(data));
      setConfig(persistedConfig);
      setActivePackageId((current) => current || persistedConfig.packages[0]?.id || "");
      setPreviewVersion(Date.now());
      setSuccess("Instagram posterləri hazırdır. Aşağıdan preview edib yükləyə bilərsən.");
    } catch {
      setError("Instagram posterlərini yaratmaq mümkün olmadı.");
    } finally {
      setSaving(false);
    }
  }

  async function copyInstagramCaption() {
    if (!activePackage) return;

    const caption = activePackage.content[activeLocale].instagram.caption;
    if (!caption) {
      setError("Kopyalamaq üçün əvvəl caption doldur.");
      return;
    }

    try {
      await navigator.clipboard.writeText(caption);
      setSuccess("Instagram caption kopyalandı.");
    } catch {
      setError("Caption kopyalanmadı.");
    }
  }

  async function saveConfig() {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await fetch("/api/package-solutions", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(typeof data?.error === "string" ? data.error : "Paketləri saxlamaq mümkün olmadı.");
        return;
      }

      const nextConfig = cloneConfig(sanitizePackageSolutionsConfig(data));
      setConfig(nextConfig);
      setActivePackageId((current) => current || nextConfig.packages[0]?.id || "");
      setSuccess("Paketlər yeniləndi.");
      setPreviewVersion(Date.now());
    } catch {
      setError("Paketləri saxlamaq mümkün olmadı.");
    } finally {
      setSaving(false);
    }
  }

  const activeContent = activePackage?.content[activeLocale] ?? null;
  const instagramDraft = activeContent?.instagram;
  const previewFrames =
    activePackage && instagramDraft
      ? [
          {
            key: "cover",
            label: "Cover",
            href: `/api/package-solutions/instagram-preview?packageId=${activePackage.id}&locale=${activeLocale}&frame=cover&v=${previewVersion}`,
          },
          ...instagramDraft.slides.map((_, index) => ({
            key: `slide-${index + 1}`,
            label: `Slide ${index + 1}`,
            href: `/api/package-solutions/instagram-preview?packageId=${activePackage.id}&locale=${activeLocale}&frame=${index + 1}&v=${previewVersion}`,
          })),
        ]
      : [];

  if (loading) {
    return <AdminLoadingState />;
  }

  if (!activePackage || !activeContent || !instagramDraft) {
    return (
      <div className="space-y-6">
        <AdminSectionHeader
          title="Hazır paketlər"
          description="Paketləri qur, lokal mətnləri doldur və Instagram post draftlarını hazırla."
          actions={
            <button type="button" onClick={addPackage} className="btn-secondary cursor-pointer">
              <Plus className="h-4 w-4" />
              Paket əlavə et
            </button>
          }
        />
        {error ? <AdminAlert title="Xəta">{error}</AdminAlert> : null}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        title="Hazır paketlər"
        description="Paket modulunu mərhələli idarə et: əvvəl əsas məlumatları, sonra məzmunu, sonda isə Instagram posterlərini hazırla."
        actions={
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={addPackage} className="btn-secondary cursor-pointer">
              <Plus className="h-4 w-4" />
              Paket əlavə et
            </button>
            {mode !== "instagram" ? (
              <button type="button" onClick={() => void saveConfig()} disabled={saving} className="btn-primary cursor-pointer">
                <Save className="h-4 w-4" />
                {saving ? "Saxlanılır..." : "Dəyişiklikləri saxla"}
              </button>
            ) : null}
          </div>
        }
      />

      {error ? <AdminAlert title="Xəta">{error}</AdminAlert> : null}
      {success ? <AdminAlert tone="success" title="Hazırdır">{success}</AdminAlert> : null}

      <div className={`grid gap-6 ${mode === "content" ? "" : "xl:grid-cols-[340px_minmax(0,1fr)]"}`}>
        {mode !== "content" ? (
          <aside className="space-y-6">
            <SectionCard title="Paketlər">
              <div className="space-y-3">
                {config.packages.map((item, index) => {
                  const title = item.content[activeLocale].cardTitle || item.content.az.cardTitle || item.id;
                  const isActive = item.id === activePackage.id;

                  return (
                    <div
                      key={item.id}
                      className={`w-full rounded-[28px] border p-5 text-left transition ${
                        isActive
                          ? "border-primary/40 bg-primary/10 shadow-soft"
                          : "border-border/70 bg-surface/40 hover:border-primary/20 hover:bg-surface/70"
                      }`}
                    >
                      <button type="button" onClick={() => setActivePackageId(item.id)} className="block w-full text-left">
                        <div className="text-[1.05rem] font-semibold leading-[1.35] text-foreground">{title}</div>
                      </button>

                      <div className="mt-5 flex items-end justify-between gap-4">
                        <div className="min-w-0 space-y-2">
                          <div className="text-[11px] uppercase tracking-[0.24em] text-muted">{item.category}</div>
                          <div className="text-xs text-muted">Sıra: {index + 1}</div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <button type="button" onClick={() => movePackage(item.id, -1)} className="site-control h-8 w-8 rounded-full">
                            <ArrowUp className="h-4 w-4" />
                          </button>
                          <button type="button" onClick={() => movePackage(item.id, 1)} className="site-control h-8 w-8 rounded-full">
                            <ArrowDown className="h-4 w-4" />
                          </button>
                          <button type="button" onClick={() => removePackage(item.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-300">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            <SectionCard title="Dil seçimi">
              <div className="flex flex-wrap gap-2">
                {packageLocales.map((locale) => (
                  <button
                    key={locale}
                    type="button"
                    onClick={() => setActiveLocale(locale)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      activeLocale === locale
                        ? "bg-primary text-white"
                        : "border border-border/70 bg-surface/50 text-muted hover:border-primary/20 hover:text-foreground"
                    }`}
                  >
                    {localeLabels[locale]}
                  </button>
                ))}
              </div>
            </SectionCard>
          </aside>
        ) : null}

        <div className="space-y-6">
          {mode === "content" ? (
            <>
              <SectionCard title="List page">
                {packageLocales.map((locale) => (
                  <div key={locale} className="rounded-2xl border border-border/70 bg-surface/40 p-4">
                    <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                      {localeLabels[locale]}
                    </div>
                    <div className="space-y-3">
                      <Field label="Badge" value={config.directory[locale].badge} onChange={(value) => updateDirectoryField(locale, "badge", value)} />
                      <Field label="Başlıq" value={config.directory[locale].title} onChange={(value) => updateDirectoryField(locale, "title", value)} />
                      <Field label="Təsvir" value={config.directory[locale].description} onChange={(value) => updateDirectoryField(locale, "description", value)} multiline />
                    </div>
                  </div>
                ))}
              </SectionCard>

              <SectionCard title="Paket məlumatı">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="ID" value={activePackage.id} onChange={(value) => updatePackage((pkg) => ({ ...pkg, id: value }))} />
                  <Field label="Kateqoriya" value={activePackage.category} onChange={(value) => updatePackage((pkg) => ({ ...pkg, category: value }))} />
                  <Field label="Cover image URL" value={activePackage.coverImageUrl} onChange={(value) => updatePackage((pkg) => ({ ...pkg, coverImageUrl: value }))} />
                  <Field label="Start qiymət" value={String(activePackage.startingPrice)} onChange={(value) => updatePackage((pkg) => ({ ...pkg, startingPrice: Number(value) || 0 }))} />
                </div>
              </SectionCard>
            </>
          ) : null}

          {mode === "packages" ? (
            <>
              <SectionCard title={`Lokal məzmun • ${localeLabels[activeLocale]}`}>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Slug" value={activePackage.slugs[activeLocale]} onChange={(value) => updateSlug(activeLocale, value)} />
                  <Field label="Kart başlığı" value={activeContent.cardTitle} onChange={(value) => updateLocaleField(activeLocale, "cardTitle", value)} />
                  <Field label="Kart təsviri" value={activeContent.cardDescription} onChange={(value) => updateLocaleField(activeLocale, "cardDescription", value)} multiline />
                  <Field label="Hero badge" value={activeContent.heroBadge} onChange={(value) => updateLocaleField(activeLocale, "heroBadge", value)} />
                  <Field label="Hero başlıq" value={activeContent.heroTitle} onChange={(value) => updateLocaleField(activeLocale, "heroTitle", value)} />
                  <Field label="Hero təsviri" value={activeContent.heroDescription} onChange={(value) => updateLocaleField(activeLocale, "heroDescription", value)} multiline />
                  <Field label="Audience başlığı" value={activeContent.audienceTitle} onChange={(value) => updateLocaleField(activeLocale, "audienceTitle", value)} />
                  <Field label="Audience təsviri" value={activeContent.audienceDescription} onChange={(value) => updateLocaleField(activeLocale, "audienceDescription", value)} multiline />
                  <Field label="Perfect for başlığı" value={activeContent.perfectForTitle} onChange={(value) => updateLocaleField(activeLocale, "perfectForTitle", value)} />
                  <Field label="Included başlığı" value={activeContent.includedTitle} onChange={(value) => updateLocaleField(activeLocale, "includedTitle", value)} />
                  <Field label="Highlights başlığı" value={activeContent.highlightsTitle} onChange={(value) => updateLocaleField(activeLocale, "highlightsTitle", value)} />
                  <Field label="FAQ başlığı" value={activeContent.faqTitle} onChange={(value) => updateLocaleField(activeLocale, "faqTitle", value)} />
                  <Field label="FAQ təsviri" value={activeContent.faqDescription} onChange={(value) => updateLocaleField(activeLocale, "faqDescription", value)} multiline />
                  <Field label="Timeline label" value={activeContent.timelineLabel} onChange={(value) => updateLocaleField(activeLocale, "timelineLabel", value)} />
                  <Field label="Primary CTA" value={activeContent.primaryCta} onChange={(value) => updateLocaleField(activeLocale, "primaryCta", value)} />
                  <Field label="Secondary CTA" value={activeContent.secondaryCta} onChange={(value) => updateLocaleField(activeLocale, "secondaryCta", value)} />
                  <Field label="SEO title" value={activeContent.seoTitle} onChange={(value) => updateLocaleField(activeLocale, "seoTitle", value)} />
                  <Field label="SEO description" value={activeContent.seoDescription} onChange={(value) => updateLocaleField(activeLocale, "seoDescription", value)} multiline />
                </div>
              </SectionCard>

              <SectionCard title="Perfect for">
                <BulletsEditor
                  bullets={activeContent.perfectFor}
                  onAdd={() => updateLocaleField(activeLocale, "perfectFor", [...activeContent.perfectFor, ""])}
                  onRemove={(index) => updateLocaleField(activeLocale, "perfectFor", activeContent.perfectFor.filter((_, itemIndex) => itemIndex !== index))}
                  onChange={(index, value) =>
                    updateLocaleField(
                      activeLocale,
                      "perfectFor",
                      activeContent.perfectFor.map((item, itemIndex) => (itemIndex === index ? value : item))
                    )
                  }
                />
              </SectionCard>

              <SectionCard title="Included modules">
                <BulletsEditor
                  bullets={activeContent.includedModules}
                  onAdd={() => updateLocaleField(activeLocale, "includedModules", [...activeContent.includedModules, ""])}
                  onRemove={(index) => updateLocaleField(activeLocale, "includedModules", activeContent.includedModules.filter((_, itemIndex) => itemIndex !== index))}
                  onChange={(index, value) =>
                    updateLocaleField(
                      activeLocale,
                      "includedModules",
                      activeContent.includedModules.map((item, itemIndex) => (itemIndex === index ? value : item))
                    )
                  }
                />
              </SectionCard>

              <SectionCard title="Highlights və FAQ">
                <div className="grid gap-6 xl:grid-cols-2">
                  <div>
                    <InfoListEditor
                      items={activeContent.highlights}
                      addLabel="Highlight əlavə et"
                      onAdd={addHighlight}
                      onRemove={removeHighlight}
                      onTitleChange={(index, value) => updateHighlight(index, "title", value)}
                      onDescriptionChange={(index, value) => updateHighlight(index, "description", value)}
                    />
                  </div>
                  <div>
                    <FaqEditor
                      items={activeContent.faqItems}
                      onAdd={addFaq}
                      onRemove={removeFaq}
                      onChange={(index, field, value) => updateFaq(index, field, value)}
                    />
                  </div>
                </div>
              </SectionCard>
            </>
          ) : null}

          {mode === "instagram" ? (
            <>
              <SectionCard title="Instagram posterlərini yarat">
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={() => void generateInstagramAssets()} disabled={saving} className="btn-primary cursor-pointer">
                    <Sparkles className="h-4 w-4" />
                    {saving ? "Hazırlanır..." : "Yüksək keyfiyyətli posterləri hazırla"}
                  </button>
                  <button type="button" onClick={generateInstagramDraft} className="btn-secondary cursor-pointer">
                    <Sparkles className="h-4 w-4" />
                    Mətni yenilə
                  </button>
                  <button type="button" onClick={() => void copyInstagramCaption()} className="btn-secondary cursor-pointer">
                    <Copy className="h-4 w-4" />
                    Caption-u kopyala
                  </button>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <Field label="Cover başlığı" value={instagramDraft.coverTitle} onChange={(value) => updateInstagramField("coverTitle", value)} />
                  <Field label="Cover subtitle" value={instagramDraft.coverSubtitle} onChange={(value) => updateInstagramField("coverSubtitle", value)} />
                  <Field label="CTA" value={instagramDraft.cta} onChange={(value) => updateInstagramField("cta", value)} />
                  <Field label="Caption" value={instagramDraft.caption} onChange={(value) => updateInstagramField("caption", value)} multiline />
                </div>

                <div className="mt-6 space-y-4">
                  {instagramDraft.slides.map((slide, index) => (
                    <div key={`slide-${index}`} className="rounded-2xl border border-border/70 bg-surface/40 p-4">
                      <div className="mb-3 text-sm font-semibold text-foreground">Slide {index + 1}</div>
                      <div className="grid gap-3">
                        <Field label="Başlıq" value={slide.title} onChange={(value) => updateInstagramSlide(index, "title", value)} />
                        <Field label="Mətn" value={slide.body} onChange={(value) => updateInstagramSlide(index, "body", value)} multiline />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Hazır vizual preview">
                <div className="grid gap-5 lg:grid-cols-2">
                  {previewFrames.map((frame) => (
                    <div key={frame.key} className="rounded-[24px] border border-border/70 bg-surface/40 p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-foreground">{frame.label}</div>
                        <a href={frame.href} download={`${activePackage.id}-${activeLocale}-${frame.key}.png`} className="btn-secondary text-xs">
                          Yüklə
                        </a>
                      </div>
                      <div className="overflow-hidden rounded-[20px] border border-border/70 bg-background/60">
                        <Image
                          src={frame.href}
                          alt={frame.label}
                          width={540}
                          height={675}
                          unoptimized
                          className="h-auto w-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
