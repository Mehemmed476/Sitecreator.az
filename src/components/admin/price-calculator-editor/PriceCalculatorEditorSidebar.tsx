import { Eye, Languages, ListTree } from "lucide-react";
import type { LocaleKey } from "@/lib/price-calculator";
import type { EditorPreview, SectionTab } from "@/components/admin/price-calculator-editor/config";

export function PriceCalculatorEditorSidebar({
  activeSection,
  preview,
  locale,
  section,
}: {
  activeSection: { label: string; description: string };
  preview: EditorPreview;
  locale: LocaleKey;
  section: SectionTab;
}) {
  return (
    <aside className="space-y-4 xl:sticky xl:top-24 xl:h-fit">
      <div className="admin-panel rounded-[28px] p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted">
          <Eye className="h-4 w-4" />
          Canli onizleme
        </div>
        <h3 className="mt-3 text-xl font-semibold">{activeSection.label}</h3>
        <p className="mt-2 text-sm leading-6 text-muted">{activeSection.description}</p>
        <div className="mt-5 grid gap-3">
          <div className="admin-panel-soft rounded-3xl px-4 py-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted">
              <Languages className="h-4 w-4" />
              Dil
            </div>
            <p className="mt-2 text-base font-semibold uppercase">{locale}</p>
          </div>
        </div>
      </div>

      <div className="admin-panel-soft rounded-[24px] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">{preview.title}</p>
        <p className="mt-3 text-sm font-semibold">{preview.subtitle}</p>
        <div className="mt-3 space-y-3">
          {preview.items.slice(0, 6).map((item, index) => (
            <div
              key={`${section}-preview-${index}`}
              className="rounded-2xl border border-border bg-surface/50 px-3 py-3 text-sm text-muted"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="admin-panel-soft rounded-[24px] p-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <ListTree className="h-4 w-4 text-primary" />
          Redakte axini
        </div>
        <ol className="mt-3 space-y-2 text-sm text-muted">
          <li>1. Deyismek istediyin bolmeni sec.</li>
          <li>2. Aciq olan blokda redakte et.</li>
          <li>3. Yaddasda saxla ve public saytda yoxla.</li>
        </ol>
      </div>
    </aside>
  );
}
