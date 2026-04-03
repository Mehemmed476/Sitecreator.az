"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Package2, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { buildPriceCalculatorHrefFromPreset } from "@/lib/package-calculator-preset";
import type { PackageLocale, PackageSolutionRecord } from "@/lib/package-solutions";

type PackageLeadModalTriggerProps = {
  locale: PackageLocale;
  pkg: PackageSolutionRecord;
  title: string;
  primaryCta: string;
  secondaryCta: string;
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
};

const formCopy: Record<
  PackageLocale,
  {
    title: string;
    description: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    message: string;
    submit: string;
    sending: string;
    success: string;
    error: string;
    close: string;
  }
> = {
  az: {
    title: "Bu paket üçün sorğu göndər",
    description: "Məlumatlarını göndər, paket sorğun birbaşa CRM-ə düşsün və layihəni birlikdə başladaq.",
    name: "Ad soyad",
    email: "Email",
    phone: "Telefon",
    company: "Şirkət",
    message: "Qısa qeyd",
    submit: "Sorğunu göndər",
    sending: "Göndərilir...",
    success: "Sorğun göndərildi. Komanda bunu birbaşa CRM-də görəcək.",
    error: "Sorğu göndərilmədi. Bir daha yoxla.",
    close: "Bağla",
  },
  en: {
    title: "Send an inquiry for this package",
    description: "Share your details and we will push this package request directly into our CRM.",
    name: "Full name",
    email: "Email",
    phone: "Phone",
    company: "Company",
    message: "Short note",
    submit: "Send inquiry",
    sending: "Sending...",
    success: "Your inquiry has been sent and is now in our CRM.",
    error: "The inquiry could not be sent. Please try again.",
    close: "Close",
  },
  ru: {
    title: "Отправить запрос по пакету",
    description: "Оставьте данные, и запрос по пакету сразу попадёт в CRM.",
    name: "Имя и фамилия",
    email: "Email",
    phone: "Телефон",
    company: "Компания",
    message: "Короткая заметка",
    submit: "Отправить запрос",
    sending: "Отправляется...",
    success: "Запрос отправлен и уже попал в CRM.",
    error: "Не удалось отправить запрос. Попробуйте ещё раз.",
    close: "Закрыть",
  },
};

function buildInitialMessage(locale: PackageLocale, title: string) {
  if (locale === "en") {
    return `I am interested in the ${title} package. Please contact me with the next steps.`;
  }

  if (locale === "ru") {
    return `Меня интересует пакет ${title}. Свяжитесь со мной по следующим шагам.`;
  }

  return `${title} paketi ilə maraqlanıram. Mənimlə növbəti addımlar üçün əlaqə saxlayın.`;
}

export function PackageLeadModalTrigger({
  locale,
  pkg,
  title,
  primaryCta,
  secondaryCta,
}: PackageLeadModalTriggerProps) {
  const copy = formCopy[locale];
  const calculatorHref = buildPriceCalculatorHrefFromPreset(pkg.calculatorPreset);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: buildInitialMessage(locale, title),
  });

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && status !== "loading") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, status]);

  useEffect(() => {
    setForm((current) =>
      current.message.trim()
        ? current
        : {
            ...current,
            message: buildInitialMessage(locale, title),
          }
    );
  }, [locale, title]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source: "package",
          packageRequest: {
            id: pkg.id,
            title,
            slug: pkg.slugs[locale],
            category: pkg.category,
            locale,
            startingPrice: pkg.startingPrice,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed");
      }

      setStatus("success");
      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: buildInitialMessage(locale, title),
      });

      window.setTimeout(() => {
        setOpen(false);
        setStatus("idle");
      }, 1800);
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button type="button" onClick={() => setOpen(true)} className="btn-primary text-base">
          {primaryCta}
          <ArrowRight className="h-4 w-4" />
        </button>
        <Link href={calculatorHref} className="btn-secondary text-base">
          {secondaryCta}
        </Link>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-md"
          onClick={status === "loading" ? undefined : () => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={copy.title}
            className="w-full max-w-2xl rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(11,16,27,0.98),rgba(7,11,19,0.98))] p-6 text-slate-50 shadow-[0_32px_80px_rgba(0,0,0,0.45)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/14 text-primary-light ring-1 ring-primary/18">
                  <Package2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">{copy.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{copy.description}</p>
                  <p className="mt-3 text-sm font-medium text-primary">{title}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={status === "loading"}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/8 bg-white/3 text-slate-300 transition hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={copy.close}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-200">{copy.name}</span>
                  <input
                    required
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    className="site-input w-full rounded-xl px-4 py-3 text-sm"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-200">{copy.email}</span>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                    className="site-input w-full rounded-xl px-4 py-3 text-sm"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-200">{copy.phone}</span>
                  <input
                    required
                    value={form.phone}
                    onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                    className="site-input w-full rounded-xl px-4 py-3 text-sm"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-200">{copy.company}</span>
                  <input
                    value={form.company}
                    onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}
                    className="site-input w-full rounded-xl px-4 py-3 text-sm"
                  />
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-200">{copy.message}</span>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                  className="site-input w-full rounded-xl px-4 py-3 text-sm"
                />
              </label>

              {status === "success" ? (
                <StatusMessage tone="success" compact>
                  {copy.success}
                </StatusMessage>
              ) : null}

              {status === "error" ? (
                <StatusMessage tone="error" compact>
                  {copy.error}
                </StatusMessage>
              ) : null}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={status === "loading"}
                  className="btn-secondary justify-center text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {copy.close}
                </button>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-primary justify-center text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {status === "loading" ? copy.sending : copy.submit}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
