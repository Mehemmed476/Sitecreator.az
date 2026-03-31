import mongoose, { Document, Model, Schema, Types } from "mongoose";

export const projectStatuses = [
  "new",
  "planning",
  "in_progress",
  "review",
  "completed",
] as const;

export type ProjectStatus = (typeof projectStatuses)[number];

export interface IProjectMilestone {
  label: string;
  done: boolean;
}

export interface IProject extends Document {
  clientId: Types.ObjectId;
  leadId: Types.ObjectId;
  proposalId: Types.ObjectId;
  title: string;
  serviceName: string;
  summary: string;
  status: ProjectStatus;
  total: number;
  monthlySupport: number;
  timelineLabel?: string;
  milestones: IProjectMilestone[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectMilestoneSchema = new Schema<IProjectMilestone>(
  {
    label: { type: String, required: true, trim: true },
    done: { type: Boolean, default: false },
  },
  { _id: false }
);

const ProjectSchema = new Schema<IProject>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    leadId: { type: Schema.Types.ObjectId, ref: "Contact", required: true, index: true },
    proposalId: { type: Schema.Types.ObjectId, ref: "Proposal", required: true, index: true },
    title: { type: String, required: true, trim: true },
    serviceName: { type: String, required: true, trim: true },
    summary: { type: String, default: "", trim: true },
    status: { type: String, enum: projectStatuses, default: "new" },
    total: { type: Number, required: true, default: 0 },
    monthlySupport: { type: Number, required: true, default: 0 },
    timelineLabel: { type: String, trim: true, default: "" },
    milestones: { type: [ProjectMilestoneSchema], default: [] },
  },
  { timestamps: true }
);

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
