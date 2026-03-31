import mongoose, { Schema, Document, Model } from "mongoose";
import {
  createEmptyPortfolioTranslations,
  type PortfolioTranslations,
} from "@/lib/portfolio-types";

export interface IPortfolio extends Document {
  title: string;
  imageUrl: string;
  imagePublicId?: string;
  techStack: string[];
  translations: PortfolioTranslations;
  description?: string;
  projectUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioLocaleSchema = new Schema(
  {
    description: { type: String, default: "" },
    projectUrl: { type: String, default: "" },
  },
  { _id: false }
);

const PortfolioSchema = new Schema<IPortfolio>(
  {
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    imagePublicId: { type: String },
    techStack: [{ type: String }],
    translations: {
      az: { type: PortfolioLocaleSchema, default: () => createEmptyPortfolioTranslations().az },
      en: { type: PortfolioLocaleSchema, default: () => createEmptyPortfolioTranslations().en },
      ru: { type: PortfolioLocaleSchema, default: () => createEmptyPortfolioTranslations().ru },
    },
    description: { type: String },
    projectUrl: { type: String },
  },
  { timestamps: true }
);

export const Portfolio: Model<IPortfolio> =
  mongoose.models.Portfolio || mongoose.model<IPortfolio>("Portfolio", PortfolioSchema);
