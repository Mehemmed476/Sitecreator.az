"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ChevronDown,
  Plus,
  Trash2,
} from "lucide-react";
import {
  defaultPriceCalculatorConfig,
  getLocalizedText,
  type CalculatorService,
  type CalculatorToggleGroup,
  type LocaleKey,
  type PriceCalculatorConfig,
} from "@/lib/price-calculator";
import {
  copyFieldLabels,
  copyGroups,
  emptyBenefit,
  emptyOption,
  emptyToggleItem,
  money,
  optionSections,
  sectionTabs,
  textFieldClass,
  toggleState,
  type CopyFieldKey,
  type OptionGroupKey,
  type SectionTab,
} from "@/components/admin/price-calculator-editor/config";
import { PriceCalculatorEditorHeader } from "@/components/admin/price-calculator-editor/PriceCalculatorEditorHeader";
import { PriceCalculatorEditorSidebar } from "@/components/admin/price-calculator-editor/PriceCalculatorEditorSidebar";

export function PriceCalculatorManager() {
  const [config, setConfig] = useState<PriceCalculatorConfig>(defaultPriceCalculatorConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [section, setSection] = useState<SectionTab>("copy");
  const [locale, setLocale] = useState<LocaleKey>("az");
  const [openCopyGroups, setOpenCopyGroups] = useState<Record<string, boolean>>({
    hero: true,
    sections: false,
    labels: false,
    form: false,
    steps: true,
    benefits: false,
  });
  const [openServices, setOpenServices] = useState<Record<string, boolean>>({});
  const [openAddOns, setOpenAddOns] = useState<Record<string, boolean>>({});
  const [openOptionGroups, setOpenOptionGroups] = useState<Record<string, boolean>>({
    designOptions: true,
    logoOptions: false,
    timelineOptions: false,
    supportOptions: false,
  });

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/price-calculator", { credentials: "include" });
      const data = await response.json().catch(() => null);

      if (!response.ok || !data) {
        setError(
          response.status === 401
            ? "Zehmet olmasa yeniden daxil olun."
            : "Kalkulyator ayarlari alina bilmedi."
        );
        return;
      }

      setConfig(data as PriceCalculatorConfig);
    } catch {
      setError("Kalkulyator ayarlari alina bilmedi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    setOpenServices((prev) =>
      Object.fromEntries(
        config.services.map((service, index) => [service.id, prev[service.id] ?? index === 0])
      )
    );
    setOpenAddOns((prev) =>
      Object.fromEntries(
        config.addOnGroups.map((group, index) => [group.id, prev[group.id] ?? index === 0])
      )
    );
  }, [config.services, config.addOnGroups]);

  async function handleSave() {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await fetch("/api/price-calculator", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(config),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data) {
        setError(data?.error ? String(data.error) : "Yaddasda saxlamaq alinmadi.");
        return;
      }

      setConfig(data as PriceCalculatorConfig);
      setSuccess("Kalkulyator yenilendi.");
    } catch {
      setError("Yaddasda saxlamaq alinmadi.");
    } finally {
      setSaving(false);
    }
  }

  function updateCopyField(key: CopyFieldKey, value: string) {
    setConfig((prev) => ({
      ...prev,
      copy: {
        ...prev.copy,
        [key]: {
          ...prev.copy[key],
          [locale]: value,
        },
      },
    }));
  }

  function updateStep(index: number, value: string) {
    setConfig((prev) => ({
      ...prev,
      copy: {
        ...prev.copy,
        steps: prev.copy.steps.map((step, stepIndex) =>
          stepIndex === index ? { ...step, [locale]: value } : step
        ),
      },
    }));
  }

  function updateBenefit(index: number, field: "title" | "text", value: string) {
    setConfig((prev) => ({
      ...prev,
      copy: {
        ...prev.copy,
        benefits: prev.copy.benefits.map((benefit, benefitIndex) =>
          benefitIndex === index
            ? { ...benefit, [field]: { ...benefit[field], [locale]: value } }
            : benefit
        ),
      },
    }));
  }

  function updateService(index: number, next: CalculatorService) {
    setConfig((prev) => ({
      ...prev,
      services: prev.services.map((service, serviceIndex) =>
        serviceIndex === index ? next : service
      ),
    }));
  }

  function updateAddOnGroup(index: number, next: CalculatorToggleGroup) {
    setConfig((prev) => ({
      ...prev,
      addOnGroups: prev.addOnGroups.map((group, groupIndex) =>
        groupIndex === index ? next : group
      ),
    }));
  }

  function updateOptions<K extends OptionGroupKey>(key: K, values: PriceCalculatorConfig[K]) {
    setConfig((prev) => ({ ...prev, [key]: values }));
  }

  const activeSection = sectionTabs.find((item) => item.id === section) ?? sectionTabs[0];
  const visibleCopyGroups = useMemo(
    () => copyGroups.map((group) => ({ ...group, visibleFields: group.fields })),
    []
  );

  const preview = useMemo(() => {
    if (section === "copy") {
      return {
        title: getLocalizedText(locale, config.copy.title),
        subtitle: getLocalizedText(locale, config.copy.description),
        items: config.copy.steps.slice(0, 4).map((step) => getLocalizedText(locale, step)),
      };
    }

    if (section === "services") {
      return {
        title: "Xidmet onizlemesi",
        subtitle: "Istifadecinin birinci addimda gorduyu hisse",
        items: config.services.map(
          (service) => `${getLocalizedText(locale, service.name)} - ${money(service.basePrice)} AZN`
        ),
      };
    }

    if (section === "addons") {
      return {
        title: "Elaveler onizlemesi",
        subtitle: "Qruplasdirilmis upsell ve elaveler",
        items: config.addOnGroups.flatMap((group) =>
          group.items
            .slice(0, 2)
            .map((item) => `${getLocalizedText(locale, group.title)}: ${getLocalizedText(locale, item.label)}`)
        ),
      };
    }

    return {
      title: "Secimler onizlemesi",
      subtitle: "Son qerar kartlari",
      items: optionSections.flatMap(({ key, title }) =>
        config[key].slice(0, 2).map((item) => `${title}: ${getLocalizedText(locale, item.label)}`)
      ),
    };
  }, [config, locale, section]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary/30 border-t-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PriceCalculatorEditorHeader
        section={section}
        setSection={setSection}
        locale={locale}
        setLocale={setLocale}
        saving={saving}
        onSave={handleSave}
      />

      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600">
          {success}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr),320px]">
        <div className="space-y-6">
          {section === "copy" ? (
            <div className="space-y-6">
              {visibleCopyGroups.map((group) => (
                <div key={group.id} className="admin-panel rounded-[28px] p-4 sm:p-5">
                  <button
                    type="button"
                    onClick={() => toggleState(setOpenCopyGroups, group.id)}
                    className="flex w-full items-start justify-between gap-4 rounded-[24px] border border-border bg-surface/60 px-4 py-4 text-left transition-all hover:border-primary/35"
                  >
                    <div>
                      <div className="text-sm font-semibold">{group.title}</div>
                      <div className="mt-1 text-xs leading-5 text-muted">{group.description}</div>
                      <div className="mt-2 text-xs font-medium text-primary">
                        {group.visibleFields.length} gorunen sahe
                      </div>
                    </div>
                    <ChevronDown
                      className={`mt-1 h-4 w-4 shrink-0 text-muted transition-transform ${
                        openCopyGroups[group.id] ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openCopyGroups[group.id] ? (
                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      {group.visibleFields.map((field) => (
                        <div key={field} className="admin-panel-soft rounded-[24px] p-4">
                          <label className="block text-sm font-semibold">{copyFieldLabels[field]}</label>
                          <input
                            type="text"
                            value={config.copy[field][locale]}
                            onChange={(event) => updateCopyField(field, event.target.value)}
                            className={`${textFieldClass} mt-3`}
                          />
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}

              <div className="admin-panel rounded-[28px] p-4 sm:p-5">
                <button
                  type="button"
                  onClick={() => toggleState(setOpenCopyGroups, "steps")}
                  className="flex w-full items-start justify-between gap-4 rounded-[24px] border border-border bg-surface/60 px-4 py-4 text-left transition-all hover:border-primary/35"
                >
                  <div>
                    <div className="text-sm font-semibold">Addimlar</div>
                    <div className="mt-1 text-xs leading-5 text-muted">
                      Public kalkulyatorda yuxarida gorunen progress etiketleri.
                    </div>
                  </div>
                  <ChevronDown
                    className={`mt-1 h-4 w-4 shrink-0 text-muted transition-transform ${
                      openCopyGroups.steps ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openCopyGroups.steps ? (
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {config.copy.steps.map((step, index) => (
                      <div key={`step-${index}`} className="admin-panel-soft rounded-[24px] p-4">
                        <label className="block text-sm font-semibold">Addim {index + 1}</label>
                        <input
                          type="text"
                          value={step[locale]}
                          onChange={(event) => updateStep(index, event.target.value)}
                          className={`${textFieldClass} mt-3`}
                        />
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="admin-panel rounded-[28px] p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => toggleState(setOpenCopyGroups, "benefits")}
                    className="flex w-full items-start justify-between gap-4 rounded-[24px] border border-border bg-surface/60 px-4 py-4 text-left transition-all hover:border-primary/35"
                  >
                    <div>
                      <div className="text-sm font-semibold">Ustunlukler</div>
                      <div className="mt-1 text-xs leading-5 text-muted">
                        Formun yaninda gorunen guven kartlari.
                      </div>
                    </div>
                    <ChevronDown
                      className={`mt-1 h-4 w-4 shrink-0 text-muted transition-transform ${
                        openCopyGroups.benefits ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setConfig((prev) => ({
                        ...prev,
                        copy: {
                          ...prev.copy,
                          benefits: [...prev.copy.benefits, emptyBenefit()],
                        },
                      }))
                    }
                    className="btn-secondary text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    Ustunluk elave et
                  </button>
                </div>

                {openCopyGroups.benefits ? (
                  <div className="mt-4 space-y-4">
                    {config.copy.benefits.map((benefit, index) => (
                      <div key={benefit.id} className="admin-panel-soft rounded-[24px] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold">
                              {benefit.title[locale] || `Ustunluk ${index + 1}`}
                            </p>
                            <p className="mt-1 text-xs text-muted">Basliq, metn ve daxili ID burada redakte olunur.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setConfig((prev) => ({
                                ...prev,
                                copy: {
                                  ...prev.copy,
                                  benefits: prev.copy.benefits.filter((_, i) => i !== index),
                                },
                              }))
                            }
                            className="rounded-xl border border-red-500/20 p-2 text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-4 grid gap-4 lg:grid-cols-2">
                          <div className="admin-panel rounded-[20px] p-4">
                            <label className="block text-sm font-semibold">Daxili ID</label>
                            <input
                              type="text"
                              value={benefit.id}
                              onChange={(event) =>
                                setConfig((prev) => ({
                                  ...prev,
                                  copy: {
                                    ...prev.copy,
                                    benefits: prev.copy.benefits.map((item, i) =>
                                      i === index ? { ...item, id: event.target.value } : item
                                    ),
                                  },
                                }))
                              }
                              className={`${textFieldClass} mt-3`}
                            />
                          </div>
                          <div className="admin-panel rounded-[20px] p-4">
                            <label className="block text-sm font-semibold">Basliq</label>
                            <input
                              type="text"
                              value={benefit.title[locale]}
                              onChange={(event) => updateBenefit(index, "title", event.target.value)}
                              className={`${textFieldClass} mt-3`}
                            />
                          </div>
                          <div className="admin-panel rounded-[20px] p-4 lg:col-span-2">
                            <label className="block text-sm font-semibold">Metn</label>
                            <textarea
                              rows={3}
                              value={benefit.text[locale]}
                              onChange={(event) => updateBenefit(index, "text", event.target.value)}
                              className={`${textFieldClass} mt-3 resize-none`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {section === "services" ? (
            <div className="space-y-4">
              {config.services.map((service, index) => (
                <div key={service.id} className="admin-panel rounded-[28px] p-4 sm:p-5">
                  <button
                    type="button"
                    onClick={() => toggleState(setOpenServices, service.id)}
                    className="flex w-full items-start justify-between gap-4 rounded-[24px] border border-border bg-surface/60 px-4 py-4 text-left transition-all hover:border-primary/35"
                  >
                    <div>
                      <div className="text-sm font-semibold">
                        {getLocalizedText(locale, service.name) || service.id}
                      </div>
                      <div className="mt-1 text-xs leading-5 text-muted">
                        {getLocalizedText(locale, service.note) || "Esas xidmet karti."}
                      </div>
                      <div className="mt-2 text-xs font-medium text-primary">
                        {money(service.basePrice)} AZN baza
                      </div>
                    </div>
                    <ChevronDown
                      className={`mt-1 h-4 w-4 shrink-0 text-muted transition-transform ${
                        openServices[service.id] ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openServices[service.id] ? (
                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      <div className="admin-panel-soft rounded-[24px] p-4">
                        <label className="block text-sm font-semibold">Xidmet adi</label>
                        <input
                          type="text"
                          value={service.name[locale]}
                          onChange={(event) =>
                            updateService(index, {
                              ...service,
                              name: { ...service.name, [locale]: event.target.value },
                            })
                          }
                          className={`${textFieldClass} mt-3`}
                        />
                      </div>
                      <div className="admin-panel-soft rounded-[24px] p-4">
                        <label className="block text-sm font-semibold">Kart qeydi</label>
                        <input
                          type="text"
                          value={service.note[locale]}
                          onChange={(event) =>
                            updateService(index, {
                              ...service,
                              note: { ...service.note, [locale]: event.target.value },
                            })
                          }
                          className={`${textFieldClass} mt-3`}
                        />
                      </div>
                      {([
                        ["Baza qiymeti", "basePrice"],
                        ["Standart vahid", "defaultUnits"],
                        ["Daxil olan vahid", "includedUnits"],
                        ["Vahid uzre qiymet", "perUnitPrice"],
                      ] as const).map(([label, key]) => (
                        <div key={key} className="admin-panel-soft rounded-[24px] p-4">
                          <label className="block text-sm font-semibold">{label}</label>
                          <input
                            type="number"
                            value={service[key]}
                            onChange={(event) =>
                              updateService(index, {
                                ...service,
                                [key]: Number(event.target.value),
                              })
                            }
                            className={`${textFieldClass} mt-3`}
                          />
                        </div>
                      ))}

                      <>
                        <div className="admin-panel-soft rounded-[24px] p-4">
                          <label className="block text-sm font-semibold">Baza etiketi</label>
                          <input
                            type="text"
                            value={service.baseLabel[locale]}
                            onChange={(event) =>
                              updateService(index, {
                                ...service,
                                baseLabel: { ...service.baseLabel, [locale]: event.target.value },
                              })
                            }
                            className={`${textFieldClass} mt-3`}
                          />
                        </div>
                        <div className="admin-panel-soft rounded-[24px] p-4">
                          <label className="block text-sm font-semibold">Vahid etiketi</label>
                          <input
                            type="text"
                            value={service.unitLabel[locale]}
                            onChange={(event) =>
                              updateService(index, {
                                ...service,
                                unitLabel: { ...service.unitLabel, [locale]: event.target.value },
                              })
                            }
                            className={`${textFieldClass} mt-3`}
                          />
                        </div>
                        {([
                          ["Minimum vahid", "minUnits"],
                          ["Maksimum vahid", "maxUnits"],
                        ] as const).map(([label, key]) => (
                          <div key={key} className="admin-panel-soft rounded-[24px] p-4">
                            <label className="block text-sm font-semibold">{label}</label>
                            <input
                              type="number"
                              value={service[key]}
                              onChange={(event) =>
                                updateService(index, {
                                  ...service,
                                  [key]: Number(event.target.value),
                                })
                              }
                              className={`${textFieldClass} mt-3`}
                            />
                          </div>
                        ))}
                      </>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
          {section === "addons" ? (
            <div className="space-y-4">
              {config.addOnGroups.map((group, groupIndex) => (
                <div key={group.id} className="admin-panel rounded-[28px] p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={() => toggleState(setOpenAddOns, group.id)}
                      className="flex w-full items-start justify-between gap-4 rounded-[24px] border border-border bg-surface/60 px-4 py-4 text-left transition-all hover:border-primary/35"
                    >
                      <div>
                        <div className="text-sm font-semibold">
                          {getLocalizedText(locale, group.title) || group.id}
                        </div>
                        <div className="mt-1 text-xs leading-5 text-muted">
                          Bir basliq altinda qruplasdirilmis elaveler.
                        </div>
                        <div className="mt-2 text-xs font-medium text-primary">
                          {group.items.length} element
                        </div>
                      </div>
                      <ChevronDown
                        className={`mt-1 h-4 w-4 shrink-0 text-muted transition-transform ${
                          openAddOns[group.id] ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateAddOnGroup(groupIndex, {
                          ...group,
                          items: [...group.items, emptyToggleItem()],
                        })
                      }
                      className="btn-secondary text-sm"
                    >
                      <Plus className="h-4 w-4" />
                      Element elave et
                    </button>
                  </div>

                  {openAddOns[group.id] ? (
                    <div className="mt-4 space-y-4">
                      <div className="admin-panel-soft rounded-[24px] p-4">
                        <label className="block text-sm font-semibold">Qrup basligi</label>
                        <input
                          type="text"
                          value={group.title[locale]}
                          onChange={(event) =>
                            updateAddOnGroup(groupIndex, {
                              ...group,
                              title: { ...group.title, [locale]: event.target.value },
                            })
                          }
                          className={`${textFieldClass} mt-3`}
                        />
                      </div>

                      {group.items.map((item, itemIndex) => (
                        <div key={item.id} className="admin-panel-soft rounded-[24px] p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold">
                                {getLocalizedText(locale, item.label) || `Element ${itemIndex + 1}`}
                              </p>
                              <p className="mt-1 text-xs text-muted">{money(item.price)} AZN</p>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                updateAddOnGroup(groupIndex, {
                                  ...group,
                                  items: group.items.filter((_, i) => i !== itemIndex),
                                })
                              }
                              className="rounded-xl border border-red-500/20 p-2 text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mt-4 grid gap-4 lg:grid-cols-2">
                            <div className="admin-panel rounded-[20px] p-4">
                              <label className="block text-sm font-semibold">Daxili ID</label>
                              <input
                                type="text"
                                value={item.id}
                                onChange={(event) =>
                                  updateAddOnGroup(groupIndex, {
                                    ...group,
                                    items: group.items.map((groupItem, i) =>
                                      i === itemIndex ? { ...groupItem, id: event.target.value } : groupItem
                                    ),
                                  })
                                }
                                className={`${textFieldClass} mt-3`}
                              />
                            </div>
                            <div className="admin-panel rounded-[20px] p-4">
                              <label className="block text-sm font-semibold">Etiket</label>
                              <input
                                type="text"
                                value={item.label[locale]}
                                onChange={(event) =>
                                  updateAddOnGroup(groupIndex, {
                                    ...group,
                                    items: group.items.map((groupItem, i) =>
                                      i === itemIndex
                                        ? { ...groupItem, label: { ...groupItem.label, [locale]: event.target.value } }
                                        : groupItem
                                    ),
                                  })
                                }
                                className={`${textFieldClass} mt-3`}
                              />
                            </div>
                            <div className="admin-panel rounded-[20px] p-4">
                              <label className="block text-sm font-semibold">Qiymet</label>
                              <input
                                type="number"
                                value={item.price}
                                onChange={(event) =>
                                  updateAddOnGroup(groupIndex, {
                                    ...group,
                                    items: group.items.map((groupItem, i) =>
                                      i === itemIndex ? { ...groupItem, price: Number(event.target.value) } : groupItem
                                    ),
                                  })
                                }
                                className={`${textFieldClass} mt-3`}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}

          {section === "options" ? (
            <div className="space-y-4">
              {optionSections.map(({ key, title, description }) => {
                const values = config[key];
                return (
                  <div key={key} className="admin-panel rounded-[28px] p-4 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="button"
                        onClick={() => toggleState(setOpenOptionGroups, key)}
                        className="flex w-full items-start justify-between gap-4 rounded-[24px] border border-border bg-surface/60 px-4 py-4 text-left transition-all hover:border-primary/35"
                      >
                        <div>
                          <div className="text-sm font-semibold">{title}</div>
                          <div className="mt-1 text-xs leading-5 text-muted">{description}</div>
                          <div className="mt-2 text-xs font-medium text-primary">
                            {values.length} secim
                          </div>
                        </div>
                        <ChevronDown
                          className={`mt-1 h-4 w-4 shrink-0 text-muted transition-transform ${
                            openOptionGroups[key] ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateOptions(key, [...values, emptyOption()])}
                        className="btn-secondary text-sm"
                      >
                        <Plus className="h-4 w-4" />
                        Secim elave et
                      </button>
                    </div>

                    {openOptionGroups[key] ? (
                      <div className="mt-4 space-y-4">
                        {values.map((item, index) => (
                          <div key={item.id} className="admin-panel-soft rounded-[24px] p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold">
                                  {getLocalizedText(locale, item.label) || `Secim ${index + 1}`}
                                </p>
                                <p className="mt-1 text-xs text-muted">
                                  {item.multiplier !== undefined
                                    ? `Multiplier: ${item.multiplier}`
                                    : item.monthlyPrice !== undefined
                                      ? `Ayliq: ${money(item.monthlyPrice)} AZN`
                                      : `Qiymet: ${money(item.price ?? 0)} AZN`}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => updateOptions(key, values.filter((_, i) => i !== index))}
                                className="rounded-xl border border-red-500/20 p-2 text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="mt-4 grid gap-4 lg:grid-cols-2">
                              <div className="admin-panel rounded-[20px] p-4">
                                <label className="block text-sm font-semibold">Daxili ID</label>
                                <input
                                  type="text"
                                  value={item.id}
                                  onChange={(event) =>
                                    updateOptions(
                                      key,
                                      values.map((option, i) =>
                                        i === index ? { ...option, id: event.target.value } : option
                                      )
                                    )
                                  }
                                  className={`${textFieldClass} mt-3`}
                                />
                              </div>
                              <div className="admin-panel rounded-[20px] p-4">
                                <label className="block text-sm font-semibold">Etiket</label>
                                <input
                                  type="text"
                                  value={item.label[locale]}
                                  onChange={(event) =>
                                    updateOptions(
                                      key,
                                      values.map((option, i) =>
                                        i === index
                                          ? { ...option, label: { ...option.label, [locale]: event.target.value } }
                                          : option
                                      )
                                    )
                                  }
                                  className={`${textFieldClass} mt-3`}
                                />
                              </div>
                              {item.helper !== undefined ? (
                                <div className="admin-panel rounded-[20px] p-4">
                                  <label className="block text-sm font-semibold">Komekci metn</label>
                                  <input
                                    type="text"
                                    value={item.helper[locale]}
                                    onChange={(event) =>
                                      updateOptions(
                                        key,
                                        values.map((option, i) =>
                                          i === index
                                            ? { ...option, helper: { ...option.helper, [locale]: event.target.value } }
                                            : option
                                        )
                                      )
                                    }
                                    className={`${textFieldClass} mt-3`}
                                  />
                                </div>
                              ) : null}
                              {item.multiplier !== undefined ? (
                                <div className="admin-panel rounded-[20px] p-4">
                                  <label className="block text-sm font-semibold">Multiplier</label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={item.multiplier}
                                    onChange={(event) =>
                                      updateOptions(
                                        key,
                                        values.map((option, i) =>
                                          i === index ? { ...option, multiplier: Number(event.target.value) } : option
                                        )
                                      )
                                    }
                                    className={`${textFieldClass} mt-3`}
                                  />
                                </div>
                              ) : null}
                              {item.price !== undefined ? (
                                <div className="admin-panel rounded-[20px] p-4">
                                  <label className="block text-sm font-semibold">Qiymet</label>
                                  <input
                                    type="number"
                                    value={item.price}
                                    onChange={(event) =>
                                      updateOptions(
                                        key,
                                        values.map((option, i) =>
                                          i === index ? { ...option, price: Number(event.target.value) } : option
                                        )
                                      )
                                    }
                                    className={`${textFieldClass} mt-3`}
                                  />
                                </div>
                              ) : null}
                              {item.monthlyPrice !== undefined ? (
                                <div className="admin-panel rounded-[20px] p-4">
                                  <label className="block text-sm font-semibold">Ayliq qiymet</label>
                                  <input
                                    type="number"
                                    value={item.monthlyPrice}
                                    onChange={(event) =>
                                      updateOptions(
                                        key,
                                        values.map((option, i) =>
                                          i === index ? { ...option, monthlyPrice: Number(event.target.value) } : option
                                        )
                                      )
                                    }
                                    className={`${textFieldClass} mt-3`}
                                  />
                                </div>
                              ) : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>

        <PriceCalculatorEditorSidebar
          activeSection={activeSection}
          preview={preview}
          locale={locale}
          section={section}
        />
      </div>
    </div>
  );
}
