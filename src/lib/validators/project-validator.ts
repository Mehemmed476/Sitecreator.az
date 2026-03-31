import { z } from "zod";
import { projectStatuses } from "../models/Project.ts";

const milestoneSchema = z.object({
  label: z.string().trim().min(1),
  done: z.boolean().optional().default(false),
});

export const updateProjectInputSchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    serviceName: z.string().trim().min(1).optional(),
    summary: z.string().trim().optional(),
    status: z.enum(projectStatuses).optional(),
    total: z.number().finite().optional(),
    monthlySupport: z.number().finite().optional(),
    timelineLabel: z.string().trim().optional(),
    milestones: z.array(milestoneSchema).optional(),
  })
  .strict();

export type UpdateProjectInput = z.infer<typeof updateProjectInputSchema>;
