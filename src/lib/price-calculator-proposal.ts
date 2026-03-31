import {
  getLocalizedText,
  type LocaleKey,
  type PriceCalculatorConfig,
} from "@/lib/price-calculator";
import {
  MANAT,
  formatMoneyValue,
  type PriceCalculatorEstimate,
  type PriceCalculatorSelections,
} from "@/lib/price-calculator-estimate";

type ProposalLeadForm = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
};

type ProposalCopy = {
  documentTitle: string;
  generatedAt: string;
  overview: string;
  selectedAddons: string;
  buildAddons: string;
  seoAddons: string;
  none: string;
  costBreakdown: string;
  design: string;
  timeline: string;
  logo: string;
  support: string;
  contactDetails: string;
  note: string;
  estimate: string;
  total: string;
  contactLine: string;
};

const proposalCopy = {
  az: {
    documentTitle: "Qiymət təklifi",
    generatedAt: "Hazırlanma tarixi",
    overview: "Layihə xülasəsi",
    selectedAddons: "Seçilmiş əlavələr",
    buildAddons: "Layihə əlavələri",
    seoAddons: "SEO əlavələri",
    none: "Seçilməyib",
    costBreakdown: "Qiymət detalları",
    design: "Dizayn paketi",
    timeline: "Təslim müddəti",
    logo: "Logo paketi",
    support: "Aylıq dəstək",
    contactDetails: "Əlaqə məlumatları",
    note: "Qeyd",
    estimate: "Təxmini büdcə",
    total: "Yekun məbləğ",
    contactLine: "Əlavə məlumat üçün: sitecreator.az | info@sitecreator.az",
  },
  en: {
    documentTitle: "Project proposal",
    generatedAt: "Generated on",
    overview: "Project overview",
    selectedAddons: "Selected add-ons",
    buildAddons: "Build add-ons",
    seoAddons: "SEO add-ons",
    none: "Not selected",
    costBreakdown: "Cost breakdown",
    design: "Design package",
    timeline: "Delivery timeline",
    logo: "Logo package",
    support: "Monthly support",
    contactDetails: "Contact details",
    note: "Note",
    estimate: "Estimated budget",
    total: "Total amount",
    contactLine: "For more details: sitecreator.az | info@sitecreator.az",
  },
  ru: {
    documentTitle: "Коммерческое предложение",
    generatedAt: "Дата подготовки",
    overview: "Сводка проекта",
    selectedAddons: "Выбранные дополнения",
    buildAddons: "Дополнения проекта",
    seoAddons: "SEO-дополнения",
    none: "Не выбрано",
    costBreakdown: "Структура стоимости",
    design: "Пакет дизайна",
    timeline: "Срок реализации",
    logo: "Пакет логотипа",
    support: "Ежемесячная поддержка",
    contactDetails: "Контактные данные",
    note: "Примечание",
    estimate: "Предварительный бюджет",
    total: "Итоговая сумма",
    contactLine: "Для деталей: sitecreator.az | info@sitecreator.az",
  },
} as const satisfies Record<LocaleKey, ProposalCopy>;

type FontReadyPdf = {
  addFileToVFS: (fileName: string, data: string) => void;
  addFont: (postScriptName: string, id: string, style: string) => void;
};

const PROPOSAL_FONT_REGULAR_ID = "SiteCreatorProposal-Regular";
const PROPOSAL_FONT_BOLD_ID = "SiteCreatorProposal-Bold";
const PROPOSAL_FONT_REGULAR_FILE = "arial.ttf";
const PROPOSAL_FONT_BOLD_FILE = "arialbd.ttf";

let cachedRegularFontBase64: string | null = null;
let cachedBoldFontBase64: string | null = null;

function formatDate(locale: LocaleKey) {
  return new Intl.DateTimeFormat(
    locale === "az" ? "az-AZ" : locale === "ru" ? "ru-RU" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  ).format(new Date());
}

function line(label: string, value: string) {
  return `${label}: ${value}`;
}

function sanitizeFileName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = "";

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

async function loadFontBase64(path: string) {
  const response = await fetch(path, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to load font: ${path}`);
  }

  const buffer = await response.arrayBuffer();
  return arrayBufferToBase64(buffer);
}

async function ensureProposalFonts(pdf: FontReadyPdf) {
  if (!cachedRegularFontBase64) {
    cachedRegularFontBase64 = await loadFontBase64(`/api/pdf-fonts/${PROPOSAL_FONT_REGULAR_FILE}`);
  }

  if (!cachedBoldFontBase64) {
    cachedBoldFontBase64 = await loadFontBase64(`/api/pdf-fonts/${PROPOSAL_FONT_BOLD_FILE}`);
  }

  pdf.addFileToVFS(PROPOSAL_FONT_REGULAR_FILE, cachedRegularFontBase64);
  pdf.addFont(PROPOSAL_FONT_REGULAR_FILE, PROPOSAL_FONT_REGULAR_ID, "normal");
  pdf.addFileToVFS(PROPOSAL_FONT_BOLD_FILE, cachedBoldFontBase64);
  pdf.addFont(PROPOSAL_FONT_BOLD_FILE, PROPOSAL_FONT_BOLD_ID, "bold");
}

export async function downloadPriceCalculatorProposalPdf({
  locale,
  copy,
  estimate,
  selections,
  form,
}: {
  locale: LocaleKey;
  copy: PriceCalculatorConfig["copy"];
  estimate: PriceCalculatorEstimate;
  selections: PriceCalculatorSelections;
  form?: ProposalLeadForm;
}) {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  await ensureProposalFonts(pdf as typeof pdf & FontReadyPdf);

  const contentCopy = proposalCopy[locale];
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const marginX = 48;
  const maxWidth = pageWidth - marginX * 2;
  const lineGap = 18;
  const money = (value: number) => `${MANAT} ${formatMoneyValue(locale, value)}`;
  let cursorY = 52;

  const setFontWeight = (weight: "normal" | "bold") => {
    pdf.setFont(weight === "bold" ? PROPOSAL_FONT_BOLD_ID : PROPOSAL_FONT_REGULAR_ID, weight);
  };

  const addWrappedText = (
    text: string,
    options?: { size?: number; color?: [number, number, number]; weight?: "normal" | "bold"; gap?: number }
  ) => {
    const size = options?.size ?? 11;
    const color = options?.color ?? [24, 31, 45];
    const gap = options?.gap ?? lineGap;

    setFontWeight(options?.weight ?? "normal");
    pdf.setFontSize(size);
    pdf.setTextColor(color[0], color[1], color[2]);

    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, marginX, cursorY);
    cursorY += lines.length * gap;
  };

  const ensureSpace = (height: number) => {
    if (cursorY + height <= pageHeight - 52) {
      return;
    }

    pdf.addPage();
    cursorY = 52;
  };

  const addSection = (title: string, lines: string[]) => {
    ensureSpace(60 + lines.length * lineGap);
    addWrappedText(title, { size: 14, weight: "bold", color: [53, 72, 166], gap: 20 });
    lines.forEach((entry) => addWrappedText(entry));
    cursorY += 8;
  };

  pdf.setFillColor(9, 14, 24);
  pdf.roundedRect(32, 28, pageWidth - 64, 108, 24, 24, "F");
  pdf.setTextColor(143, 150, 255);
  setFontWeight("bold");
  pdf.setFontSize(12);
  pdf.text("SITECREATOR", marginX, cursorY);
  cursorY += 28;

  pdf.setTextColor(245, 247, 251);
  pdf.setFontSize(24);
  pdf.text(contentCopy.documentTitle, marginX, cursorY);
  cursorY += 24;

  setFontWeight("normal");
  pdf.setFontSize(11);
  pdf.setTextColor(180, 192, 212);
  pdf.text(
    `${contentCopy.generatedAt}: ${formatDate(locale)} • ${contentCopy.estimate}: ${money(estimate.total)}`,
    marginX,
    cursorY
  );
  cursorY = 164;

  addSection(contentCopy.overview, [
    line(getLocalizedText(locale, copy.serviceTitle), getLocalizedText(locale, estimate.service.name)),
    line(getLocalizedText(locale, estimate.service.unitLabel), String(selections.unitCount)),
    line(contentCopy.design, getLocalizedText(locale, estimate.design.label)),
    line(contentCopy.timeline, getLocalizedText(locale, estimate.timeline.label)),
    line(contentCopy.logo, getLocalizedText(locale, estimate.logo.label)),
    line(contentCopy.support, money(estimate.monthlySupport)),
  ]);

  addSection(contentCopy.selectedAddons, [
    line(
      contentCopy.buildAddons,
      estimate.buildItems.length
        ? estimate.buildItems.map((item) => getLocalizedText(locale, item.label)).join(", ")
        : contentCopy.none
    ),
    line(
      contentCopy.seoAddons,
      estimate.seoItems.length
        ? estimate.seoItems.map((item) => getLocalizedText(locale, item.label)).join(", ")
        : contentCopy.none
    ),
  ]);

  addSection(contentCopy.costBreakdown, [
    line(getLocalizedText(locale, estimate.service.name), money(estimate.service.basePrice)),
    line(getLocalizedText(locale, copy.overage), money(estimate.scopePrice)),
    line(getLocalizedText(locale, copy.designImpact), money(estimate.designImpact)),
    line(getLocalizedText(locale, copy.buildExtras), money(estimate.buildTotal)),
    line(getLocalizedText(locale, copy.seoExtras), money(estimate.seoTotal)),
    line(getLocalizedText(locale, copy.logoOption), money(estimate.logoTotal)),
    line(contentCopy.total, money(estimate.total)),
    line(getLocalizedText(locale, copy.monthlySupport), money(estimate.monthlySupport)),
  ]);

  if (form && (form.name || form.email || form.phone || form.company)) {
    addSection(
      contentCopy.contactDetails,
      [
        form.name ? line(getLocalizedText(locale, copy.nameLabel), form.name) : null,
        form.email ? line(getLocalizedText(locale, copy.emailLabel), form.email) : null,
        form.phone ? line(getLocalizedText(locale, copy.phoneLabel), form.phone) : null,
        form.company ? line(getLocalizedText(locale, copy.companyLabel), form.company) : null,
      ].filter(Boolean) as string[]
    );
  }

  if (form?.message?.trim()) {
    addSection(contentCopy.note, [form.message.trim()]);
  }

  ensureSpace(72);
  pdf.setDrawColor(18, 24, 38);
  pdf.line(marginX, pageHeight - 72, pageWidth - marginX, pageHeight - 72);
  setFontWeight("normal");
  pdf.setFontSize(10);
  pdf.setTextColor(76, 88, 108);
  pdf.text(getLocalizedText(locale, copy.vatNote), marginX, pageHeight - 50);
  pdf.text(contentCopy.contactLine, marginX, pageHeight - 34);

  const fileNameBase = sanitizeFileName(getLocalizedText(locale, estimate.service.name)) || "proposal";
  pdf.save(`sitecreator-${fileNameBase}-${locale}.pdf`);
}
