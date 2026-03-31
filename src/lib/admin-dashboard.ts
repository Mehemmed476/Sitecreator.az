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

interface DashboardMetric {
  label: string;
  value: string;
  note: string;
  tone: "neutral" | "accent" | "success";
}

interface DashboardModuleSummary {
  label: string;
  href: string;
  description: string;
  stat: string;
  note: string;
}

interface DashboardRecentItem {
  title: string;
  meta: string;
  href: string;
}

interface DashboardChecklistItem {
  label: string;
  complete: boolean;
  detail: string;
}

export interface AdminDashboardSummary {
  metrics: DashboardMetric[];
  modules: DashboardModuleSummary[];
  recentMessages: DashboardRecentItem[];
  recentPosts: DashboardRecentItem[];
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

  return "Adsiz meqale";
}

function formatDate(value: Date | string | undefined) {
  if (!value) {
    return "Teyin olunmayib";
  }

  const date = new Date(value);

  return date.toLocaleDateString("en-GB", {
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

export async function getAdminDashboardSummary(): Promise<AdminDashboardSummary> {
  await connectDB();

  const [
    portfolioCount,
    leadCount,
    newLeads,
    calculatorLeads,
    projectCount,
    proposalCount,
    clientCount,
    publishedInsights,
    draftInsights,
    featuredDoc,
    homepageContent,
    calculatorConfig,
    siteSettings,
    latestMessages,
    latestInsights,
  ] = await Promise.all([
    Portfolio.countDocuments(),
    Contact.countDocuments(),
    Contact.countDocuments({ status: "new" }),
    Contact.countDocuments({ source: "calculator" }),
    Project.countDocuments(),
    Proposal.countDocuments(),
    User.countDocuments({ role: "client" }),
    Insight.countDocuments({ published: true }),
    Insight.countDocuments({ published: false }),
    HomepageFeatured.findOne().lean(),
    HomepageContentModel.findOne({ singletonKey: "main" }).lean(),
    PriceCalculatorConfigModel.findOne({ singletonKey: "main" }).lean(),
    SiteSettingsModel.findOne({ singletonKey: "main" }).lean(),
    Contact.find().sort({ createdAt: -1 }).limit(4).lean(),
    Insight.find().sort({ updatedAt: -1 }).limit(4).lean(),
  ]);

  const metrics: DashboardMetric[] = [
    {
      label: "Portfolio layiheleri",
      value: String(portfolioCount),
      note: featuredDoc?.projectIds?.length
        ? `Ana sehifede ${featuredDoc.projectIds.length} secilmis layihe var`
        : "Secilmis layihe yoxdur",
      tone: "accent",
    },
    {
      label: "Mesaj qutusu",
      value: newLeads > 0 ? `${newLeads} yeni lead` : "CRM temizdir",
      note: `Umumi ${leadCount} muraciet toplanib`,
      tone: newLeads > 0 ? "accent" : "success",
    },
    {
      label: "Paylasilan meqaleler",
      value: String(publishedInsights),
      note: `${draftInsights} draft gozleyir`,
      tone: "neutral",
    },
    {
      label: "Kalkulyator qurulusu",
      value: calculatorConfig ? "Hazirdir" : "Yoxdur",
      note: calculatorConfig
        ? `${calculatorConfig.config.services.length} xidmet, ${calculatorLeads} kalkulyator lead-i`
        : "Hele kalkulyator ayari saxlanmayib",
      tone: calculatorConfig ? "success" : "accent",
    },
    {
      label: "Portal axini",
      value: `${projectCount} layihə / ${proposalCount} təklif`,
      note: clientCount ? `${clientCount} client hesabı aktivdir` : "Hələ client hesabı yoxdur",
      tone: projectCount ? "success" : "neutral",
    },
  ];

  const modules: DashboardModuleSummary[] = [
    {
      label: "Ana sehife",
      href: "/admin/homepage",
      description: "Hero bloku, xidmetler, ana sehife bolmeleri ve diller uzre metnler.",
      stat: homepageContent ? "Hazirdir" : "Qurulmalidir",
      note: homepageContent
        ? `AZ ucun ${homepageContent.content.az.serviceItems.length} xidmet karti var`
        : "Ana sehife mezmunu hele yaradilmiyib",
    },
    {
      label: "Portfolio",
      href: "/admin/portfolio",
      description: "Layihe kartlari, sekiller ve public portfolio gorunusu.",
      stat: `${portfolioCount} layihe`,
      note: featuredDoc?.projectIds?.length
        ? `${featuredDoc.projectIds.length} layihe on plana cixarilib`
        : "Ana sehife ucun secim yoxdur",
    },
    {
      label: "Bloq ve SEO",
      href: "/admin/blog",
      description: "Coxdilli meqaleler, slug-lar, SEO saheleri ve cover sekilleri.",
      stat: `${publishedInsights} paylasilib / ${draftInsights} draft`,
      note: latestInsights[0]
        ? `Son yenilenme: ${formatDate(latestInsights[0].updatedAt)}`
        : "Hele meqale paylasilmayib",
    },
    {
      label: "Mesajlar",
      href: "/admin/sales/messages",
      description: "Elaqe formu ve kalkulyatordan gelen lead-leri statusla izle.",
      stat: newLeads > 0 ? `${newLeads} yeni` : "Hamisi baxilib",
      note: latestMessages[0]
        ? `Son muraciet: ${formatDate(latestMessages[0].createdAt)}`
        : "Hele mesaj yoxdur",
    },
    {
      label: "Layihələr və təkliflər",
      href: "/admin/sales/projects",
      description: "Lead-dən yaranan proposal və project axınını izlə.",
      stat: `${projectCount} layihə / ${proposalCount} təklif`,
      note: clientCount ? `${clientCount} portal hesabı aktivdir` : "Portal axını yeni başlayır",
    },
    {
      label: "Kalkulyator",
      href: "/admin/calculator",
      description: "Qiymet mentiqi, xidmetler, elaveler ve diller uzre metnler.",
      stat: calculatorConfig ? `${calculatorConfig.config.services.length} xidmet` : "Ayar yoxdur",
      note: calculatorConfig
        ? `${calculatorConfig.config.designOptions.length} dizayn secimi hazirdir`
        : "Evvelce kalkulyator ayarini yarat",
    },
    {
      label: "Elaqe melumatlari",
      href: "/admin/settings",
      description: "Telefon, WhatsApp, Instagram ve is saatlari.",
      stat: siteSettings?.phone ? "Elaqe hazirdir" : "Melumat catismir",
      note: siteSettings?.businessHours || "Is saatlari daxil edilmeyib",
    },
  ];

  const recentMessages: DashboardRecentItem[] = latestMessages.map((message) => ({
    title: message.name,
    meta: `${getLeadSourceLabel(message.source ?? "contact")} - ${getLeadStatusLabel(message.status ?? "new")} - ${formatDate(message.createdAt)}`,
    href: "/admin/sales/messages",
  }));

  const recentPosts: DashboardRecentItem[] = latestInsights.map((entry) => ({
    title: findFirstLocalizedTitle(entry.translations),
    meta: `${entry.published ? "Paylasilib" : "Draft"} - ${countReadyLocales(entry.translations)}/3 dil hazirdir`,
    href: "/admin/blog",
  }));

  const checklist: DashboardChecklistItem[] = [
    {
      label: "Ana sehife mezmunu hazirdir",
      complete: Boolean(homepageContent),
      detail: homepageContent
        ? `AZ ucun ${homepageContent.content.az.serviceItems.length} xidmet karti var`
        : "Ana sehife singleton-u hele yaradilmiyib",
    },
    {
      label: "Ana sehife ucun secilen layiheler var",
      complete: Boolean(featuredDoc?.projectIds?.length),
      detail: featuredDoc?.projectIds?.length
        ? `${featuredDoc.projectIds.length} layihe ana sehife ucun secilib`
        : "Secilenler modulunda layihe sec",
    },
    {
      label: "Elaqe melumatlari tamamdir",
      complete: Boolean(siteSettings?.phone && siteSettings?.whatsapp && siteSettings?.instagram),
      detail:
        siteSettings?.phone && siteSettings?.whatsapp && siteSettings?.instagram
          ? "Telefon, WhatsApp ve Instagram doldurulub"
          : "Public elaqe kanallarindan biri ve ya bir nechesi bosdur",
    },
    {
      label: "Coxdilli meqale ehatesi",
      complete: latestInsights.every((entry) => countReadyLocales(entry.translations) === 3),
      detail: latestInsights.length
        ? `${latestInsights.filter((entry) => countReadyLocales(entry.translations) === 3).length}/${latestInsights.length} son meqale tam lokallasdirilib`
        : "Yoxlamaq ucun hele meqale yoxdur",
    },
  ];

  return {
    metrics,
    modules,
    recentMessages,
    recentPosts,
    checklist,
  };
}
