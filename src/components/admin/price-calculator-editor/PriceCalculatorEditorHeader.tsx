import { Save } from "lucide-react";
import { locales, sectionTabs, type SectionTab } from "@/components/admin/price-calculator-editor/config";
import type { LocaleKey } from "@/lib/price-calculator";

export function PriceCalculatorEditorHeader({
  section,
  setSection,
  locale,
  setLocale,
  saving,
  onSave,
}: {
  section: SectionTab;
  setSection: (value: SectionTab) => void;
  locale: LocaleKey;
  setLocale: (value: LocaleKey) => void;
  saving: boolean;
  onSave: () => Promise<void>;
}) {
  return (
    <section className="admin-hero rounded-[32px] p-6 sm:p-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <p className="site-kicker">Kalkulyator idaresi</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Qiymet kalkulyatoru</h2>
          <p className="mt-3 text-sm leading-6 text-muted sm:text-base">
            Butun sahələr bir yerdə görünür. Bölməni seç, redaktə et və dəyişiklikləri birbaşa yadda saxla.
          </p>
        </div>
        <button
          onClick={() => void onSave()}
          disabled={saving}
          className="btn-primary text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saxlanilir..." : "Deyisiklikleri yadda saxla"}
        </button>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr),280px]">
        <div className="admin-toolbar rounded-[28px] p-3">
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            {sectionTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSection(tab.id)}
                  className={`admin-tab rounded-[22px] px-4 py-4 text-left ${
                    section === tab.id ? "admin-tab-active" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-semibold">{tab.label}</span>
                  </div>
                  <span className={`mt-2 block text-xs leading-5 ${section === tab.id ? "text-white/80" : "text-muted"}`}>
                    {tab.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="admin-toolbar rounded-[28px] p-3">
          <div className="flex flex-wrap gap-2">
            {locales.map((item) => (
              <button
                key={item}
                onClick={() => setLocale(item)}
                className={`admin-tab rounded-full px-4 py-2 text-sm font-semibold uppercase ${
                  locale === item ? "admin-tab-active" : "border border-border"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <p className="mt-3 px-2 text-xs leading-5 text-muted">
            Dili dəyiş və bütün sahələri eyni ekranda rahat şəkildə redaktə et.
          </p>
        </div>
      </div>
    </section>
  );
}
