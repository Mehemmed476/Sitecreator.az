"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, Save } from "lucide-react";
import {
  AdminAlert,
  AdminLoadingState,
  AdminSectionHeader,
} from "@/components/admin/dashboard/shared";
import {
  defaultSocialProofContent,
  type SocialProofContent,
  type SocialProofFaqItem,
  type SocialProofLocale,
  type SocialProofLocaleContent,
  type SocialProofTestimonial,
} from "@/lib/social-proof-content";
import {
  FaqEditor,
  Field,
  SectionCard,
  TestimonialsEditor,
} from "@/components/admin/dashboard/content-editor-shared";

const localeLabels: Record<SocialProofLocale, string> = {
  az: "AZ",
  en: "EN",
  ru: "RU",
};

function cloneSocialProofContent(content: SocialProofContent): SocialProofContent {
  const cloneLocale = (localeContent: SocialProofLocaleContent): SocialProofLocaleContent => ({
    ...localeContent,
    testimonials: localeContent.testimonials.map((item) => ({ ...item })),
    faqItems: localeContent.faqItems.map((item) => ({ ...item })),
  });

  return {
    az: cloneLocale(content.az),
    en: cloneLocale(content.en),
    ru: cloneLocale(content.ru),
  };
}

export function SocialProofManager() {
  const [content, setContent] = useState<SocialProofContent>(defaultSocialProofContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeLocale, setActiveLocale] = useState<SocialProofLocale>("az");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch("/api/social-proof-content", {
        credentials: "include",
        cache: "no-store",
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(
          response.status === 401
            ? "Zəhmət olmasa yenidən daxil olun."
            : "Rəylər və FAQ məzmununu yükləmək olmadı."
        );
        return;
      }

      setContent(cloneSocialProofContent((data ?? defaultSocialProofContent) as SocialProofContent));
    } catch {
      setError("Rəylər və FAQ məzmununu yükləmək olmadı.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchContent();
  }, [fetchContent]);

  function updateField<K extends keyof SocialProofLocaleContent>(
    locale: SocialProofLocale,
    key: K,
    value: SocialProofLocaleContent[K]
  ) {
    setContent((current) => ({
      ...current,
      [locale]: {
        ...current[locale],
        [key]: value,
      },
    }));
  }

  function updateTestimonial(
    locale: SocialProofLocale,
    index: number,
    field: keyof SocialProofTestimonial,
    value: string
  ) {
    setContent((current) => ({
      ...current,
      [locale]: {
        ...current[locale],
        testimonials: current[locale].testimonials.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [field]: value } : item
        ),
      },
    }));
  }

  function addTestimonial(locale: SocialProofLocale) {
    setContent((current) => ({
      ...current,
      [locale]: {
        ...current[locale],
        testimonials: [
          ...current[locale].testimonials,
          { quote: "", author: "", role: "", company: "" },
        ],
      },
    }));
  }

  function removeTestimonial(locale: SocialProofLocale, index: number) {
    setContent((current) => ({
      ...current,
      [locale]: {
        ...current[locale],
        testimonials: current[locale].testimonials.filter((_, itemIndex) => itemIndex !== index),
      },
    }));
  }

  function updateFaqItem(
    locale: SocialProofLocale,
    index: number,
    field: keyof SocialProofFaqItem,
    value: string
  ) {
    setContent((current) => ({
      ...current,
      [locale]: {
        ...current[locale],
        faqItems: current[locale].faqItems.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [field]: value } : item
        ),
      },
    }));
  }

  function addFaqItem(locale: SocialProofLocale) {
    setContent((current) => ({
      ...current,
      [locale]: {
        ...current[locale],
        faqItems: [...current[locale].faqItems, { question: "", answer: "" }],
      },
    }));
  }

  function removeFaqItem(locale: SocialProofLocale, index: number) {
    setContent((current) => ({
      ...current,
      [locale]: {
        ...current[locale],
        faqItems: current[locale].faqItems.filter((_, itemIndex) => itemIndex !== index),
      },
    }));
  }

  function copyFromAz(targetLocale: SocialProofLocale) {
    if (targetLocale === "az") {
      return;
    }

    setContent((current) => ({
      ...current,
      [targetLocale]: {
        ...current.az,
        testimonials: current.az.testimonials.map((item) => ({ ...item })),
        faqItems: current.az.faqItems.map((item) => ({ ...item })),
      },
    }));
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await fetch("/api/social-proof-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(content),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.error ? String(data.error) : "Rəylər və FAQ məzmununu saxlamaq olmadı.");
        return;
      }

      setContent(cloneSocialProofContent((data ?? defaultSocialProofContent) as SocialProofContent));
      setSuccess("Rəylər və FAQ məzmunu yeniləndi.");
    } catch {
      setError("Rəylər və FAQ məzmununu saxlamaq olmadı.");
    } finally {
      setSaving(false);
    }
  }

  const localeContent = content[activeLocale];

  return (
    <div>
      <AdminSectionHeader
        title="Rəylər və FAQ"
        description="Müştəri rəylərini və tez-tez verilən sualları ayrıca modul kimi idarə et, sonra istədiyin səhifədə istifadə et."
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
              {(["az", "en", "ru"] as SocialProofLocale[]).map((locale) => (
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

          <SectionCard title={`${localeLabels[activeLocale]} Testimonials`}>
            <Field
              label="Kicker"
              value={localeContent.testimonialsEyebrow}
              onChange={(value) => updateField(activeLocale, "testimonialsEyebrow", value)}
            />
            <Field
              label="Başlıq"
              value={localeContent.testimonialsTitle}
              onChange={(value) => updateField(activeLocale, "testimonialsTitle", value)}
            />
            <Field
              label="Təsvir"
              value={localeContent.testimonialsDescription}
              onChange={(value) => updateField(activeLocale, "testimonialsDescription", value)}
              multiline
            />
            <TestimonialsEditor
              items={localeContent.testimonials}
              onAdd={() => addTestimonial(activeLocale)}
              onRemove={(index) => removeTestimonial(activeLocale, index)}
              onChange={(index, field, value) => updateTestimonial(activeLocale, index, field, value)}
            />
          </SectionCard>

          <SectionCard title={`${localeLabels[activeLocale]} FAQ`}>
            <Field
              label="Kicker"
              value={localeContent.faqEyebrow}
              onChange={(value) => updateField(activeLocale, "faqEyebrow", value)}
            />
            <Field
              label="Başlıq"
              value={localeContent.faqTitle}
              onChange={(value) => updateField(activeLocale, "faqTitle", value)}
            />
            <Field
              label="Təsvir"
              value={localeContent.faqDescription}
              onChange={(value) => updateField(activeLocale, "faqDescription", value)}
              multiline
            />
            <FaqEditor
              items={localeContent.faqItems}
              onAdd={() => addFaqItem(activeLocale)}
              onRemove={(index) => removeFaqItem(activeLocale, index)}
              onChange={(index, field, value) => updateFaqItem(activeLocale, index, field, value)}
            />
          </SectionCard>
        </div>
      )}
    </div>
  );
}
