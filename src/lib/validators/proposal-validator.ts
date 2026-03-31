import { z } from "zod";
import { proposalStatuses } from "../models/Proposal.ts";

const lineItemSchema = z.object({
  label: z.string().trim().min(1),
  amount: z.number().finite(),
});

export const updateProposalInputSchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    serviceName: z.string().trim().min(1).optional(),
    summary: z.string().trim().optional(),
    note: z.string().trim().optional(),
    total: z.number().finite().optional(),
    monthlySupport: z.number().finite().optional(),
    status: z.enum(proposalStatuses).optional(),
    lineItems: z.array(lineItemSchema).optional(),
  })
  .strict();

export type UpdateProposalInput = z.infer<typeof updateProposalInputSchema>;
