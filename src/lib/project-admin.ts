import { connectDB } from "@/lib/db";
import { Project } from "@/lib/models/Project";
import { Proposal } from "@/lib/models/Proposal";
import { User } from "@/lib/models/User";

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
        _id?: { toString(): string };
        name?: string;
        email?: string;
        company?: string;
      };
      const lead = project.leadId as unknown as {
        _id?: { toString(): string };
        name?: string;
        source?: "contact" | "calculator";
      };
      const proposal = project.proposalId as unknown as {
        _id?: { toString(): string };
        proposalNumber?: string;
        status?: "draft" | "sent" | "approved" | "rejected";
        title?: string;
        summary?: string;
        note?: string;
        total?: number;
        monthlySupport?: number;
        lineItems?: Array<{ label?: string; amount?: number }>;
      };

      return {
        _id: project._id.toString(),
        title: project.title,
        serviceName: project.serviceName,
        summary: project.summary || "",
        status: project.status,
        total: project.total,
        monthlySupport: project.monthlySupport,
        timelineLabel: project.timelineLabel || "",
        milestones: (project.milestones ?? []).map((item) => ({
          label: item.label,
          done: item.done,
        })),
        createdAt: new Date(project.createdAt).toISOString(),
        updatedAt: new Date(project.updatedAt).toISOString(),
        client: {
          _id: client?._id?.toString?.() || "",
          name: client?.name || "Müştəri",
          email: client?.email || "",
          company: client?.company || "",
        },
        lead: {
          _id: lead?._id?.toString?.() || "",
          name: lead?.name || "Lead",
          source: lead?.source || "contact",
        },
        proposal: {
          _id: proposal?._id?.toString?.() || "",
          proposalNumber: proposal?.proposalNumber || "-",
          status: proposal?.status || "draft",
          title: proposal?.title || "",
          summary: proposal?.summary || "",
          note: proposal?.note || "",
          total: proposal?.total ?? project.total,
          monthlySupport: proposal?.monthlySupport ?? project.monthlySupport,
          lineItems: Array.isArray(proposal?.lineItems)
            ? (proposal.lineItems ?? []).map((item) => ({
                label: item.label || "",
                amount: typeof item.amount === "number" ? item.amount : 0,
              }))
            : [],
        },
      };
    }),
  };
}
