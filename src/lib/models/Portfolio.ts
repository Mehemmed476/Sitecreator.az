import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPortfolio extends Document {
  title: string;
  description: string;
  imageUrl: string;
  imagePublicId?: string;
  techStack: string[];
  projectUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioSchema = new Schema<IPortfolio>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    imagePublicId: { type: String },
    techStack: [{ type: String }],
    projectUrl: { type: String },
  },
  { timestamps: true }
);

export const Portfolio: Model<IPortfolio> =
  mongoose.models.Portfolio || mongoose.model<IPortfolio>("Portfolio", PortfolioSchema);
