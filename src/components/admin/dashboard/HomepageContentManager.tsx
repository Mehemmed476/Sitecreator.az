"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, Save } from "lucide-react";
import {
  AdminAlert,
  AdminLoadingState,
  AdminSectionHeader,
} from "@/components/admin/dashboard/shared";
import {
  BulletsEditor,
  Field,
  InfoListEditor,
  SectionCard,
} from "@/components/admin/dashboard/content-editor-shared";
import {
  defaultHomepageContent,
  type HomepageContent,
  type HomepageLocale,
  type HomepageLocaleContent,
} from "@/lib/homepage-content";

const localeLabels: Record<HomepageLocale, string> = {
  az: "AZ",
  en: "EN",
  ru: "RU",
};

function cloneHomepageContent(content: HomepageContent): HomepageContent {
  const cloneLocale = (localeContent: HomepageLocaleContent): HomepageLocaleContent => ({
    ...localeContent,
    serviceItems: localeContent.serviceItems.map((item) => ({ ...item })),
    whyUsItems: localeContent.whyUsItems.map((item) => ({ ...item })),
    portalFeatureItems: localeContent.portalFeatureItems.map((item) => ({ ...item })),
    marketBullets: [...localeContent.marketBullets],
  });

  return {
    az: cloneLocale(content.az),
    en: cloneLocale(content.en),
    ru: cloneLocale(content.ru),
  };
}

export function HomepageContentManager() {
  const [content, setContent] = useState<HomepageContent>(defaultHomepageContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeLocale, setActiveLocale] = useState<HomepageLocale>("az");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch("/api/homepage-content", {
        credentials: "include",
        cache: "no-store",
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(
          response.status === 401
            ? "Zəhmət olmasa yenidən daxil olun."
            : "Ana səhifə məzmununu yükləmək olmadı."
        );
        return;
      }

      setContent(cloneHomepageContent((data ?? defaultHomepageContent) as HomepageContent));
    } catch {
      setError("Ana səhifə məzmununu yükləmək olmadı.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchContent();
  }, [fetchContent]);

  function updateField<K extends keyof HomepageLocaleContent>(
    locale: HomepageLocale,
    key: K,
    value: HomepageLocaleContent[K]
  ) {
    setContent((current) => ({
      ...current,
      [locale]: {
        ...current[locale],
        [key]: value,
      },
    }));
  }

  function updateInfoItem(
    locale: HomepageLocale,
    key: "serviceItems" | "whyUsItems" | "portalFeatureItems",
    index: number,
    field: "title" | "description",
    value: string
  ) {
    setContent((current) => ({
      ...current,
      [locale]: {
        ...current[locale],
        [key]: current[locale][key].map((item, itemIndex) =>
          itemIndex === index ? { ...item, [field]: value } : item
        ),
      },
    }));
  }

  function addInfoItem(
    locale: HomepageLocale,
    key: "serviceItems" | "whyUsItems" | "portalFeatureItems"
  ) {
    setContent((current) => ({
      ...current,
      [locale]: {
        ...current[locale],
        [key]: [...current[locale][key], { title: "", description: "" }],
      },
    }));
  }

  function removeInfoItem(
    locale: HomepageLocale,
    key: "serviceItems" | "whyUsItems" | "portalFeatureItems",
    index: number
  ) {
    setContent((current) => ({
      ...current,
      [locale]: {
        ...current[locale],
        [key]: current[locale][key].filter((_, itemIndex) => itemIndex !== index),
      },
    }));
  }

  function updateBullet(locale: HomepageLocale, index: number, value: string) {
    setContent((current) => ({
      ...current,
      [locale]: {
        ...current[locale],
        marketBullets: current[locale].marketBullets.map((item, itemIndex) =>
          itemIndex === index ? value : item
        ),
      },
    }));
  }

  function addBullet(locale: HomepageLocale) {
    setContent((current) => ({
      ...current,
      [locale]: {
        ...current[locale],
        marketBullets: [...current[locale].marketBullets, ""],
      },
    }));
  }

  function removeBullet(locale: HomepageLocale, index: number) {
    setContent((current) => ({
      ...current,
      [locale]: {
        ...current[locale],
        marketBullets: current[locale].marketBullets.filter((_, itemIndex) => itemIndex !== index),
      },
    }));
  }

  function copyFromAz(targetLocale: HomepageLocale) {
    if (targetLocale === "az") {
      return;
    }

    setContent((current) => ({
      ...current,
      [targetLocale]: {
        ...current.az,
        serviceItems: current.az.serviceItems.map((item) => ({ ...item })),
        whyUsItems: current.az.whyUsItems.map((item) => ({ ...item })),
        portalFeatureItems: current.az.portalFeatureItems.map((item) => ({ ...item })),
        marketBullets: [...current.az.marketBullets],
      },
    }));
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await fetch("/api/homepage-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(content),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.error ? String(data.error) : "Ana səhifə məzmununu saxlamaq olmadı.");
        return;
      }

      setContent(cloneHomepageContent((data ?? defaultHomepageContent) as HomepageContent));
      setSuccess("Ana səhifə məzmunu yeniləndi.");
    } catch {
      setError("Ana səhifə məzmununu saxlamaq olmadı.");
    } finally {
      setSaving(false);
    }
  }

  const localeContent = content[activeLocale];

  return (
    <div>
      <AdminSectionHeader
        title="Ana səhifə məzmunu"
        description="Hero, xidmətlər, client portal feature, niyə biz, SEO bloku, CTA və seçilən layihələr mətnlərini 3 dil üçün idarə et."
        actions={
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="btn-primary cursor-pointer text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saxlanılır..." : "Yadda saxla"}
          </button>
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
        <div className="space-y-6">
          <div className="admin-panel-soft rounded-[28px] p-4">
            <div className="flex flex-wrap gap-2">
              {(["az", "en", "ru"] as HomepageLocale[]).map((locale) => (
                <button
                  key={locale}
                  type="button"
                  onClick={() => setActiveLocale(locale)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    activeLocale === locale
                      ? "bg-primary text-white"
                      : "border border-border bg-background text-foreground hover:border-primary"
                  }`}
                >
                  {localeLabels[locale]}
                </button>
              ))}
              {activeLocale !== "az" ? (
                <button
                  type="button"
                  onClick={() => copyFromAz(activeLocale)}
                  className="btn-secondary cursor-pointer text-sm"
                >
                  <Copy className="h-4 w-4" />
                  AZ-dən {localeLabels[activeLocale]} dilinə köçür
                </button>
              ) : null}
            </div>
          </div>

          <SectionCard title={`${localeLabels[activeLocale]} Hero`}>
            <Field
              label="Badge"
              value={localeContent.heroBadge}
              onChange={(value) => updateField(activeLocale, "heroBadge", value)}
            />
            <Field
              label="Başlıq"
              value={localeContent.heroTitle}
              onChange={(value) => updateField(activeLocale, "heroTitle", value)}
            />
            <Field
              label="Başlıq vurğusu"
              value={localeContent.heroTitleHighlight}
              onChange={(value) => updateField(activeLocale, "heroTitleHighlight", value)}
            />
            <Field
              label="Təsvir"
              value={localeContent.heroDescription}
              onChange={(value) => updateField(activeLocale, "heroDescription", value)}
              multiline
            />
            <Field
              label="Əsas CTA"
              value={localeContent.heroPrimaryCta}
              onChange={(value) => updateField(activeLocale, "heroPrimaryCta", value)}
            />
            <Field
              label="İkinci CTA"
              value={localeContent.heroSecondaryCta}
              onChange={(value) => updateField(activeLocale, "heroSecondaryCta", value)}
            />
          </SectionCard>

          <SectionCard title={`${localeLabels[activeLocale]} Xidmətlər`}>
            <Field
              label="Bölmə başlığı"
              value={localeContent.servicesTitle}
              onChange={(value) => updateField(activeLocale, "servicesTitle", value)}
            />
            <Field
              label="Bölmə təsviri"
              value={localeContent.servicesDescription}
              onChange={(value) => updateField(activeLocale, "servicesDescription", value)}
              multiline
            />
            <InfoListEditor
              items={localeContent.serviceItems}
              addLabel="Xidmət əlavə et"
              onAdd={() => addInfoItem(activeLocale, "serviceItems")}
              onRemove={(index) => removeInfoItem(activeLocale, "serviceItems", index)}
              onTitleChange={(index, value) =>
                updateInfoItem(activeLocale, "serviceItems", index, "title", value)
              }
              onDescriptionChange={(index, value) =>
                updateInfoItem(activeLocale, "serviceItems", index, "description", value)
              }
            />
          </SectionCard>

          <SectionCard title={`${localeLabels[activeLocale]} Niyə biz`}>
            <Field
              label="Bölmə başlığı"
              value={localeContent.whyUsTitle}
              onChange={(value) => updateField(activeLocale, "whyUsTitle", value)}
            />
            <Field
              label="Bölmə təsviri"
              value={localeContent.whyUsDescription}
              onChange={(value) => updateField(activeLocale, "whyUsDescription", value)}
              multiline
            />
            <InfoListEditor
              items={localeContent.whyUsItems}
              addLabel="Üstünlük əlavə et"
              onAdd={() => addInfoItem(activeLocale, "whyUsItems")}
              onRemove={(index) => removeInfoItem(activeLocale, "whyUsItems", index)}
              onTitleChange={(index, value) =>
                updateInfoItem(activeLocale, "whyUsItems", index, "title", value)
              }
              onDescriptionChange={(index, value) =>
                updateInfoItem(activeLocale, "whyUsItems", index, "description", value)
              }
            />
          </SectionCard>

          <SectionCard title={`${localeLabels[activeLocale]} Client portal feature`}>
            <Field
              label="Eyebrow"
              value={localeContent.portalFeatureEyebrow}
              onChange={(value) => updateField(activeLocale, "portalFeatureEyebrow", value)}
            />
            <Field
              label="Başlıq"
              value={localeContent.portalFeatureTitle}
              onChange={(value) => updateField(activeLocale, "portalFeatureTitle", value)}
            />
            <Field
              label="Təsvir"
              value={localeContent.portalFeatureDescription}
              onChange={(value) => updateField(activeLocale, "portalFeatureDescription", value)}
              multiline
            />
            <Field
              label="Əsas CTA"
              value={localeContent.portalFeaturePrimaryCta}
              onChange={(value) => updateField(activeLocale, "portalFeaturePrimaryCta", value)}
            />
            <Field
              label="İkinci CTA"
              value={localeContent.portalFeatureSecondaryCta}
              onChange={(value) => updateField(activeLocale, "portalFeatureSecondaryCta", value)}
            />
            <InfoListEditor
              items={localeContent.portalFeatureItems}
              addLabel="Feature kartı əlavə et"
              onAdd={() => addInfoItem(activeLocale, "portalFeatureItems")}
              onRemove={(index) => removeInfoItem(activeLocale, "portalFeatureItems", index)}
              onTitleChange={(index, value) =>
                updateInfoItem(activeLocale, "portalFeatureItems", index, "title", value)
              }
              onDescriptionChange={(index, value) =>
                updateInfoItem(activeLocale, "portalFeatureItems", index, "description", value)
              }
            />
          </SectionCard>

          <SectionCard title={`${localeLabels[activeLocale]} SEO bloku`}>
            <Field
              label="Kicker"
              value={localeContent.marketEyebrow}
              onChange={(value) => updateField(activeLocale, "marketEyebrow", value)}
            />
            <Field
              label="Başlıq"
              value={localeContent.marketTitle}
              onChange={(value) => updateField(activeLocale, "marketTitle", value)}
            />
            <Field
              label="Giriş"
              value={localeContent.marketIntro}
              onChange={(value) => updateField(activeLocale, "marketIntro", value)}
              multiline
            />
            <BulletsEditor
              bullets={localeContent.marketBullets}
              onAdd={() => addBullet(activeLocale)}
              onRemove={(index) => removeBullet(activeLocale, index)}
              onChange={(index, value) => updateBullet(activeLocale, index, value)}
            />
          </SectionCard>

          <SectionCard title={`${localeLabels[activeLocale]} CTA və seçilənlər`}>
            <Field
              label="CTA başlığı"
              value={localeContent.ctaTitle}
              onChange={(value) => updateField(activeLocale, "ctaTitle", value)}
            />
            <Field
              label="CTA təsviri"
              value={localeContent.ctaDescription}
              onChange={(value) => updateField(activeLocale, "ctaDescription", value)}
              multiline
            />
            <Field
              label="CTA düyməsi"
              value={localeContent.ctaButton}
              onChange={(value) => updateField(activeLocale, "ctaButton", value)}
            />
            <Field
              label="Seçilən layihələr başlığı"
              value={localeContent.featuredTitle}
              onChange={(value) => updateField(activeLocale, "featuredTitle", value)}
            />
            <Field
              label="Boş vəziyyət mətni"
              value={localeContent.featuredEmptyState}
              onChange={(value) => updateField(activeLocale, "featuredEmptyState", value)}
              multiline
            />
          </SectionCard>
        </div>
      )}
    </div>
  );
}
