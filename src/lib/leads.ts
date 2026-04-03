export const leadSources = ["contact", "calculator", "package"] as const;
export type LeadSource = (typeof leadSources)[number];

export const leadStatuses = [
  "new",
  "contacted",
  "proposal_sent",
  "won",
  "lost",
] as const;
export type LeadStatus = (typeof leadStatuses)[number];

export const leadActivityTypes = [
  "created",
  "status_changed",
  "note_added",
  "reminder_set",
  "reminder_cleared",
  "outcome_updated",
  "marked_read",
] as const;
export type LeadActivityType = (typeof leadActivityTypes)[number];

export type LeadActivity = {
  type: LeadActivityType;
  title: string;
  detail?: string;
  createdAt: string;
};

export const leadStatusMeta: Record<
  LeadStatus,
  {
    label: string;
    className: string;
  }
> = {
  new: {
    label: "Yeni",
    className: "border-sky-500/20 bg-sky-500/10 text-sky-300",
  },
  contacted: {
    label: "Əlaqə saxlanıldı",
    className: "border-violet-500/20 bg-violet-500/10 text-violet-300",
  },
  proposal_sent: {
    label: "Təklif göndərildi",
    className: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  },
  won: {
    label: "Qazanıldı",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  },
  lost: {
    label: "İtirildi",
    className: "border-rose-500/20 bg-rose-500/10 text-rose-300",
  },
};

export const leadSourceMeta: Record<
  LeadSource,
  {
    label: string;
    className: string;
  }
> = {
  contact: {
    label: "Əlaqə formu",
    className: "border-white/10 bg-white/5 text-foreground",
  },
  calculator: {
    label: "Kalkulyator",
    className: "border-primary/20 bg-primary/10 text-primary",
  },
  package: {
    label: "Paket",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  },
};

export function getLeadStatusLabel(status: LeadStatus) {
  return leadStatusMeta[status].label;
}

export function getLeadSourceLabel(source: LeadSource) {
  return leadSourceMeta[source].label;
}

export function formatLeadActivityLabel(type: LeadActivityType) {
  switch (type) {
    case "created":
      return "Lead yaradıldı";
    case "status_changed":
      return "Status yeniləndi";
    case "note_added":
      return "Qeyd əlavə olundu";
    case "reminder_set":
      return "Follow-up təyin olundu";
    case "reminder_cleared":
      return "Follow-up silindi";
    case "outcome_updated":
      return "Nəticə qeydi yeniləndi";
    case "marked_read":
      return "Lead oxundu";
    default:
      return "Fəaliyyət";
  }
}
