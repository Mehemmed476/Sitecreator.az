import mongoose, { Document, Model, Schema } from "mongoose";
import {
  leadActivityTypes,
  leadSources,
  leadStatuses,
  type LeadActivityType,
  type LeadSource,
  type LeadStatus,
} from "@/lib/leads";

interface CalculatorSnapshot {
  locale?: string;
  total?: number;
  summary?: string;
  serviceName?: string;
  unitCount?: number;
  unitLabel?: string;
  designLabel?: string;
  logoLabel?: string;
  timelineLabel?: string;
  supportLabel?: string;
  monthlySupport?: number;
  buildLabels?: string[];
  seoLabels?: string[];
  lineItems?: Array<{
    label: string;
    amount: number;
  }>;
  selections?: Record<string, unknown>;
}

export interface ILeadActivity {
  type: LeadActivityType;
  title: string;
  detail?: string;
  createdAt: Date;
}

export interface IContact extends Document {
  name: string;
  email: string;
  message: string;
  phone?: string;
  company?: string;
  source: LeadSource;
  status: LeadStatus;
  notes?: string;
  outcomeReason?: string;
  nextFollowUpAt?: Date | null;
  clientUserId?: mongoose.Types.ObjectId | null;
  proposalId?: mongoose.Types.ObjectId | null;
  projectId?: mongoose.Types.ObjectId | null;
  convertedAt?: Date | null;
  isRead: boolean;
  calculator?: CalculatorSnapshot;
  activities: ILeadActivity[];
  createdAt: Date;
  updatedAt: Date;
}

const LeadActivitySchema = new Schema<ILeadActivity>(
  {
    type: { type: String, enum: leadActivityTypes, required: true },
    title: { type: String, required: true, trim: true },
    detail: { type: String, trim: true, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ContactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    phone: { type: String },
    company: { type: String },
    source: { type: String, enum: leadSources, default: "contact" },
    status: { type: String, enum: leadStatuses, default: "new" },
    notes: { type: String, default: "" },
    outcomeReason: { type: String, default: "" },
    nextFollowUpAt: { type: Date, default: null },
    clientUserId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    proposalId: { type: Schema.Types.ObjectId, ref: "Proposal", default: null },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", default: null },
    convertedAt: { type: Date, default: null },
    isRead: { type: Boolean, default: false },
    calculator: {
      locale: { type: String },
      total: { type: Number },
      summary: { type: String },
      serviceName: { type: String },
      unitCount: { type: Number },
      unitLabel: { type: String },
      designLabel: { type: String },
      logoLabel: { type: String },
      timelineLabel: { type: String },
      supportLabel: { type: String },
      monthlySupport: { type: Number },
      buildLabels: [{ type: String, trim: true }],
      seoLabels: [{ type: String, trim: true }],
      lineItems: [
        {
          label: { type: String, trim: true },
          amount: { type: Number, default: 0 },
        },
      ],
      selections: { type: Schema.Types.Mixed },
    },
    activities: { type: [LeadActivitySchema], default: [] },
  },
  { timestamps: true }
);

export const Contact: Model<IContact> =
  mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema);
