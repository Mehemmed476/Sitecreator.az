import { connectDB } from "@/lib/db";
import { AppError } from "@/lib/errors/app-error";
import { findProposalById } from "@/lib/repositories/proposal-repository";
import { updateProposalInputSchema } from "@/lib/validators/proposal-validator";

export async function updateProposalEntry(id: string, payload: unknown) {
  const input = updateProposalInputSchema.parse(payload);
  await connectDB();
  const proposal = await findProposalById(id);

  if (!proposal) {
    throw new AppError("Proposal not found", 404);
  }

  if (typeof input.title === "string") {
    proposal.title = input.title;
  }
  if (typeof input.serviceName === "string") {
    proposal.serviceName = input.serviceName;
  }
  if (typeof input.summary === "string") {
    proposal.summary = input.summary;
  }
  if (typeof input.note === "string") {
    proposal.note = input.note;
  }
  if (typeof input.total === "number") {
    proposal.total = Math.round(input.total);
  }
  if (typeof input.monthlySupport === "number") {
    proposal.monthlySupport = Math.round(input.monthlySupport);
  }
  if (input.status) {
    proposal.status = input.status;
  }
  if (Array.isArray(input.lineItems)) {
    proposal.lineItems = input.lineItems.map((item) => ({
      label: item.label,
      amount: Math.round(item.amount),
    }));
  }

  await proposal.save();
  return proposal.toObject();
}
