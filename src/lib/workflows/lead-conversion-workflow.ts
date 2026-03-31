import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { AppError } from "@/lib/errors/app-error";
import { findLeadById } from "@/lib/repositories/contact-repository";
import { createProject, findProjectById } from "@/lib/repositories/project-repository";
import { createProposal, findProposalById } from "@/lib/repositories/proposal-repository";
import { createUser, findUserByEmail, findUserDocumentById } from "@/lib/repositories/user-repository";
import type { IContact } from "@/lib/models/Contact";
import { generateTemporaryPassword, hashPassword } from "@/lib/password";

function buildProposalNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `SC-${year}-${random}`;
}

function buildLineItems(lead: IContact | null) {
  if (!lead) return [];

  const calculatorItems =
    lead.calculator?.lineItems?.filter(
      (item) =>
        item &&
        typeof item.label === "string" &&
        item.label.trim() &&
        typeof item.amount === "number"
    ) ?? [];

  if (calculatorItems.length) {
    return calculatorItems.map((item) => ({
      label: item.label.trim(),
      amount: Math.round(item.amount),
    }));
  }

  if (typeof lead.calculator?.total === "number" && lead.calculator.total > 0) {
    return [
      {
        label: lead.calculator.serviceName?.trim() || "Xidmet teklifi",
        amount: Math.round(lead.calculator.total),
      },
    ];
  }

  return [{ label: "Ferdi layihe teklifi", amount: 0 }];
}

function buildProjectTitle(lead: IContact | null) {
  if (!lead) return "Yeni layihe";
  if (lead.calculator?.serviceName?.trim()) return `${lead.calculator.serviceName.trim()} layihesi`;
  if (lead.company?.trim()) return `${lead.company.trim()} ucun layihe`;
  return `${lead.name.trim()} layihesi`;
}

function buildProjectSummary(lead: IContact | null) {
  if (lead?.source === "calculator" && lead.calculator) {
    const serviceName = lead.calculator.serviceName?.trim() || "secilen xidmet";
    const timeline = lead.calculator.timelineLabel?.trim() || "standart timeline";
    const total =
      typeof lead.calculator.total === "number" ? Math.round(lead.calculator.total) : null;

    return total
      ? `${serviceName} ucun ilkin layihe plani hazirdir. Secilen paket ve elaveler esasinda texmini budce ${total} AZN, timeline ise ${timeline} kimi nezerde tutulur.`
      : `${serviceName} ucun ilkin layihe plani hazirdir. Secilen paket ve elaveler bu panelde seliqeli sekilde teqdim olunur.`;
  }

  return lead?.message?.trim() || "Lead esasinda avtomatik yaradilmis layihe karti.";
}

function buildProposalNote(lead: IContact | null) {
  if (!lead) return "Lead esasinda avtomatik hazirlanmis ilkin teklif.";

  if (lead.source === "calculator") {
    const lines = (lead.message || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const customMessage = lines[lines.length - 1];

    if (
      customMessage &&
      customMessage !== "-" &&
      !customMessage.startsWith("Phone:") &&
      !customMessage.startsWith("Company:")
    ) {
      return `Musteri qeydi: ${customMessage}`;
    }

    return "Kalkulyator secimleri esasinda avtomatik hazirlanmis ilkin teklif.";
  }

  return lead.message?.trim() || "Lead esasinda avtomatik hazirlanmis ilkin teklif.";
}

function buildMilestones() {
  return [
    { label: "Brief tesdiqlendi", done: true },
    { label: "Dizayn merhelesi", done: false },
    { label: "Hazirlanma", done: false },
    { label: "Test ve duzelisler", done: false },
    { label: "Tehvil ve destek", done: false },
  ];
}

export async function convertLeadToProject(leadId: string) {
  await connectDB();

  const lead = await findLeadById(leadId);
  if (!lead) {
    throw new AppError("Lead tapilmadi.", 404);
  }

  const normalizedEmail = lead.email.trim().toLowerCase();

  if (lead.projectId && lead.proposalId && lead.clientUserId) {
    return {
      lead,
      project: await findProjectById(lead.projectId),
      proposal: await findProposalById(lead.proposalId),
      client: await findUserDocumentById(lead.clientUserId.toString()),
      temporaryPassword: null,
      reused: true,
    };
  }
  let client = await findUserByEmail(normalizedEmail);
  let temporaryPassword: string | null = null;

  if (!client) {
    temporaryPassword = generateTemporaryPassword();
    client = await createUser({
      name: lead.name.trim() || "Musteri",
      email: normalizedEmail,
      passwordHash: hashPassword(temporaryPassword),
      role: "client",
      company: lead.company?.trim() || "",
      phone: lead.phone?.trim() || "",
      leadIds: [lead._id],
      portalEnabled: true,
    });
  } else {
    const hasLeadReference = client.leadIds.some((item) => item.toString() === lead._id.toString());
    if (!hasLeadReference) {
      client.leadIds.push(lead._id as Types.ObjectId);
      if (!client.company && lead.company) {
        client.company = lead.company;
      }
      if (!client.phone && lead.phone) {
        client.phone = lead.phone;
      }
      await client.save();
    }
  }

  const lineItems = buildLineItems(lead);
  const total =
    typeof lead.calculator?.total === "number"
      ? Math.round(lead.calculator.total)
      : lineItems.reduce((sum, item) => sum + item.amount, 0);
  const monthlySupport =
    typeof lead.calculator?.monthlySupport === "number"
      ? Math.round(lead.calculator.monthlySupport)
      : 0;
  const projectTitle = buildProjectTitle(lead);
  const serviceName = lead.calculator?.serviceName?.trim() || "Ferdi hell";
  const summary = buildProjectSummary(lead);

  const proposal = await createProposal({
    proposalNumber: buildProposalNumber(),
    clientId: client._id,
    leadId: lead._id,
    locale: lead.calculator?.locale?.trim() || "az",
    status: "draft",
    title: `${projectTitle} ucun teklif`,
    serviceName,
    summary,
    total,
    monthlySupport,
    lineItems,
    note: buildProposalNote(lead),
  });

  const project = await createProject({
    clientId: client._id,
    leadId: lead._id,
    proposalId: proposal._id,
    title: projectTitle,
    serviceName,
    summary,
    status: "new",
    total,
    monthlySupport,
    timelineLabel: lead.calculator?.timelineLabel?.trim() || "",
    milestones: buildMilestones(),
  });

  proposal.projectId = project._id;
  await proposal.save();

  lead.clientUserId = client._id;
  lead.proposalId = proposal._id;
  lead.projectId = project._id;
  lead.convertedAt = new Date();
  lead.status = lead.status === "new" ? "contacted" : lead.status;
  lead.activities.unshift({
    type: "status_changed",
    title: "Lead proposal ve layihəyə cevrildi",
    detail: `${proposal.proposalNumber} teklifi ve ${project.title} layihəsi yaradildi.`,
    createdAt: new Date(),
  });
  await lead.save();

  return {
    lead,
    project,
    proposal,
    client,
    temporaryPassword,
    reused: false,
  };
}
