import type { LucideIcon } from "lucide-react";
import type { InsightRecord } from "@/lib/insight-types";
import type { LeadActivity, LeadSource, LeadStatus } from "@/lib/leads";
import type { PortfolioTranslations } from "@/lib/portfolio-types";
import type { SiteSettings } from "@/lib/site-settings";

export interface PortfolioItem {
  _id: string;
  title: string;
  imageUrl: string;
  techStack: string[];
  translations: PortfolioTranslations;
  createdAt: string;
}

export interface LeadRecord {
  _id: string;
  name: string;
  email: string;
  message: string;
  phone?: string;
  company?: string;
  source: LeadSource;
  status: LeadStatus;
  notes?: string;
  outcomeReason?: string;
  nextFollowUpAt?: string | null;
  clientUserId?: string | null;
  proposalId?: string | null;
  projectId?: string | null;
  convertedAt?: string | null;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  activities?: LeadActivity[];
  calculator?: {
    locale?: string;
    total?: number;
    summary?: string;
    serviceName?: string;
    unitCount?: number;
    unitLabel?: string;
    designLabel?: string;
    logoLabel?: string;
    timelineLabel?: string;
    supportLabel?: string;
    monthlySupport?: number;
    buildLabels?: string[];
    seoLabels?: string[];
    lineItems?: Array<{ label: string; amount: number }>;
    selections?: Record<string, unknown>;
  };
}

export interface AdminProjectRecord {
  _id: string;
  title: string;
  serviceName: string;
  summary: string;
  status: "new" | "planning" | "in_progress" | "review" | "completed";
  total: number;
  monthlySupport: number;
  timelineLabel?: string;
  milestones: Array<{ label: string; done: boolean }>;
  createdAt: string;
  updatedAt: string;
  client: {
    _id: string;
    name: string;
    email: string;
    company?: string;
  };
  lead: {
    _id: string;
    name: string;
    source: LeadSource;
  };
  proposal: {
    _id: string;
    proposalNumber: string;
    status: "draft" | "sent" | "approved" | "rejected";
    title?: string;
    summary?: string;
    note?: string;
    total?: number;
    monthlySupport?: number;
    lineItems?: Array<{ label: string; amount: number }>;
  };
}

export type AdminTab =
  | "dashboard"
  | "analytics"
  | "homepage"
  | "socialProof"
  | "media"
  | "services"
  | "portfolio"
  | "blog"
  | "sales"
  | "calculator"
  | "settings";

export type AdminInsight = InsightRecord;
export type SiteSettingsData = SiteSettings;

export interface AdminTabConfig {
  id: AdminTab;
  href: string;
  group: "Panel" | "Məzmun" | "Böyümə" | "Əməliyyatlar";
  label: string;
  description: string;
  icon: LucideIcon;
}
