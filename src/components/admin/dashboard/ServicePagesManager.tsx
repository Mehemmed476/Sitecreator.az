"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Save } from "lucide-react";
import {
  AdminAlert,
  AdminLoadingState,
  AdminSectionHeader,
} from "@/components/admin/dashboard/shared";
import {
  FaqListEditor,
  Field,
  InfoListEditor,
  SectionCard,
  serviceLocalesForUi,
  ServicePagesLocaleToolbar,
  ServicePagesSidebar,
  StringListEditor,
} from "@/components/admin/dashboard/service-pages/ServicePagesFields";
import {
  createEmptyServiceRecord,
  defaultServicePagesConfig,
  sanitizeServicePagesConfig,
  type ServiceFaqItem,
  type ServiceInfoItem,
  type ServiceLocale,
  type ServicePageLocaleContent,
  type ServicePageRecord,
  type ServicePagesConfig,
} from "@/lib/service-pages";

const localeLabels: Record<ServiceLocale, string> = {
  az: "AZ",
  en: "EN",
  ru: "RU",
};

function cloneConfig(config: ServicePagesConfig): ServicePagesConfig {
  return {
    directory: {
      az: { ...config.directory.az },
      en: { ...config.directory.en },
      ru: { ...config.directory.ru },
    },
    services: config.services.map((service) => ({
      ...service,
      slugs: { ...service.slugs },
      content: {
        az: {
          ...service.content.az,
          outcomes: service.content.az.outcomes.map((item) => ({ ...item })),
          deliverables: [...service.content.az.deliverables],
          processSteps: service.content.az.processSteps.map((item) => ({ ...item })),
          faqItems: service.content.az.faqItems.map((item) => ({ ...item })),
        },
        en: {
          ...service.content.en,
          outcomes: service.content.en.outcomes.map((item) => ({ ...item })),
          deliverables: [...service.content.en.deliverables],
          processSteps: service.content.en.processSteps.map((item) => ({ ...item })),
          faqItems: service.content.en.faqItems.map((item) => ({ ...item })),
        },
        ru: {
          ...service.content.ru,
          outcomes: service.content.ru.outcomes.map((item) => ({ ...item })),
          deliverables: [...service.content.ru.deliverables],
          processSteps: service.content.ru.processSteps.map((item) => ({ ...item })),
          faqItems: service.content.ru.faqItems.map((item) => ({ ...item })),
        },
      },
    })),
  };
}

export function ServicePagesManager() {
  const [config, setConfig] = useState<ServicePagesConfig>(defaultServicePagesConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeLocale, setActiveLocale] = useState<ServiceLocale>("az");
  const [activeServiceId, setActiveServiceId] = useState<string>("website-development");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch("/api/service-pages", {
        credentials: "include",
        cache: "no-store",
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(
          response.status === 401
            ? "Zəhmət olmasa yenidən daxil olun."
            : "Xidmət səhifələrini yükləmək olmadı."
        );
        return;
      }

      const nextConfig = cloneConfig(sanitizeServicePagesConfig(data));
      setConfig(nextConfig);
      setActiveServiceId(nextConfig.services[0]?.id ?? "");
    } catch {
      setError("Xidmət səhifələrini yükləmək olmadı.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchConfig();
  }, [fetchConfig]);

  const activeService = useMemo(
    () => config.services.find((service) => service.id === activeServiceId) ?? config.services[0] ?? null,
    [activeServiceId, config.services]
  );

  function updateDirectoryField(locale: ServiceLocale, key: "badge" | "title" | "description", value: string) {
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

  function updateService(updateFn: (service: ServicePageRecord) => ServicePageRecord) {
    if (!activeService) return;

    setConfig((current) => ({
      ...current,
      services: current.services.map((service) =>
        service.id === activeService.id ? updateFn(service) : service
      ),
    }));
  }

  function updateLocaleField<K extends keyof ServicePageLocaleContent>(
    locale: ServiceLocale,
    key: K,
    value: ServicePageLocaleContent[K]
  ) {
    updateService((service) => ({
      ...service,
      content: {
        ...service.content,
        [locale]: {
          ...service.content[locale],
          [key]: value,
        },
      },
    }));
  }

  function updateSlug(locale: ServiceLocale, value: string) {
    updateService((service) => ({
      ...service,
      slugs: {
        ...service.slugs,
        [locale]: value,
      },
    }));
  }

  function updateInfoItem(
    key: "outcomes" | "processSteps",
    index: number,
    field: keyof ServiceInfoItem,
    value: string
  ) {
    updateService((service) => ({
      ...service,
      content: {
        ...service.content,
        [activeLocale]: {
          ...service.content[activeLocale],
          [key]: service.content[activeLocale][key].map((item, itemIndex) =>
            itemIndex === index ? { ...item, [field]: value } : item
          ),
        },
      },
    }));
  }

  function addInfoItem(key: "outcomes" | "processSteps") {
    updateService((service) => ({
      ...service,
      content: {
        ...service.content,
        [activeLocale]: {
          ...service.content[activeLocale],
          [key]: [...service.content[activeLocale][key], { title: "", description: "" }],
        },
      },
    }));
  }

  function removeInfoItem(key: "outcomes" | "processSteps", index: number) {
    updateService((service) => ({
      ...service,
      content: {
        ...service.content,
        [activeLocale]: {
          ...service.content[activeLocale],
          [key]: service.content[activeLocale][key].filter((_, itemIndex) => itemIndex !== index),
        },
      },
    }));
  }

  function updateDeliverable(index: number, value: string) {
    updateService((service) => ({
      ...service,
      content: {
        ...service.content,
        [activeLocale]: {
          ...service.content[activeLocale],
          deliverables: service.content[activeLocale].deliverables.map((item, itemIndex) =>
            itemIndex === index ? value : item
          ),
        },
      },
    }));
  }

  function addDeliverable() {
    updateService((service) => ({
      ...service,
      content: {
        ...service.content,
        [activeLocale]: {
          ...service.content[activeLocale],
          deliverables: [...service.content[activeLocale].deliverables, ""],
        },
      },
    }));
  }

  function removeDeliverable(index: number) {
    updateService((service) => ({
      ...service,
      content: {
        ...service.content,
        [activeLocale]: {
          ...service.content[activeLocale],
          deliverables: service.content[activeLocale].deliverables.filter((_, itemIndex) => itemIndex !== index),
        },
      },
    }));
  }

  function updateFaqItem(index: number, field: keyof ServiceFaqItem, value: string) {
    updateService((service) => ({
      ...service,
      content: {
        ...service.content,
        [activeLocale]: {
          ...service.content[activeLocale],
          faqItems: service.content[activeLocale].faqItems.map((item, itemIndex) =>
            itemIndex === index ? { ...item, [field]: value } : item
          ),
        },
      },
    }));
  }

  function addFaqItem() {
    updateService((service) => ({
      ...service,
      content: {
        ...service.content,
        [activeLocale]: {
          ...service.content[activeLocale],
          faqItems: [...service.content[activeLocale].faqItems, { question: "", answer: "" }],
        },
      },
    }));
  }

  function removeFaqItem(index: number) {
    updateService((service) => ({
      ...service,
      content: {
        ...service.content,
        [activeLocale]: {
          ...service.content[activeLocale],
          faqItems: service.content[activeLocale].faqItems.filter((_, itemIndex) => itemIndex !== index),
        },
      },
    }));
  }

  function copyFromAz(targetLocale: ServiceLocale) {
    if (!activeService || targetLocale === "az") return;

    updateService((service) => ({
      ...service,
      content: {
        ...service.content,
        [targetLocale]: {
          ...service.content.az,
          outcomes: service.content.az.outcomes.map((item) => ({ ...item })),
          deliverables: [...service.content.az.deliverables],
          processSteps: service.content.az.processSteps.map((item) => ({ ...item })),
          faqItems: service.content.az.faqItems.map((item) => ({ ...item })),
        },
      },
    }));
  }

  function addService() {
    let nextServiceId = "";

    setConfig((current) => {
      const nextIndex = current.services.length + 1;
      const nextId = `service-${nextIndex}`;
      const nextService = createEmptyServiceRecord(nextId, nextIndex);
      nextServiceId = nextService.id;

      return { ...current, services: [...current.services, nextService] };
    });

    if (nextServiceId) {
      setActiveServiceId(nextServiceId);
    }
  }

  function removeService(id: string) {
    let nextActiveId = "";

    setConfig((current) => {
      const nextServices = current.services.filter((service) => service.id !== id);
      const normalized = nextServices.map((service, index) => ({ ...service, order: index + 1 }));
      nextActiveId = normalized[0]?.id ?? "";
      return { ...current, services: normalized };
    });

    setActiveServiceId(nextActiveId);
  }

  function moveService(id: string, direction: -1 | 1) {
    setConfig((current) => {
      const index = current.services.findIndex((service) => service.id === id);
      const nextIndex = index + direction;

      if (index < 0 || nextIndex < 0 || nextIndex >= current.services.length) {
        return current;
      }

      const nextServices = [...current.services];
      [nextServices[index], nextServices[nextIndex]] = [nextServices[nextIndex], nextServices[index]];

      return {
        ...current,
        services: nextServices.map((service, serviceIndex) => ({
          ...service,
          order: serviceIndex + 1,
        })),
      };
    });
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await fetch("/api/service-pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(config),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.error ? String(data.error) : "Xidmət səhifələrini saxlamaq olmadı.");
        return;
      }

      const nextConfig = cloneConfig(sanitizeServicePagesConfig(data));
      setConfig(nextConfig);
      setActiveServiceId(nextConfig.services[0]?.id ?? "");
      setSuccess("Xidmət səhifələri yeniləndi.");
    } catch {
      setError("Xidmət səhifələrini saxlamaq olmadı.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <AdminSectionHeader
        title="Xidmət səhifələri"
        description="Hər xidmət üçün slug, kart mətni, hero, nəticələr, FAQ, CTA və SEO məzmununu 3 dil üzrə idarə et."
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
        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <ServicePagesSidebar
            services={config.services}
            activeServiceId={activeService?.id ?? null}
            onAdd={addService}
            onMove={moveService}
            onRemove={removeService}
            onSelect={setActiveServiceId}
          />

          {!activeService ? (
            <div className="admin-panel rounded-[28px] p-8 text-sm text-muted">Hazırda aktiv xidmət seçilməyib.</div>
          ) : (
            <div className="space-y-6">
              <ServicePagesLocaleToolbar
                activeLocale={activeLocale}
                localeLabels={localeLabels}
                onCopyFromAz={copyFromAz}
                onLocaleChange={setActiveLocale}
              />

              <SectionCard title="Service list səhifəsi">
                <div className="grid gap-4 lg:grid-cols-3">
                  <Field
                    label="Badge"
                    value={config.directory[activeLocale].badge}
                    onChange={(value) => updateDirectoryField(activeLocale, "badge", value)}
                  />
                  <Field
                    label="Başlıq"
                    value={config.directory[activeLocale].title}
                    onChange={(value) => updateDirectoryField(activeLocale, "title", value)}
                  />
                  <Field
                    label="Təsvir"
                    value={config.directory[activeLocale].description}
                    onChange={(value) => updateDirectoryField(activeLocale, "description", value)}
                    multiline
                  />
                </div>
              </SectionCard>

              <SectionCard title="Slug və kart məlumatları">
                <div className="grid gap-4 lg:grid-cols-3">
                  {serviceLocalesForUi.map((locale) => (
                    <Field
                      key={locale}
                      label={`${localeLabels[locale]} slug`}
                      value={activeService.slugs[locale]}
                      onChange={(value) => updateSlug(locale, value)}
                    />
                  ))}
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <Field
                    label="Kart başlığı"
                    value={activeService.content[activeLocale].cardTitle}
                    onChange={(value) => updateLocaleField(activeLocale, "cardTitle", value)}
                  />
                  <Field
                    label="Kart təsviri"
                    value={activeService.content[activeLocale].cardDescription}
                    onChange={(value) => updateLocaleField(activeLocale, "cardDescription", value)}
                    multiline
                  />
                </div>
              </SectionCard>

              <SectionCard title={`${localeLabels[activeLocale]} Hero`}>
                <div className="grid gap-4 lg:grid-cols-2">
                  <Field
                    label="Badge"
                    value={activeService.content[activeLocale].heroBadge}
                    onChange={(value) => updateLocaleField(activeLocale, "heroBadge", value)}
                  />
                  <Field
                    label="Hero başlığı"
                    value={activeService.content[activeLocale].heroTitle}
                    onChange={(value) => updateLocaleField(activeLocale, "heroTitle", value)}
                  />
                </div>
                <Field
                  label="Hero təsviri"
                  value={activeService.content[activeLocale].heroDescription}
                  onChange={(value) => updateLocaleField(activeLocale, "heroDescription", value)}
                  multiline
                />
                <div className="grid gap-4 lg:grid-cols-2">
                  <Field
                    label="Əsas CTA"
                    value={activeService.content[activeLocale].primaryCta}
                    onChange={(value) => updateLocaleField(activeLocale, "primaryCta", value)}
                  />
                  <Field
                    label="İkinci CTA"
                    value={activeService.content[activeLocale].secondaryCta}
                    onChange={(value) => updateLocaleField(activeLocale, "secondaryCta", value)}
                  />
                </div>
              </SectionCard>

              <SectionCard title="Overview və nəticələr">
                <Field
                  label="Overview başlığı"
                  value={activeService.content[activeLocale].overviewTitle}
                  onChange={(value) => updateLocaleField(activeLocale, "overviewTitle", value)}
                />
                <Field
                  label="Overview təsviri"
                  value={activeService.content[activeLocale].overviewDescription}
                  onChange={(value) => updateLocaleField(activeLocale, "overviewDescription", value)}
                  multiline
                />
                <Field
                  label="Nəticələr bölməsi başlığı"
                  value={activeService.content[activeLocale].outcomesTitle}
                  onChange={(value) => updateLocaleField(activeLocale, "outcomesTitle", value)}
                />
                <InfoListEditor
                  titlePrefix="Nəticə"
                  items={activeService.content[activeLocale].outcomes}
                  addLabel="Nəticə əlavə et"
                  onAdd={() => addInfoItem("outcomes")}
                  onRemove={(index) => removeInfoItem("outcomes", index)}
                  onTitleChange={(index, value) => updateInfoItem("outcomes", index, "title", value)}
                  onDescriptionChange={(index, value) => updateInfoItem("outcomes", index, "description", value)}
                />
              </SectionCard>

              <SectionCard title="Deliverables və proses">
                <Field
                  label="Deliverables başlığı"
                  value={activeService.content[activeLocale].deliverablesTitle}
                  onChange={(value) => updateLocaleField(activeLocale, "deliverablesTitle", value)}
                />
                <StringListEditor
                  items={activeService.content[activeLocale].deliverables}
                  addLabel="Deliverable əlavə et"
                  onAdd={addDeliverable}
                  onRemove={removeDeliverable}
                  onChange={updateDeliverable}
                />
                <Field
                  label="Proses başlığı"
                  value={activeService.content[activeLocale].processTitle}
                  onChange={(value) => updateLocaleField(activeLocale, "processTitle", value)}
                />
                <InfoListEditor
                  titlePrefix="Addım"
                  items={activeService.content[activeLocale].processSteps}
                  addLabel="Addım əlavə et"
                  onAdd={() => addInfoItem("processSteps")}
                  onRemove={(index) => removeInfoItem("processSteps", index)}
                  onTitleChange={(index, value) => updateInfoItem("processSteps", index, "title", value)}
                  onDescriptionChange={(index, value) =>
                    updateInfoItem("processSteps", index, "description", value)
                  }
                />
              </SectionCard>

              <SectionCard title="FAQ, CTA və SEO">
                <div className="grid gap-4 lg:grid-cols-2">
                  <Field
                    label="FAQ başlığı"
                    value={activeService.content[activeLocale].faqTitle}
                    onChange={(value) => updateLocaleField(activeLocale, "faqTitle", value)}
                  />
                  <Field
                    label="FAQ təsviri"
                    value={activeService.content[activeLocale].faqDescription}
                    onChange={(value) => updateLocaleField(activeLocale, "faqDescription", value)}
                    multiline
                  />
                </div>
                <FaqListEditor
                  items={activeService.content[activeLocale].faqItems}
                  onAdd={addFaqItem}
                  onRemove={removeFaqItem}
                  onChange={updateFaqItem}
                />
                <Field
                  label="Final CTA başlığı"
                  value={activeService.content[activeLocale].finalCtaTitle}
                  onChange={(value) => updateLocaleField(activeLocale, "finalCtaTitle", value)}
                />
                <Field
                  label="Final CTA təsviri"
                  value={activeService.content[activeLocale].finalCtaDescription}
                  onChange={(value) => updateLocaleField(activeLocale, "finalCtaDescription", value)}
                  multiline
                />
                <Field
                  label="SEO title"
                  value={activeService.content[activeLocale].seoTitle}
                  onChange={(value) => updateLocaleField(activeLocale, "seoTitle", value)}
                />
                <Field
                  label="SEO description"
                  value={activeService.content[activeLocale].seoDescription}
                  onChange={(value) => updateLocaleField(activeLocale, "seoDescription", value)}
                  multiline
                />
              </SectionCard>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
