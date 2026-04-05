import { z } from "zod";
import { leadSources, leadStatuses } from "../leads.ts";

const lineItemSchema = z.object({
  label: z.string().trim().min(1),
  amount: z.number().finite(),
});

const calculatorSnapshotSchema = z
  .object({
    locale: z.string().trim().optional(),
    total: z.number().finite().optional(),
    summary: z.string().optional(),
    serviceName: z.string().optional(),
    unitCount: z.number().finite().optional(),
    unitLabel: z.string().optional(),
    designLabel: z.string().optional(),
    logoLabel: z.string().optional(),
    timelineLabel: z.string().optional(),
    supportLabel: z.string().optional(),
    monthlySupport: z.number().finite().optional(),
    buildLabels: z.array(z.string().trim().min(1)).optional(),
    seoLabels: z.array(z.string().trim().min(1)).optional(),
    lineItems: z.array(lineItemSchema).optional(),
    selections: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

const packageRequestSnapshotSchema = z
  .object({
    id: z.string().trim().min(1),
    title: z.string().trim().min(1),
    slug: z.string().trim().min(1),
    category: z.string().trim().optional(),
    locale: z.string().trim().optional(),
    startingPrice: z.number().finite().optional(),
  })
  .strict();

export const createLeadInputSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  message: z.string().trim().min(1).max(4000),
  phone: z.string().trim().max(40).optional().default(""),
  company: z.string().trim().max(120).optional().default(""),
  source: z.enum(leadSources).optional().default("contact"),
  status: z.enum(leadStatuses).optional().default("new"),
  notes: z.string().trim().max(2000).optional().default(""),
  outcomeReason: z.string().trim().max(500).optional().default(""),
  calculator: calculatorSnapshotSchema.optional(),
  packageRequest: packageRequestSnapshotSchema.optional(),
});

export const updateLeadInputSchema = z
  .object({
    status: z.enum(leadStatuses).optional(),
    notes: z.string().max(2000).optional(),
    outcomeReason: z.string().max(500).optional(),
    nextFollowUpAt: z.union([z.string(), z.null()]).optional(),
    isRead: z.boolean().optional(),
  })
  .strict();

export type CreateLeadInput = z.infer<typeof createLeadInputSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadInputSchema>;
