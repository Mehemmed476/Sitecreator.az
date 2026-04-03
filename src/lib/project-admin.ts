import { connectDB } from "@/lib/db";
import { Project } from "@/lib/models/Project";
import { Proposal } from "@/lib/models/Proposal";
import { User } from "@/lib/models/User";

type AdminProjectStatus = "new" | "planning" | "in_progress" | "review" | "completed";
type AdminProposalStatus = "draft" | "sent" | "approved" | "rejected";
type AdminLeadSource = "contact" | "calculator" | "package";

function toIdString(value: unknown) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && "toString" in value && typeof value.toString === "function") {
    const next = value.toString();
    return next === "[object Object]" ? "" : next;
  }
  return "";
}

function toSafeText(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function toSafeNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function toIsoString(value: unknown) {
  if (!value) return new Date(0).toISOString();
  const parsed = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? new Date(0).toISOString() : parsed.toISOString();
}

function toProjectStatus(value: unknown): AdminProjectStatus {
  return value === "planning" ||
    value === "in_progress" ||
    value === "review" ||
    value === "completed"
    ? value
    : "new";
}

function toProposalStatus(value: unknown): AdminProposalStatus {
  return value === "sent" || value === "approved" || value === "rejected" ? value : "draft";
}

function toLeadSource(value: unknown): AdminLeadSource {
  return value === "calculator" || value === "package" ? value : "contact";
}

export async function getAdminProjectSummary() {
  await connectDB();

  const [projectCount, proposalCount, clientCount, projects] = await Promise.all([
    Project.countDocuments(),
    Proposal.countDocuments(),
    User.countDocuments({ role: "client" }),
    Project.find()
      .sort({ createdAt: -1 })
      .limit(24)
      .populate("clientId")
      .populate("leadId")
      .populate("proposalId")
      .lean(),
  ]);

  return {
    projectCount,
    proposalCount,
    clientCount,
    projects: projects.map((project) => {
      const client = project.clientId as unknown as {
        _id?: unknown;
        name?: string;
        email?: string;
        company?: string;
      };
      const lead = project.leadId as unknown as {
        _id?: unknown;
        name?: string;
        source?: "contact" | "calculator" | "package";
      };
      const proposal = project.proposalId as unknown as {
        _id?: unknown;
        proposalNumber?: string;
        status?: "draft" | "sent" | "approved" | "rejected";
        title?: string;
        summary?: string;
        note?: string;
        total?: number;
        monthlySupport?: number;
        lineItems?: Array<{ label?: string; amount?: number }>;
      };

      const milestones = Array.isArray(project.milestones)
        ? project.milestones
            .filter((item) => item && typeof item === "object")
            .map((item) => ({
              label: toSafeText(item.label, "Mərhələ"),
              done: Boolean(item.done),
            }))
        : [];

      return {
        _id: toIdString(project._id),
        title: toSafeText(project.title, "Adsız layihə"),
        serviceName: toSafeText(project.serviceName),
        summary: toSafeText(project.summary),
        status: toProjectStatus(project.status),
        total: toSafeNumber(project.total),
        monthlySupport: toSafeNumber(project.monthlySupport),
        timelineLabel: toSafeText(project.timelineLabel),
        milestones,
        createdAt: toIsoString(project.createdAt),
        updatedAt: toIsoString(project.updatedAt),
        client: {
          _id: toIdString(client?._id),
          name: toSafeText(client?.name, "Müştəri"),
          email: toSafeText(client?.email),
          company: toSafeText(client?.company),
        },
        lead: {
          _id: toIdString(lead?._id),
          name: toSafeText(lead?.name, "Lead"),
          source: toLeadSource(lead?.source),
        },
        proposal: {
          _id: toIdString(proposal?._id),
          proposalNumber: toSafeText(proposal?.proposalNumber, "-"),
          status: toProposalStatus(proposal?.status),
          title: toSafeText(proposal?.title),
          summary: toSafeText(proposal?.summary),
          note: toSafeText(proposal?.note),
          total: toSafeNumber(proposal?.total, toSafeNumber(project.total)),
          monthlySupport: toSafeNumber(
            proposal?.monthlySupport,
            toSafeNumber(project.monthlySupport)
          ),
          lineItems: Array.isArray(proposal?.lineItems)
            ? proposal.lineItems.map((item) => ({
                label: toSafeText(item?.label),
                amount: toSafeNumber(item?.amount),
              }))
            : [],
        },
      };
    }),
  };
}
