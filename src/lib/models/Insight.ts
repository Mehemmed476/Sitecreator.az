import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { InsightTranslations, InsightType } from "@/lib/insight-types";

export interface IInsight extends Document {
  type: InsightType;
  translations: InsightTranslations;
  coverImageUrl?: string;
  coverImagePublicId?: string;
  published: boolean;
  featured: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LocalizedInsightSchema = new Schema(
  {
    title: { type: String, trim: true, default: "" },
    slug: { type: String, trim: true, default: "" },
    excerpt: { type: String, trim: true, default: "" },
    content: { type: String, trim: true, default: "" },
    tags: [{ type: String, trim: true }],
    coverImageUrl: { type: String, trim: true, default: "" },
    coverImagePublicId: { type: String, trim: true, default: "" },
    seoTitle: { type: String, trim: true, default: "" },
    seoDescription: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const InsightSchema = new Schema<IInsight>(
  {
    type: {
      type: String,
      enum: ["blog", "case-study"],
      required: true,
      default: "blog",
    },
    translations: {
      az: { type: LocalizedInsightSchema, default: () => ({}) },
      en: { type: LocalizedInsightSchema, default: () => ({}) },
      ru: { type: LocalizedInsightSchema, default: () => ({}) },
    },
    coverImageUrl: { type: String },
    coverImagePublicId: { type: String },
    published: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

InsightSchema.index({ published: 1, publishedAt: -1 });
InsightSchema.index({ type: 1, published: 1, publishedAt: -1 });
InsightSchema.index({ "translations.az.slug": 1 }, { sparse: true });
InsightSchema.index({ "translations.en.slug": 1 }, { sparse: true });
InsightSchema.index({ "translations.ru.slug": 1 }, { sparse: true });

export const Insight: Model<IInsight> =
  mongoose.models.Insight || mongoose.model<IInsight>("Insight", InsightSchema);
