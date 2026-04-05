"use client";

import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { SectionCard } from "@/components/admin/dashboard/content-editor-shared";
import {
  packageLocales,
  type PackageLocale,
  type PackageSolutionRecord,
} from "@/lib/package-solutions";

const localeLabels: Record<PackageLocale, string> = {
  az: "AZ",
  en: "EN",
  ru: "RU",
};

export function PackageSolutionsSidebar({
  packages,
  activeLocale,
  activePackageId,
  onSelectLocale,
  onSelectPackage,
  onMovePackage,
  onRemovePackage,
}: {
  packages: PackageSolutionRecord[];
  activeLocale: PackageLocale;
  activePackageId: string;
  onSelectLocale: (locale: PackageLocale) => void;
  onSelectPackage: (id: string) => void;
  onMovePackage: (id: string, direction: -1 | 1) => void;
  onRemovePackage: (id: string) => void;
}) {
  return (
    <aside className="space-y-6">
      <SectionCard title="Paketlər">
        <div className="space-y-3">
          {packages.map((item, index) => {
            const title = item.content[activeLocale].cardTitle || item.content.az.cardTitle || item.id;
            const isActive = item.id === activePackageId;

            return (
              <div
                key={item.id}
                className={`w-full rounded-[28px] border p-5 text-left transition ${
                  isActive
                    ? "border-primary/40 bg-primary/10 shadow-soft"
                    : "border-border/70 bg-surface/40 hover:border-primary/20 hover:bg-surface/70"
                }`}
              >
                <button type="button" onClick={() => onSelectPackage(item.id)} className="block w-full text-left">
                  <div className="text-[1.05rem] font-semibold leading-[1.35] text-foreground">{title}</div>
                </button>

                <div className="mt-5 flex items-end justify-between gap-4">
                  <div className="min-w-0 space-y-2">
                    <div className="text-[11px] uppercase tracking-[0.24em] text-muted">{item.category}</div>
                    <div className="text-xs text-muted">Sıra: {index + 1}</div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button type="button" onClick={() => onMovePackage(item.id, -1)} className="site-control h-8 w-8 rounded-full">
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => onMovePackage(item.id, 1)} className="site-control h-8 w-8 rounded-full">
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => onRemovePackage(item.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-300">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {!packages.length ? (
            <div className="rounded-[28px] border border-dashed border-border/70 bg-surface/30 p-5 text-sm text-muted">
              Hələ paket yoxdur. Yeni paket yarat və sonra kalkulyator seçimləri ilə doldur.
            </div>
          ) : null}
        </div>
      </SectionCard>

      <SectionCard title="Dil seçimi">
        <div className="flex flex-wrap gap-2">
          {packageLocales.map((locale) => (
            <button
              key={locale}
              type="button"
              onClick={() => onSelectLocale(locale)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeLocale === locale
                  ? "bg-primary text-white"
                  : "border border-border/70 bg-surface/50 text-muted hover:border-primary/20 hover:text-foreground"
              }`}
            >
              {localeLabels[locale]}
            </button>
          ))}
        </div>
      </SectionCard>
    </aside>
  );
}
