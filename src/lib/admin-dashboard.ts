import { hasGaReportingConfig } from "@/lib/analytics";
import { connectDB } from "@/lib/db";
import { insightLocales } from "@/lib/insight-types";
import { getLeadSourceLabel, getLeadStatusLabel } from "@/lib/leads";
import { Contact } from "@/lib/models/Contact";
import { HomepageContentModel } from "@/lib/models/HomepageContent";
import { HomepageFeatured } from "@/lib/models/HomepageFeatured";
import { Insight } from "@/lib/models/Insight";
import { Portfolio } from "@/lib/models/Portfolio";
import { PriceCalculatorConfigModel } from "@/lib/models/PriceCalculatorConfig";
import { Project } from "@/lib/models/Project";
import { Proposal } from "@/lib/models/Proposal";
import { SiteSettingsModel } from "@/lib/models/SiteSettings";
import { User } from "@/lib/models/User";

type DashboardLocale = (typeof insightLocales)[number];
type DashboardTone = "neutral" | "accent" | "success" | "danger";
type WorkspaceHealth = "healthy" | "progress" | "attention";

interface DashboardSnapshot {
  label: string;
  value: string;
}

export interface DashboardPulseItem {
  label: string;
  value: string;
  detail: string;
  href: string;
  tone: DashboardTone;
}

export interface DashboardActionLane {
  eyebrow: string;
  title: string;
  detail: string;
  href: string;
  cta: string;
  stat: string;
  tone: DashboardTone;
}

export interface DashboardWorkspaceCard {
  label: string;
  href: string;
  description: string;
  stat: string;
  note: string;
  health: WorkspaceHealth;
}

export interface DashboardActivityItem {
  title: string;
  meta: string;
  href: string;
  kind: string;
  timestamp: number;
}

export interface DashboardChecklistItem {
  label: string;
  complete: boolean;
  detail: string;
  href: string;
}

export interface AdminDashboardSummary {
  snapshots: DashboardSnapshot[];
  pulse: DashboardPulseItem[];
  actionLanes: DashboardActionLane[];
  workspaceHealth: DashboardWorkspaceCard[];
  recentActivity: DashboardActivityItem[];
  checklist: DashboardChecklistItem[];
}

function findFirstLocalizedTitle(
  translations: Record<DashboardLocale, { title?: string }>
) {
  for (const locale of insightLocales) {
    const value = translations[locale]?.title?.trim();
    if (value) {
      return value;
    }
  }

  return "Adsız məqalə";
}

function formatDate(value: Date | string | undefined) {
  if (!value) {
    return "Təyin olunmayıb";
  }

  const date = new Date(value);

  return date.toLocaleDateString("az-AZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function countReadyLocales(
  translations: Record<DashboardLocale, { title?: string; slug?: string; content?: string }>
) {
  return insightLocales.filter((locale) => {
    const entry = translations[locale];
    return Boolean(entry?.title?.trim() && entry?.slug?.trim() && entry?.content?.trim());
  }).length;
}

function formatCount(value: number, singular: string, plural: string = singular) {
  if (value === 1) {
    return `1 ${singular}`;
  }

  return `${value} ${plural}`;
}

export async function getAdminDashboardSummary(): Promise<AdminDashboardSummary> {
  await connectDB();

  const now = new Date();

  const [
    portfolioCount,
    leadCount,
    newLeads,
    overdueFollowUps,
    calculatorLeads,
    projectCount,
    activeProjects,
    reviewProjects,
    proposalCount,
    draftProposals,
    sentProposals,
    approvedProposals,
    clientCount,
    publishedInsights,
    draftInsights,
    featuredDoc,
    homepageContent,
    calculatorConfig,
    siteSettings,
    latestMessages,
    latestInsights,
    latestProjects,
  ] = await Promise.all([
    Portfolio.countDocuments(),
    Contact.countDocuments(),
    Contact.countDocuments({ status: "new" }),
    Contact.countDocuments({
      nextFollowUpAt: { $ne: null, $lte: now },
      status: { $nin: ["won", "lost"] },
    }),
    Contact.countDocuments({ source: "calculator" }),
    Project.countDocuments(),
    Project.countDocuments({ status: { $in: ["new", "planning", "in_progress", "review"] } }),
    Project.countDocuments({ status: "review" }),
    Proposal.countDocuments(),
    Proposal.countDocuments({ status: "draft" }),
    Proposal.countDocuments({ status: "sent" }),
    Proposal.countDocuments({ status: "approved" }),
    User.countDocuments({ role: "client" }),
    Insight.countDocuments({ published: true }),
    Insight.countDocuments({ published: false }),
    HomepageFeatured.findOne().lean(),
    HomepageContentModel.findOne({ singletonKey: "main" }).lean(),
    PriceCalculatorConfigModel.findOne({ singletonKey: "main" }).lean(),
    SiteSettingsModel.findOne({ singletonKey: "main" }).lean(),
    Contact.find().sort({ updatedAt: -1 }).limit(4).lean(),
    Insight.find().sort({ updatedAt: -1 }).limit(4).lean(),
    Project.find().sort({ updatedAt: -1 }).limit(4).lean(),
  ]);

  const localizedInsightCount = latestInsights.filter(
    (entry) => countReadyLocales(entry.translations) === 3
  ).length;
  const featuredCount = featuredDoc?.projectIds?.length ?? 0;
  const contactChannelsReady = Boolean(
    siteSettings?.phone && siteSettings?.whatsapp && siteSettings?.instagram
  );
  const analyticsReady = hasGaReportingConfig();

  const snapshots: DashboardSnapshot[] = [
    { label: "Lead", value: String(leadCount) },
    { label: "Aktiv layihə", value: String(activeProjects) },
    { label: "Yayımlanan məqalə", value: String(publishedInsights) },
    { label: "Client portal hesabı", value: String(clientCount) },
  ];

  const pulse: DashboardPulseItem[] = [
    {
      label: "Yeni lead-lər",
      value: String(newLeads),
      detail:
        newLeads > 0
          ? "İlk cavab gecikməsin deyə CRM-dən dərhal bax."
          : "Hazırda cavab gözləyən yeni müraciət yoxdur.",
      href: "/admin/sales/messages",
      tone: newLeads > 0 ? "danger" : "success",
    },
    {
      label: "Gecikmiş follow-up",
      value: String(overdueFollowUps),
      detail:
        overdueFollowUps > 0
          ? "Vaxtı keçmiş follow-up-lar satış axınını ləngidir."
          : "Follow-up növbəsi təmizdir.",
      href: "/admin/sales/messages",
      tone: overdueFollowUps > 0 ? "danger" : "success",
    },
    {
      label: "Cavab gözləyən təklif",
      value: String(sentProposals),
      detail:
        sentProposals > 0
          ? "Göndərilmiş təkliflərə geri dönüşü izləmək vaxtıdır."
          : "Hal-hazırda cavab gözləyən təklif yoxdur.",
      href: "/admin/sales/projects",
      tone: sentProposals > 0 ? "accent" : "neutral",
    },
    {
      label: "Review mərhələsində layihə",
      value: String(reviewProjects),
      detail:
        reviewProjects > 0
          ? "Təhvil və ya yoxlama gözləyən layihələr buradadır."
          : "Review mərhələsində gözləyən layihə yoxdur.",
      href: "/admin/sales/projects",
      tone: reviewProjects > 0 ? "accent" : "neutral",
    },
  ];

  const actionLanes: DashboardActionLane[] = [
    {
      eyebrow: "Satış masası",
      title:
        newLeads > 0
          ? `${formatCount(newLeads, "yeni lead", "yeni lead")} cavab gözləyir`
          : "CRM sakitdir, yeni lead növbəsi təmizdir",
      detail:
        overdueFollowUps > 0
          ? `${formatCount(overdueFollowUps, "follow-up", "follow-up")} vaxtını keçib. Bu hissəni əvvəl bağlamaq yaxşı olar.`
          : "Yeni mesajlar, follow-up və conversion axını tək mərkəzdən görünür.",
      href: "/admin/sales/messages",
      cta: "Lead-lərə keç",
      stat: `${leadCount} ümumi müraciət`,
      tone: newLeads > 0 || overdueFollowUps > 0 ? "danger" : "success",
    },
    {
      eyebrow: "Proposal və layihə axını",
      title:
        sentProposals > 0
          ? `${formatCount(sentProposals, "təklif")} cavab gözləyir`
          : `${formatCount(activeProjects, "aktiv layihə")} idarə olunur`,
      detail:
        draftProposals > 0
          ? `${formatCount(draftProposals, "draft təklif")} göndərilməyə hazırdır.`
          : reviewProjects > 0
            ? `${formatCount(reviewProjects, "layihə")} review mərhələsindədir.`
            : "Təklif, project və portal axını balanslı görünür.",
      href: "/admin/sales/projects",
      cta: "Layihələri aç",
      stat: `${proposalCount} təklif / ${projectCount} layihə`,
      tone: sentProposals > 0 || draftProposals > 0 || reviewProjects > 0 ? "accent" : "success",
    },
    {
      eyebrow: "Məzmun və görünürlük",
      title:
        draftInsights > 0
          ? `${formatCount(draftInsights, "draft məqalə")} yayın gözləyir`
          : "Məzmun tərəfi nəzarət altındadır",
      detail:
        featuredCount === 0
          ? "Ana səhifə üçün seçilən layihə yoxdur. Hero və portfolio axınını tamamla."
          : localizedInsightCount < latestInsights.length
            ? "Son məqalələrin bir qismi hələ 3 dildə tamamlanmayıb."
            : "Blog, ana səhifə və SEO məzmunu eyni paneldən idarə oluna bilir.",
      href: draftInsights > 0 ? "/admin/blog" : "/admin/homepage",
      cta: draftInsights > 0 ? "Bloqa keç" : "Ana səhifəni aç",
      stat: `${publishedInsights} yayında / ${portfolioCount} portfolio`,
      tone:
        draftInsights > 0 || featuredCount === 0 || localizedInsightCount < latestInsights.length
          ? "accent"
          : "success",
    },
  ];

  const workspaceHealth: DashboardWorkspaceCard[] = [
    {
      label: "CRM və satış",
      href: "/admin/sales/messages",
      description: "Yeni lead, follow-up və source axını burada bağlanır.",
      stat: newLeads > 0 ? `${newLeads} yeni lead` : "Növbə təmizdir",
      note:
        overdueFollowUps > 0
          ? `${overdueFollowUps} follow-up gecikib`
          : "Yeni follow-up problemi görünmür",
      health: newLeads > 0 || overdueFollowUps > 0 ? "attention" : "healthy",
    },
    {
      label: "Proposal və layihələr",
      href: "/admin/sales/projects",
      description: "Təklif, project və client portal axını eyni yerdədir.",
      stat: `${activeProjects} aktiv layihə`,
      note:
        sentProposals > 0
          ? `${sentProposals} təklif cavab gözləyir`
          : `${approvedProposals} təklif təsdiqlənib`,
      health: sentProposals > 0 || reviewProjects > 0 ? "progress" : "healthy",
    },
    {
      label: "Ana səhifə və portfolio",
      href: "/admin/homepage",
      description: "Hero, əsas bloklar və ana səhifəyə çıxan layihələr.",
      stat: homepageContent ? "Ana səhifə hazırdır" : "Setup gözləyir",
      note:
        featuredCount > 0
          ? `${featuredCount} layihə ana səhifədə göstərilir`
          : "Ana səhifə üçün seçilən portfolio yoxdur",
      health: homepageContent && featuredCount > 0 ? "healthy" : "attention",
    },
    {
      label: "Blog və SEO",
      href: "/admin/blog",
      description: "Çoxdilli məqalələr, slug-lar və cover axını.",
      stat: `${publishedInsights} yayın / ${draftInsights} draft`,
      note:
        latestInsights.length > 0
          ? `${localizedInsightCount}/${latestInsights.length} son məqalə 3 dilə hazırdır`
          : "Hələ məqalə yaradılmayıb",
      health: draftInsights > 0 ? "progress" : "healthy",
    },
    {
      label: "Kalkulyator və teklif axını",
      href: "/admin/calculator",
      description: "Qiymət məntiqi, lead capture və PDF proposal.",
      stat: calculatorConfig ? `${calculatorConfig.config.services.length} xidmət` : "Qurulmayıb",
      note: `${calculatorLeads} kalkulyator müraciəti toplanıb`,
      health: calculatorConfig ? "healthy" : "attention",
    },
    {
      label: "Analytics və əlaqə kanalları",
      href: analyticsReady ? "/admin/analytics" : "/admin/settings",
      description: "GA4 izləmə, telefon, WhatsApp və sosial girişlər.",
      stat: analyticsReady ? "GA4 bağlıdır" : "Analytics setup lazımdır",
      note: contactChannelsReady ? "Əlaqə kanalları tamamdır" : "Əlaqə məlumatlarında boşluq var",
      health: analyticsReady && contactChannelsReady ? "healthy" : "attention",
    },
  ];

  const recentActivity: DashboardActivityItem[] = [
    ...latestMessages.map((message) => ({
      title: message.name,
      meta: `${getLeadSourceLabel(message.source ?? "contact")} · ${getLeadStatusLabel(message.status ?? "new")} · ${formatDate(message.updatedAt ?? message.createdAt)}`,
      href: "/admin/sales/messages",
      kind: "Lead",
      timestamp: new Date(message.updatedAt ?? message.createdAt ?? now).getTime(),
    })),
    ...latestProjects.map((project) => ({
      title: project.title,
      meta: `${project.status.replaceAll("_", " ")} · ${formatDate(project.updatedAt)}`,
      href: "/admin/sales/projects",
      kind: "Layihə",
      timestamp: new Date(project.updatedAt ?? project.createdAt ?? now).getTime(),
    })),
    ...latestInsights.map((entry) => ({
      title: findFirstLocalizedTitle(entry.translations),
      meta: `${entry.published ? "Yayında" : "Draft"} · ${countReadyLocales(entry.translations)}/3 dil · ${formatDate(entry.updatedAt)}`,
      href: "/admin/blog",
      kind: "Məzmun",
      timestamp: new Date(entry.updatedAt ?? entry.createdAt ?? now).getTime(),
    })),
  ]
    .sort((left, right) => right.timestamp - left.timestamp)
    .slice(0, 8);

  const checklist: DashboardChecklistItem[] = [
    {
      label: "Ana səhifə məzmunu hazırdır",
      complete: Boolean(homepageContent),
      detail: homepageContent
        ? `${homepageContent.content.az.serviceItems.length} xidmət kartı doldurulub`
        : "Hero və əsas bloklar üçün singleton məzmun yaradılmalıdır",
      href: "/admin/homepage",
    },
    {
      label: "Ana səhifə üçün seçilən layihələr var",
      complete: featuredCount > 0,
      detail:
        featuredCount > 0
          ? `${featuredCount} portfolio kartı ön plana çıxarılıb`
          : "Portfolio modulunda ana səhifə üçün layihə seç",
      href: "/admin/portfolio",
    },
    {
      label: "Əlaqə kanalları tamamdır",
      complete: contactChannelsReady,
      detail: contactChannelsReady
        ? "Telefon, WhatsApp və Instagram doldurulub"
        : "Public əlaqə kanallarından biri və ya bir neçəsi boşdur",
      href: "/admin/settings",
    },
    {
      label: "GA4 Data API hazırdır",
      complete: analyticsReady,
      detail: analyticsReady
        ? "Admin içində canlı trafik xülasəsi görünəcək"
        : "GA4 Property ID və service account məlumatlarını tamamla",
      href: "/admin/analytics",
    },
    {
      label: "Son məqalələr 3 dildə tamamlanıb",
      complete: latestInsights.length > 0 && localizedInsightCount === latestInsights.length,
      detail: latestInsights.length
        ? `${localizedInsightCount}/${latestInsights.length} son məqalə tam lokallaşdırılıb`
        : "Yoxlama üçün hələ məqalə yoxdur",
      href: "/admin/blog",
    },
    {
      label: "Kalkulyator satış üçün hazırdır",
      complete: Boolean(calculatorConfig),
      detail: calculatorConfig
        ? `${calculatorConfig.config.designOptions.length} dizayn seçimi və ${calculatorLeads} lead tarixi var`
        : "Qiymət mühərriki üçün əsas config saxlanmayıb",
      href: "/admin/calculator",
    },
  ];

  return {
    snapshots,
    pulse,
    actionLanes,
    workspaceHealth,
    recentActivity,
    checklist,
  };
}
