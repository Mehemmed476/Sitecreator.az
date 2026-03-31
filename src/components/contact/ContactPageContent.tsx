"use client";

import { useTranslations } from "next-intl";
import { ContactDetailsPanel } from "@/components/contact/ContactDetailsPanel";
import { ContactFormSection } from "@/components/contact/ContactFormSection";
import { ContactHeroPanel } from "@/components/contact/ContactHeroPanel";
import { ContactSupportPanel } from "@/components/contact/ContactSupportPanel";
import { buildContactCards, buildQuickActions } from "@/components/contact/contact-utils";
import { useContactForm } from "@/components/contact/useContactForm";
import { useSiteSettings } from "@/components/useSiteSettings";

export function ContactPageContent() {
  const t = useTranslations("contact");
  const { settings } = useSiteSettings();
  const { form, setForm, status, handleSubmit } = useContactForm();

  const trustItems = t.raw("trustItems") as string[];
  const pendingInfo = t("pendingInfo");
  const { cards: contactCards, businessHoursValue } = buildContactCards(t, settings, pendingInfo);
  const quickActions = buildQuickActions(t, settings);

  return (
    <section className="site-section py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr,0.95fr]">
          <ContactHeroPanel
            badge={t("badge")}
            title={t("title")}
            description={t("description")}
            responseLabel={t("responseLabel")}
            responseValue={t("responseValue")}
            businessHoursLabel={t("details.hours")}
            businessHoursValue={businessHoursValue}
            quickActions={quickActions}
            trustItems={trustItems}
          />

          <ContactDetailsPanel
            kicker={t("quickTitle")}
            title={t("directTitle")}
            description={t("directDescription")}
            cards={contactCards}
          />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.08fr,0.92fr]">
          <ContactFormSection
            kicker={t("formEyebrow")}
            title={t("formTitle")}
            description={t("formDescription")}
            labels={{
              name: t("nameLabel"),
              email: t("emailLabel"),
              phone: t("phoneLabel"),
              message: t("messageLabel"),
            }}
            placeholders={{
              name: t("namePlaceholder"),
              email: t("emailPlaceholder"),
              phone: t("phonePlaceholder"),
              message: t("messagePlaceholder"),
            }}
            submitText={t("submit")}
            successText={t("success")}
            errorText={t("error")}
            form={form}
            status={status}
            onSubmit={handleSubmit}
            onFormChange={setForm}
          />

          <ContactSupportPanel
            kicker={t("quickTitle")}
            title={t("directTitle")}
            description={t("directDescription")}
            responseLabel={t("responseLabel")}
            responseValue={t("responseValue")}
            cards={contactCards}
          />
        </div>
      </div>
    </section>
  );
}
