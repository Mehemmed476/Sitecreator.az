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
  Field,
  SectionCard,
} from "@/components/admin/dashboard/content-editor-shared";
import { PackagePresetEditor } from "@/components/admin/dashboard/package-solutions/PackagePresetEditor";
import { PackageSolutionsSidebar } from "@/components/admin/dashboard/package-solutions/PackageSolutionsSidebar";
import {
  buildPackagePresetSummary,
  type PackageCalculatorPreset,
} from "@/lib/package-calculator-preset";
import {
  createEmptyPackageRecord,
  createInstagramDraftForPackage,
  defaultPackageSolutionsConfig,
  packageLocales,
  sanitizePackageSolutionsConfig,
  type PackageInstagramDraft,
  type PackageLocale,
  type PackageLocaleContent,
  type PackageSolutionRecord,
  type PackageSolutionsConfig,
} from "@/lib/package-solutions";
import { defaultPriceCalculatorConfig, getLocalizedText, sanitizePriceCalculatorConfig, type PriceCalculatorConfig } from "@/lib/price-calculator";
import {
  clonePackageSolutionsConfig,
  syncPackageSolutionsConfig,
  syncPackageWithCalculator,
} from "@/lib/package-solutions-sync";

type PackageSolutionsMode = "content" | "packages" | "instagram";

const localeLabels: Record<PackageLocale, string> = {
  az: "AZ",
  en: "EN",
  ru: "RU",
};

export function PackageSolutionsManager({ mode }: { mode: PackageSolutionsMode }) {
  const [config, setConfig] = useState<PackageSolutionsConfig>(defaultPackageSolutionsConfig);
  const [calculatorConfig, setCalculatorConfig] = useState<PriceCalculatorConfig>(
    defaultPriceCalculatorConfig
  );
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

      const [response, calculatorResponse] = await Promise.all([
        fetch("/api/package-solutions", {
          credentials: "include",
          cache: "no-store",
        }),
        fetch("/api/price-calculator", {
          credentials: "include",
          cache: "no-store",
        }),
      ]);
      const data = await response.json().catch(() => null);
      const calculatorData = await calculatorResponse.json().catch(() => null);

      if (!response.ok) {
        setError(response.status === 401 ? "Zəhmət olmasa yenidən daxil olun." : "Paketlər yüklənmədi.");
        return;
      }

      const nextCalculatorConfig = calculatorResponse.ok
        ? sanitizePriceCalculatorConfig(calculatorData)
        : defaultPriceCalculatorConfig;
      const nextConfig = syncPackageSolutionsConfig(
        clonePackageSolutionsConfig(sanitizePackageSolutionsConfig(data)),
        nextCalculatorConfig
      );
      setCalculatorConfig(nextCalculatorConfig);
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
      packages: current.packages.map((item) =>
        item.id === activePackage.id ? syncPackageWithCalculator(updateFn(item), calculatorConfig) : item
      ),
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

  function updateCalculatorPreset<K extends keyof PackageCalculatorPreset>(
    key: K,
    value: PackageCalculatorPreset[K]
  ) {
    updatePackage((pkg) => ({
      ...pkg,
      calculatorPreset: {
        ...pkg.calculatorPreset,
        [key]: value,
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
    const nextPackage = syncPackageWithCalculator(
      createEmptyPackageRecord(nextId, nextOrder),
      calculatorConfig
    );

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

    const nextConfig = clonePackageSolutionsConfig(config);
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
        body: JSON.stringify(syncPackageSolutionsConfig(nextConfig, calculatorConfig)),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(typeof data?.error === "string" ? data.error : "Instagram vizualları hazırlanmadı.");
        return;
      }

      const persistedConfig = clonePackageSolutionsConfig(sanitizePackageSolutionsConfig(data));
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
        body: JSON.stringify(syncPackageSolutionsConfig(config, calculatorConfig)),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(typeof data?.error === "string" ? data.error : "Paketləri saxlamaq mümkün olmadı.");
        return;
      }

      const nextConfig = clonePackageSolutionsConfig(sanitizePackageSolutionsConfig(data));
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
  const activePresetSummary =
    activePackage && activeContent
      ? buildPackagePresetSummary(activeLocale, calculatorConfig, activePackage.calculatorPreset)
      : null;
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
          <PackageSolutionsSidebar
            packages={config.packages}
            activeLocale={activeLocale}
            activePackageId={activePackage?.id ?? ""}
            onSelectLocale={setActiveLocale}
            onSelectPackage={setActivePackageId}
            onMovePackage={movePackage}
            onRemovePackage={removePackage}
          />
        ) : null}
        {false ? (
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
            </>
          ) : null}

          {mode === "packages" ? (
            <>
              <SectionCard title="Paket ayarları">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="ID" value={activePackage.id} onChange={(value) => updatePackage((pkg) => ({ ...pkg, id: value }))} />
                  <Field label="Kateqoriya" value={activePackage.category} onChange={(value) => updatePackage((pkg) => ({ ...pkg, category: value }))} />
                  <Field label="Cover image URL" value={activePackage.coverImageUrl} onChange={(value) => updatePackage((pkg) => ({ ...pkg, coverImageUrl: value }))} />
                  <Field label="Start qiymət" value={`₼ ${activePackage.startingPrice.toLocaleString("en-US")}`} onChange={() => {}} />
                </div>
              </SectionCard>

              <SectionCard title={`Lokal məzmun • ${localeLabels[activeLocale]}`}>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Slug" value={activePackage.slugs[activeLocale]} onChange={(value) => updateSlug(activeLocale, value)} />
                  <Field label="Kart başlığı" value={activeContent.cardTitle} onChange={(value) => updateLocaleField(activeLocale, "cardTitle", value)} />
                  <Field label="Kart təsviri" value={activeContent.cardDescription} onChange={(value) => updateLocaleField(activeLocale, "cardDescription", value)} multiline />
                  <Field label="Hero badge" value={activeContent.heroBadge} onChange={(value) => updateLocaleField(activeLocale, "heroBadge", value)} />
                  <Field label="Hero başlıq" value={activeContent.heroTitle} onChange={(value) => updateLocaleField(activeLocale, "heroTitle", value)} />
                  <Field label="Hero təsviri" value={activeContent.heroDescription} onChange={(value) => updateLocaleField(activeLocale, "heroDescription", value)} multiline />
                  <Field label="Primary CTA" value={activeContent.primaryCta} onChange={(value) => updateLocaleField(activeLocale, "primaryCta", value)} />
                  <Field label="Secondary CTA" value={activeContent.secondaryCta} onChange={(value) => updateLocaleField(activeLocale, "secondaryCta", value)} />
                  <Field label="SEO title" value={activeContent.seoTitle} onChange={(value) => updateLocaleField(activeLocale, "seoTitle", value)} />
                  <Field label="SEO description" value={activeContent.seoDescription} onChange={(value) => updateLocaleField(activeLocale, "seoDescription", value)} multiline />
                </div>
              </SectionCard>

              <PackagePresetEditor
                activeLocale={activeLocale}
                activePackage={activePackage}
                calculatorConfig={calculatorConfig}
                activePresetSummary={activePresetSummary}
                onUpdatePreset={updateCalculatorPreset}
              />

              {false ? (
                <>
              <SectionCard title="Kalkulyator preset">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">Xidmət</span>
                    <select
                      value={activePackage.calculatorPreset.serviceId}
                      onChange={(event) =>
                        updateCalculatorPreset("serviceId", event.target.value as PackageCalculatorPreset["serviceId"])
                      }
                      className="site-input w-full"
                    >
                      {calculatorConfig.services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {getLocalizedText(activeLocale, service.name)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">
                      {activePresetSummary?.unitLabel || "Sayı"}
                    </span>
                    <input
                      type="number"
                      min={1}
                      value={activePackage.calculatorPreset.unitCount}
                      onChange={(event) =>
                        updateCalculatorPreset("unitCount", Math.max(1, Number(event.target.value) || 1))
                      }
                      className="site-input w-full"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">Dizayn</span>
                    <select
                      value={activePackage.calculatorPreset.designId}
                      onChange={(event) => updateCalculatorPreset("designId", event.target.value)}
                      className="site-input w-full"
                    >
                      {calculatorConfig.designOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {getLocalizedText(activeLocale, option.label)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">Logo</span>
                    <select
                      value={activePackage.calculatorPreset.logoId}
                      onChange={(event) => updateCalculatorPreset("logoId", event.target.value)}
                      className="site-input w-full"
                    >
                      {calculatorConfig.logoOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {getLocalizedText(activeLocale, option.label)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">Müddət</span>
                    <select
                      value={activePackage.calculatorPreset.timelineId}
                      onChange={(event) => updateCalculatorPreset("timelineId", event.target.value)}
                      className="site-input w-full"
                    >
                      {calculatorConfig.timelineOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {getLocalizedText(activeLocale, option.label)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">Dəstək</span>
                    <select
                      value={activePackage.calculatorPreset.supportId}
                      onChange={(event) => updateCalculatorPreset("supportId", event.target.value)}
                      className="site-input w-full"
                    >
                      {calculatorConfig.supportOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {getLocalizedText(activeLocale, option.label)}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </SectionCard>

              <SectionCard title="Kalkulyator əlavələri">
                <div className="grid gap-6 xl:grid-cols-2">
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-foreground">Layihə əlavələri</div>
                    <div className="grid gap-3">
                      {(calculatorConfig.addOnGroups.find((group) => group.id === "build")?.items ?? []).map((item) => {
                        const checked = activePackage.calculatorPreset.selectedBuild.includes(item.id);

                        return (
                          <label key={item.id} className="site-card-subtle flex items-start gap-3 rounded-2xl p-4">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                updateCalculatorPreset(
                                  "selectedBuild",
                                  checked
                                    ? activePackage.calculatorPreset.selectedBuild.filter((entry) => entry !== item.id)
                                    : [...activePackage.calculatorPreset.selectedBuild, item.id]
                                )
                              }
                              className="mt-1 h-4 w-4 rounded border-border bg-transparent accent-[var(--color-primary)]"
                            />
                            <span className="text-sm text-foreground">
                              {getLocalizedText(activeLocale, item.label)}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-foreground">SEO əlavələri</div>
                    <div className="grid gap-3">
                      {(calculatorConfig.addOnGroups.find((group) => group.id === "seo")?.items ?? []).map((item) => {
                        const checked = activePackage.calculatorPreset.selectedSeo.includes(item.id);

                        return (
                          <label key={item.id} className="site-card-subtle flex items-start gap-3 rounded-2xl p-4">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                updateCalculatorPreset(
                                  "selectedSeo",
                                  checked
                                    ? activePackage.calculatorPreset.selectedSeo.filter((entry) => entry !== item.id)
                                    : [...activePackage.calculatorPreset.selectedSeo, item.id]
                                )
                              }
                              className="mt-1 h-4 w-4 rounded border-border bg-transparent accent-[var(--color-primary)]"
                            />
                            <span className="text-sm text-foreground">
                              {getLocalizedText(activeLocale, item.label)}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Avtomatik xülasə">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="site-card-subtle rounded-2xl p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-muted">Start qiymət</div>
                    <div className="mt-2 text-2xl font-semibold text-foreground">
                      ₼ {activePackage.startingPrice.toLocaleString("en-US")}
                    </div>
                  </div>
                  <div className="site-card-subtle rounded-2xl p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-muted">Müddət</div>
                    <div className="mt-2 text-base font-semibold text-foreground">
                      {activePresetSummary?.timelineLabel || "-"}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {(activePresetSummary?.includedModules ?? []).map((item, index) => (
                    <div key={`${item}-${index}`} className="site-card-subtle rounded-2xl p-4 text-sm text-foreground">
                      {item}
                    </div>
                  ))}
                </div>
              </SectionCard>
                </>
              ) : null}
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
