"use client";

import type { ReactNode } from "react";
import { Plus, Trash2 } from "lucide-react";

export type ContentItem = {
  title: string;
  description: string;
};

export type ContentTestimonial = {
  quote: string;
  author: string;
  role: string;
  company: string;
};

export type ContentFaqItem = {
  question: string;
  answer: string;
};

export function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
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
          className="site-input min-h-24 w-full"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="site-input w-full"
        />
      )}
    </label>
  );
}

export function ItemCard({
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
  items,
  addLabel,
  onAdd,
  onRemove,
  onTitleChange,
  onDescriptionChange,
}: {
  items: ContentItem[];
  addLabel: string;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onTitleChange: (index: number, value: string) => void;
  onDescriptionChange: (index: number, value: string) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <ItemCard key={`${index}-${item.title}`} title={`Element ${index + 1}`} onRemove={() => onRemove(index)}>
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

export function BulletsEditor({
  bullets,
  onAdd,
  onRemove,
  onChange,
}: {
  bullets: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, value: string) => void;
}) {
  return (
    <div className="space-y-3">
      {bullets.map((bullet, index) => (
        <div key={`${index}-${bullet}`} className="flex gap-3">
          <textarea
            value={bullet}
            onChange={(event) => onChange(index, event.target.value)}
            className="site-input min-h-20 w-full"
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
        Maddə əlavə et
      </button>
    </div>
  );
}

export function TestimonialsEditor({
  items,
  onAdd,
  onRemove,
  onChange,
}: {
  items: ContentTestimonial[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, field: keyof ContentTestimonial, value: string) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <ItemCard key={`${index}-${item.author}`} title={`Rəy ${index + 1}`} onRemove={() => onRemove(index)}>
          <Field label="Rəy mətni" value={item.quote} onChange={(value) => onChange(index, "quote", value)} multiline />
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Ad" value={item.author} onChange={(value) => onChange(index, "author", value)} />
            <Field label="Rol" value={item.role} onChange={(value) => onChange(index, "role", value)} />
          </div>
          <Field label="Şirkət" value={item.company} onChange={(value) => onChange(index, "company", value)} />
        </ItemCard>
      ))}
      <button type="button" onClick={onAdd} className="btn-secondary cursor-pointer text-sm">
        <Plus className="h-4 w-4" />
        Rəy əlavə et
      </button>
    </div>
  );
}

export function FaqEditor({
  items,
  onAdd,
  onRemove,
  onChange,
}: {
  items: ContentFaqItem[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, field: keyof ContentFaqItem, value: string) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <ItemCard key={`${index}-${item.question}`} title={`Sual ${index + 1}`} onRemove={() => onRemove(index)}>
          <Field label="Sual" value={item.question} onChange={(value) => onChange(index, "question", value)} />
          <Field
            label="Cavab"
            value={item.answer}
            onChange={(value) => onChange(index, "answer", value)}
            multiline
          />
        </ItemCard>
      ))}
      <button type="button" onClick={onAdd} className="btn-secondary cursor-pointer text-sm">
        <Plus className="h-4 w-4" />
        Sual əlavə et
      </button>
    </div>
  );
}
