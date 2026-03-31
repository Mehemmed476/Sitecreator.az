import mongoose, { Document, Model, Schema, Types } from "mongoose";

export const projectChatSenderRoles = ["admin", "client"] as const;
export type ProjectChatSenderRole = (typeof projectChatSenderRoles)[number];

export interface IProjectChatMessage extends Document {
  projectId: Types.ObjectId;
  proposalId?: Types.ObjectId | null;
  senderRole: ProjectChatSenderRole;
  senderUserId?: Types.ObjectId | null;
  senderName: string;
  body: string;
  attachments: Array<{
    url: string;
    publicId: string;
    originalName: string;
    resourceType: string;
    format?: string;
    bytes?: number;
    width?: number;
    height?: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectChatAttachmentSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, required: true, trim: true },
    originalName: { type: String, required: true, trim: true },
    resourceType: { type: String, required: true, trim: true },
    format: { type: String, trim: true, default: "" },
    bytes: { type: Number, default: 0 },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
  },
  { _id: false }
);

const ProjectChatMessageSchema = new Schema<IProjectChatMessage>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    proposalId: { type: Schema.Types.ObjectId, ref: "Proposal", default: null },
    senderRole: { type: String, enum: projectChatSenderRoles, required: true },
    senderUserId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    senderName: { type: String, required: true, trim: true },
    body: { type: String, default: "", trim: true, maxlength: 3000 },
    attachments: { type: [ProjectChatAttachmentSchema], default: [] },
  },
  { timestamps: true }
);

export const ProjectChatMessage: Model<IProjectChatMessage> =
  mongoose.models.ProjectChatMessage ||
  mongoose.model<IProjectChatMessage>("ProjectChatMessage", ProjectChatMessageSchema);
