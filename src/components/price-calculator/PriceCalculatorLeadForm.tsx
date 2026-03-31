import type { Dispatch, FormEvent, SetStateAction } from "react";
import { ArrowRight, MessageSquare } from "lucide-react";
import { getLocalizedText, type LocaleKey, type PriceCalculatorConfig } from "@/lib/price-calculator";
import type { PriceCalculatorLeadForm as LeadForm, PriceCalculatorStatus } from "@/components/price-calculator/usePriceCalculator";
import { SectionHeader } from "@/components/price-calculator/PriceCalculatorServiceSection";

export function PriceCalculatorLeadForm({
  locale,
  copy,
  form,
  setForm,
  status,
  onSubmit,
}: {
  locale: LocaleKey;
  copy: PriceCalculatorConfig["copy"];
  form: LeadForm;
  setForm: Dispatch<SetStateAction<LeadForm>>;
  status: PriceCalculatorStatus;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}) {
  return (
    <section id="calculator-lead-form" className="site-card-strong rounded-[2rem] p-6 sm:p-8">
      <SectionHeader
        step="04"
        title={getLocalizedText(locale, copy.formTitle)}
        description={getLocalizedText(locale, copy.formDescription)}
        icon={<MessageSquare className="h-5 w-5" />}
      />

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          {([
            ["name", copy.nameLabel, copy.namePlaceholder],
            ["email", copy.emailLabel, copy.emailPlaceholder],
            ["phone", copy.phoneLabel, copy.phonePlaceholder],
            ["company", copy.companyLabel, copy.companyPlaceholder],
          ] as const).map(([key, label, placeholder]) => (
            <div key={key}>
              <label className="mb-1.5 block text-sm font-medium">{getLocalizedText(locale, label)}</label>
              <input
                type={key === "email" ? "email" : "text"}
                required={key === "name" || key === "email"}
                value={form[key]}
                onChange={(event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))}
                placeholder={getLocalizedText(locale, placeholder)}
                className="site-input w-full rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">{getLocalizedText(locale, copy.messageLabel)}</label>
          <textarea
            rows={6}
            value={form.message}
            onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
            placeholder={getLocalizedText(locale, copy.messagePlaceholder)}
            className="site-input w-full resize-none rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-primary w-full justify-center text-base disabled:cursor-not-allowed disabled:opacity-50"
        >
          {getLocalizedText(locale, copy.submit)}
          <ArrowRight className="h-4 w-4" />
        </button>

        {status === "success" ? (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
            {getLocalizedText(locale, copy.success)}
          </div>
        ) : null}
        {status === "error" ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {getLocalizedText(locale, copy.error)}
          </div>
        ) : null}
      </form>
    </section>
  );
}
