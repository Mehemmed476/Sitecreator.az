"use client";

import { ArrowDown, ArrowUp, Copy, Plus, Trash2 } from "lucide-react";
import { type ReactNode } from "react";
import type {
  ServiceFaqItem,
  ServiceInfoItem,
  ServiceLocale,
  ServicePageRecord,
} from "@/lib/service-pages";

export const serviceLocalesForUi = ["az", "en", "ru"] as const;

type LocaleLabels = Record<ServiceLocale, string>;

export function ServicePagesSidebar({
  services,
  activeServiceId,
  onAdd,
  onMove,
  onRemove,
  onSelect,
}: {
  services: ServicePageRecord[];
  activeServiceId: string | null;
  onAdd: () => void;
  onMove: (id: string, direction: -1 | 1) => void;
  onRemove: (id: string) => void;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="admin-panel rounded-[28px] p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">Xidmət siyahısı</h3>
          <p className="mt-1 text-sm text-muted">Səhifələri seç, sırala və ya yenisini əlavə et.</p>
        </div>
        <button type="button" onClick={onAdd} className="btn-secondary cursor-pointer text-sm">
          <Plus className="h-4 w-4" />
          Əlavə et
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {services.map((service, index) => {
          const isActive = activeServiceId === service.id;
          return (
            <div
              key={service.id}
              className={`rounded-2xl border p-4 transition-colors ${
                isActive ? "border-primary/35 bg-primary/10" : "border-border bg-surface/40"
              }`}
            >
              <button
                type="button"
                onClick={() => onSelect(service.id)}
                className="block w-full text-left"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  #{index + 1}
                </p>
                <h4 className="mt-2 text-base font-semibold text-foreground">
                  {service.content.az.cardTitle || service.id}
                </h4>
                <p className="mt-1 text-sm text-muted">{service.slugs.az}</p>
              </button>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onMove(service.id, -1)}
                  className="btn-secondary cursor-pointer px-3 text-xs"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                  Yuxarı
                </button>
                <button
                  type="button"
                  onClick={() => onMove(service.id, 1)}
                  className="btn-secondary cursor-pointer px-3 text-xs"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                  Aşağı
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(service.id)}
                  className="inline-flex items-center gap-1 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Sil
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export function ServicePagesLocaleToolbar({
  activeLocale,
  localeLabels,
  onCopyFromAz,
  onLocaleChange,
}: {
  activeLocale: ServiceLocale;
  localeLabels: LocaleLabels;
  onCopyFromAz: (locale: ServiceLocale) => void;
  onLocaleChange: (locale: ServiceLocale) => void;
}) {
  return (
    <section className="admin-panel rounded-[28px] p-6">
      <div className="flex flex-wrap gap-2">
        {serviceLocalesForUi.map((locale) => (
          <button
            key={locale}
            type="button"
            onClick={() => onLocaleChange(locale)}
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
            onClick={() => onCopyFromAz(activeLocale)}
            className="btn-secondary cursor-pointer text-sm"
          >
            <Copy className="h-4 w-4" />
            AZ-dən {localeLabels[activeLocale]} dilinə köçür
          </button>
        ) : null}
      </div>
    </section>
  );
}

export function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="admin-panel rounded-[28px] p-6">
      <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-muted">{title}</h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="admin-form-control min-h-28 w-full"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="admin-form-control w-full"
        />
      )}
    </label>
  );
}

function ItemCard({
  title,
  children,
  onRemove,
}: {
  title: string;
  children: ReactNode;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-surface/40 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-1 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Sil
        </button>
      </div>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

export function InfoListEditor({
  titlePrefix,
  items,
  addLabel,
  onAdd,
  onRemove,
  onTitleChange,
  onDescriptionChange,
}: {
  titlePrefix: string;
  items: ServiceInfoItem[];
  addLabel: string;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onTitleChange: (index: number, value: string) => void;
  onDescriptionChange: (index: number, value: string) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <ItemCard key={`${titlePrefix}-${index}`} title={`${titlePrefix} ${index + 1}`} onRemove={() => onRemove(index)}>
          <Field label="Başlıq" value={item.title} onChange={(value) => onTitleChange(index, value)} />
          <Field
            label="Təsvir"
            value={item.description}
            onChange={(value) => onDescriptionChange(index, value)}
            multiline
          />
        </ItemCard>
      ))}
      <button type="button" onClick={onAdd} className="btn-secondary cursor-pointer text-sm">
        <Plus className="h-4 w-4" />
        {addLabel}
      </button>
    </div>
  );
}

export function StringListEditor({
  items,
  addLabel,
  onAdd,
  onRemove,
  onChange,
}: {
  items: string[];
  addLabel: string;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, value: string) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={`${item}-${index}`} className="flex gap-3">
          <textarea
            value={item}
            onChange={(event) => onChange(index, event.target.value)}
            className="admin-form-control min-h-24 w-full"
          />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="inline-flex h-11 shrink-0 items-center gap-1 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <button type="button" onClick={onAdd} className="btn-secondary cursor-pointer text-sm">
        <Plus className="h-4 w-4" />
        {addLabel}
      </button>
    </div>
  );
}

export function FaqListEditor({
  items,
  onAdd,
  onRemove,
  onChange,
}: {
  items: ServiceFaqItem[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, field: keyof ServiceFaqItem, value: string) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <ItemCard key={`${item.question}-${index}`} title={`Sual ${index + 1}`} onRemove={() => onRemove(index)}>
          <Field label="Sual" value={item.question} onChange={(value) => onChange(index, "question", value)} />
          <Field label="Cavab" value={item.answer} onChange={(value) => onChange(index, "answer", value)} multiline />
        </ItemCard>
      ))}
      <button type="button" onClick={onAdd} className="btn-secondary cursor-pointer text-sm">
        <Plus className="h-4 w-4" />
        Sual əlavə et
      </button>
    </div>
  );
}
