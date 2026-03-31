import mongoose, { Document, Model, Schema, Types } from "mongoose";

export const proposalStatuses = ["draft", "sent", "approved", "rejected"] as const;
export type ProposalStatus = (typeof proposalStatuses)[number];

export interface IProposalLineItem {
  label: string;
  amount: number;
}

export interface IProposal extends Document {
  proposalNumber: string;
  clientId: Types.ObjectId;
  leadId: Types.ObjectId;
  projectId?: Types.ObjectId | null;
  locale: string;
  status: ProposalStatus;
  title: string;
  serviceName: string;
  summary: string;
  total: number;
  monthlySupport: number;
  lineItems: IProposalLineItem[];
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProposalLineItemSchema = new Schema<IProposalLineItem>(
  {
    label: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const ProposalSchema = new Schema<IProposal>(
  {
    proposalNumber: { type: String, required: true, unique: true, index: true },
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    leadId: { type: Schema.Types.ObjectId, ref: "Contact", required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", default: null, index: true },
    locale: { type: String, required: true, default: "az" },
    status: { type: String, enum: proposalStatuses, default: "draft" },
    title: { type: String, required: true, trim: true },
    serviceName: { type: String, required: true, trim: true },
    summary: { type: String, default: "", trim: true },
    total: { type: Number, required: true, default: 0 },
    monthlySupport: { type: Number, required: true, default: 0 },
    lineItems: { type: [ProposalLineItemSchema], default: [] },
    note: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

export const Proposal: Model<IProposal> =
  mongoose.models.Proposal || mongoose.model<IProposal>("Proposal", ProposalSchema);
