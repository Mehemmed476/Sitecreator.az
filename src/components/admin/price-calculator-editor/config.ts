import type { Dispatch, SetStateAction } from "react";
import { LayoutTemplate, Settings2, SlidersHorizontal, Sparkles, type LucideIcon } from "lucide-react";
import type {
  CalculatorOption,
  LocaleKey,
  PriceCalculatorBenefit,
  PriceCalculatorCopy,
} from "@/lib/price-calculator";

export type SectionTab = "copy" | "services" | "addons" | "options";
export type CopyFieldKey = Exclude<keyof PriceCalculatorCopy, "steps" | "benefits">;
export type OptionGroupKey = "designOptions" | "logoOptions" | "timelineOptions" | "supportOptions";

export const locales: LocaleKey[] = ["az", "en", "ru"];
export const textFieldClass =
  "w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none";

export const copyFieldLabels: Record<CopyFieldKey, string> = {
  navLabel: "Menyu adi",
  badge: "Badge",
  title: "Hero basligi",
  description: "Hero tesviri",
  serviceTitle: "Xidmet bolmesi basligi",
  serviceDescription: "Xidmet bolmesi tesviri",
  detailsTitle: "Detallar bolmesi basligi",
  detailsDescription: "Detallar bolmesi tesviri",
  extrasTitle: "Elaveler bolmesi basligi",
  extrasDescription: "Elaveler bolmesi tesviri",
  formTitle: "Form basligi",
  formDescription: "Form tesviri",
  summaryTitle: "Xulase basligi",
  summaryDescription: "Xulase tesviri",
  included: "Daxildir etiketi",
  overage: "Elave hecm etiketi",
  designImpact: "Dizayn tesiri etiketi",
  buildExtras: "Qurulum elaveleri etiketi",
  seoExtras: "SEO elaveleri etiketi",
  logoOption: "Loqo secimi etiketi",
  timeline: "Zaman etiketi",
  total: "Cem etiketi",
  monthlySupport: "Ayliq destek etiketi",
  vatNote: "EDV qeydi",
  requestButton: "Esas CTA",
  downloadButton: "Ikinci CTA",
  leadBadge: "Xulase badge-i",
  nameLabel: "Ad etiketi",
  emailLabel: "E-poct etiketi",
  phoneLabel: "Telefon etiketi",
  companyLabel: "Sirket etiketi",
  messageLabel: "Mesaj etiketi",
  namePlaceholder: "Ad placeholder",
  emailPlaceholder: "E-poct placeholder",
  phonePlaceholder: "Telefon placeholder",
  companyPlaceholder: "Sirket placeholder",
  messagePlaceholder: "Mesaj placeholder",
  submit: "Gonder duymesi",
  success: "Ugurlu netice metni",
  error: "Xeta metni",
  leadMessageIntro: "Lead mesaj girisi",
};

export const copyGroups: Array<{
  id: string;
  title: string;
  description: string;
  fields: CopyFieldKey[];
}> = [
  {
    id: "hero",
    title: "Hero ve menyu",
    description: "Ust bolme ve esas CTA metnleri.",
    fields: ["navLabel", "badge", "title", "description", "requestButton", "downloadButton"],
  },
  {
    id: "sections",
    title: "Bolme basliqlari",
    description: "Esas bolme basliqlari ve tesvirleri.",
    fields: [
      "serviceTitle",
      "serviceDescription",
      "detailsTitle",
      "detailsDescription",
      "extrasTitle",
      "extrasDescription",
      "formTitle",
      "formDescription",
      "summaryTitle",
      "summaryDescription",
    ],
  },
  {
    id: "labels",
    title: "Xulase etiketleri",
    description: "Qiymet xulasesinde gorunen etiketler.",
    fields: [
      "leadBadge",
      "included",
      "overage",
      "designImpact",
      "buildExtras",
      "seoExtras",
      "logoOption",
      "timeline",
      "total",
      "monthlySupport",
      "vatNote",
      "leadMessageIntro",
    ],
  },
  {
    id: "form",
    title: "Lead form metnleri",
    description: "Etiketler, placeholder-lar ve gonderim mesajlari.",
    fields: [
      "nameLabel",
      "emailLabel",
      "phoneLabel",
      "companyLabel",
      "messageLabel",
      "namePlaceholder",
      "emailPlaceholder",
      "phonePlaceholder",
      "companyPlaceholder",
      "messagePlaceholder",
      "submit",
      "success",
      "error",
    ],
  },
];

export const sectionTabs: Array<{
  id: SectionTab;
  label: string;
  description: string;
  icon: LucideIcon;
}> = [
  { id: "copy", label: "Metnler", description: "Yazilar ve etiketler", icon: LayoutTemplate },
  { id: "services", label: "Xidmetler", description: "Esas xidmet kartlari", icon: Settings2 },
  { id: "addons", label: "Elaveler", description: "Opsional modullar", icon: Sparkles },
  { id: "options", label: "Secimler", description: "Variantlar ve multiplier-ler", icon: SlidersHorizontal },
];

export const optionSections: Array<{ key: OptionGroupKey; title: string; description: string }> = [
  { key: "designOptions", title: "Dizayn secimleri", description: "Vizual keyfiyyet seviyeleri." },
  { key: "logoOptions", title: "Loqo secimleri", description: "Brend elavesi secimleri." },
  { key: "timelineOptions", title: "Muddet secimleri", description: "Tehvil sureti secimleri." },
  { key: "supportOptions", title: "Destek secimleri", description: "Ayliq destek planlari." },
];

export function emptyLocalized() {
  return { az: "", en: "", ru: "" };
}

export function emptyBenefit(): PriceCalculatorBenefit {
  return { id: `benefit-${Date.now()}`, title: emptyLocalized(), text: emptyLocalized() };
}

export function emptyToggleItem() {
  return { id: `item-${Date.now()}`, label: emptyLocalized(), price: 0 };
}

export function emptyOption(): CalculatorOption {
  return { id: `option-${Date.now()}`, label: emptyLocalized(), helper: emptyLocalized() };
}

export function money(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function toggleState<T extends string>(
  setter: Dispatch<SetStateAction<Record<T, boolean>>>,
  key: T
) {
  setter((prev) => ({ ...prev, [key]: !prev[key] }));
}

export type EditorPreview = {
  title: string;
  subtitle: string;
  items: string[];
};
