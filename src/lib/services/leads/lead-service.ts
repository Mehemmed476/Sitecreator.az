import { connectDB } from "@/lib/db";
import { AppError } from "@/lib/errors/app-error";
import { createLead, deleteLeadById, findLeadById, listLeads } from "@/lib/repositories/contact-repository";
import { deleteProjectMessages, listProjectMessages } from "@/lib/repositories/project-chat-repository";
import { countProjectsForClient, deleteProjectById } from "@/lib/repositories/project-repository";
import { countProposalsForClient, deleteProposalById } from "@/lib/repositories/proposal-repository";
import { deleteUserById, findUserDocumentById } from "@/lib/repositories/user-repository";
import { deleteProjectChatAttachments } from "@/lib/project-chat-attachments";
import { createLeadInputSchema, updateLeadInputSchema, type CreateLeadInput } from "@/lib/validators/lead-validator";

function parseFollowUpDate(value: string | null | undefined) {
  if (value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed;
}

function buildCreatedActivity(input: CreateLeadInput) {
  return {
    type: "created" as const,
    title: input.source === "calculator" ? "Kalkulyator lead-i yaradildi" : "Elaqe lead-i yaradildi",
    detail:
      input.source === "calculator" && typeof input.calculator?.total === "number"
        ? `Ilkin hesab: ${input.calculator.total}`
        : "Public saytdan yeni muraciet daxil oldu.",
    createdAt: new Date(),
  };
}

export async function listLeadsForAdmin() {
  await connectDB();
  return listLeads();
}

export async function createLeadEntry(payload: unknown) {
  const input = createLeadInputSchema.parse(payload);
  await connectDB();

  return createLead({
    name: input.name,
    email: input.email.toLowerCase(),
    message: input.message,
    phone: input.phone,
    company: input.company,
    source: input.source,
    status: input.status,
    notes: input.notes,
    outcomeReason: input.outcomeReason,
    calculator: input.source === "calculator" ? input.calculator : undefined,
    activities: [buildCreatedActivity(input)],
  });
}

export async function updateLeadEntry(id: string, payload: unknown) {
  const input = updateLeadInputSchema.parse(payload);
  await connectDB();
  const lead = await findLeadById(id);

  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  if (typeof input.isRead === "boolean") {
    if (lead.isRead !== input.isRead && input.isRead) {
      lead.activities.unshift({
        type: "marked_read",
        title: "Lead oxundu",
        detail: "Lead detail panelinde acildi.",
        createdAt: new Date(),
      });
    }
    lead.isRead = input.isRead;
  } else if (!lead.isRead) {
    lead.isRead = true;
  }

  if (input.status && lead.status !== input.status) {
    lead.activities.unshift({
      type: "status_changed",
      title: `Status deyisdi: ${input.status}`,
      detail: `Evvelki status: ${lead.status}`,
      createdAt: new Date(),
    });
    lead.status = input.status;
  }

  if (typeof input.notes === "string") {
    const nextNotes = input.notes.trim();
    if (nextNotes && nextNotes !== (lead.notes ?? "").trim()) {
      lead.activities.unshift({
        type: "note_added",
        title: "Daxili qeyd yenilendi",
        detail: nextNotes,
        createdAt: new Date(),
      });
    }
    lead.notes = nextNotes;
  }

  if (typeof input.outcomeReason === "string") {
    const nextOutcomeReason = input.outcomeReason.trim();
    if (nextOutcomeReason !== (lead.outcomeReason ?? "").trim()) {
      lead.activities.unshift({
        type: "outcome_updated",
        title: "Netice qeydi yenilendi",
        detail: nextOutcomeReason || "Netice qeydi silindi.",
        createdAt: new Date(),
      });
    }
    lead.outcomeReason = nextOutcomeReason;
  }

  if ("nextFollowUpAt" in input) {
    const parsedFollowUp = parseFollowUpDate(input.nextFollowUpAt);

    if (parsedFollowUp !== undefined) {
      const previous = lead.nextFollowUpAt ? new Date(lead.nextFollowUpAt).toISOString() : null;
      const next = parsedFollowUp ? parsedFollowUp.toISOString() : null;

      if (previous !== next) {
        lead.activities.unshift({
          type: parsedFollowUp ? "reminder_set" : "reminder_cleared",
          title: parsedFollowUp ? "Follow-up teyin olundu" : "Follow-up silindi",
          detail: parsedFollowUp
            ? parsedFollowUp.toLocaleString("az-AZ", {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Bu lead ucun novbeti xatirlatma silindi.",
          createdAt: new Date(),
        });
      }

      lead.nextFollowUpAt = parsedFollowUp;
    }
  }

  await lead.save();
  return lead.toObject();
}

export async function deleteLeadEntry(id: string) {
  await connectDB();
  const lead = await findLeadById(id);

  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  if (lead.projectId) {
    const projectMessages = await listProjectMessages(lead.projectId);
    const attachments = projectMessages.flatMap((message) => message.attachments ?? []);

    await deleteProjectChatAttachments(attachments);
    await deleteProjectMessages(lead.projectId);
    await deleteProjectById(lead.projectId);
  }

  if (lead.proposalId) {
    await deleteProposalById(lead.proposalId);
  }

  if (lead.clientUserId) {
    const client = await findUserDocumentById(lead.clientUserId.toString());

    if (client?.role === "client") {
      client.leadIds = client.leadIds.filter((leadId) => leadId.toString() !== lead._id.toString());

      const [remainingProjects, remainingProposals] = await Promise.all([
        countProjectsForClient(client._id),
        countProposalsForClient(client._id),
      ]);

      if (!client.leadIds.length && remainingProjects === 0 && remainingProposals === 0) {
        await deleteUserById(client._id.toString());
      } else {
        await client.save();
      }
    }
  }

  await deleteLeadById(id);
}
