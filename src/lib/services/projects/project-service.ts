import { connectDB } from "@/lib/db";
import { AppError } from "@/lib/errors/app-error";
import { Contact } from "@/lib/models/Contact";
import { deleteProjectChatAttachments } from "@/lib/project-chat-attachments";
import { listProjectMessages, deleteProjectMessages } from "@/lib/repositories/project-chat-repository";
import { deleteProjectById, findProjectById } from "@/lib/repositories/project-repository";
import { deleteProposalById } from "@/lib/repositories/proposal-repository";
import { updateProjectInputSchema } from "@/lib/validators/project-validator";

export async function updateProjectEntry(id: string, payload: unknown) {
  const input = updateProjectInputSchema.parse(payload);
  await connectDB();
  const project = await findProjectById(id);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  if (typeof input.title === "string") {
    project.title = input.title;
  }
  if (typeof input.serviceName === "string") {
    project.serviceName = input.serviceName;
  }
  if (typeof input.summary === "string") {
    project.summary = input.summary;
  }
  if (typeof input.timelineLabel === "string") {
    project.timelineLabel = input.timelineLabel;
  }
  if (typeof input.total === "number") {
    project.total = Math.round(input.total);
  }
  if (typeof input.monthlySupport === "number") {
    project.monthlySupport = Math.round(input.monthlySupport);
  }
  if (input.status) {
    project.status = input.status;
  }
  if (Array.isArray(input.milestones)) {
    project.milestones = input.milestones.map((item) => ({
      label: item.label,
      done: Boolean(item.done),
    }));
  }

  await project.save();
  return project.toObject();
}

export async function clearProjectChatHistory(id: string) {
  await connectDB();
  const project = await findProjectById(id);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const messages = await listProjectMessages(project._id);
  const attachments = messages.flatMap((message) => message.attachments ?? []);

  await deleteProjectChatAttachments(attachments);
  await deleteProjectMessages(project._id);

  return { ok: true };
}

export async function deleteProjectEntry(id: string) {
  await connectDB();
  const project = await findProjectById(id);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const messages = await listProjectMessages(project._id);
  const attachments = messages.flatMap((message) => message.attachments ?? []);

  await deleteProjectChatAttachments(attachments);
  await deleteProjectMessages(project._id);

  if (project.proposalId) {
    await deleteProposalById(project.proposalId);
  }

  await Contact.updateMany(
    { projectId: project._id },
    { $set: { projectId: null, proposalId: null, convertedAt: null } }
  );

  await deleteProjectById(project._id);

  return { ok: true };
}
