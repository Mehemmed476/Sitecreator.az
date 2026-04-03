import mongoose, { Schema, type Document, type Model } from "mongoose";
import type {
  PackageDirectoryLocaleContent,
  PackageFaqItem,
  PackageInfoItem,
  PackageInstagramDraft,
  PackageLocale,
  PackageLocaleContent,
  PackageSolutionsConfig,
} from "@/lib/package-solutions";

interface IPackageSolutionsConfig extends Document {
  singletonKey: string;
  config: PackageSolutionsConfig;
  createdAt: Date;
  updatedAt: Date;
}

const PackageInfoItemSchema = new Schema<PackageInfoItem>(
  {
    title: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const PackageFaqItemSchema = new Schema<PackageFaqItem>(
  {
    question: { type: String, trim: true, default: "" },
    answer: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const PackageInstagramDraftSchema = new Schema<PackageInstagramDraft>(
  {
    coverTitle: { type: String, trim: true, default: "" },
    coverSubtitle: { type: String, trim: true, default: "" },
    caption: { type: String, trim: true, default: "" },
    cta: { type: String, trim: true, default: "" },
    slides: {
      type: [
        new Schema(
          {
            title: { type: String, trim: true, default: "" },
            body: { type: String, trim: true, default: "" },
          },
          { _id: false }
        ),
      ],
      default: [],
    },
  },
  { _id: false }
);

const PackageLocaleContentSchema = new Schema<PackageLocaleContent>(
  {
    cardTitle: { type: String, trim: true, default: "" },
    cardDescription: { type: String, trim: true, default: "" },
    heroBadge: { type: String, trim: true, default: "" },
    heroTitle: { type: String, trim: true, default: "" },
    heroDescription: { type: String, trim: true, default: "" },
    audienceTitle: { type: String, trim: true, default: "" },
    audienceDescription: { type: String, trim: true, default: "" },
    perfectForTitle: { type: String, trim: true, default: "" },
    perfectFor: { type: [String], default: [] },
    includedTitle: { type: String, trim: true, default: "" },
    includedModules: { type: [String], default: [] },
    highlightsTitle: { type: String, trim: true, default: "" },
    highlights: { type: [PackageInfoItemSchema], default: [] },
    faqTitle: { type: String, trim: true, default: "" },
    faqDescription: { type: String, trim: true, default: "" },
    faqItems: { type: [PackageFaqItemSchema], default: [] },
    timelineLabel: { type: String, trim: true, default: "" },
    primaryCta: { type: String, trim: true, default: "" },
    secondaryCta: { type: String, trim: true, default: "" },
    seoTitle: { type: String, trim: true, default: "" },
    seoDescription: { type: String, trim: true, default: "" },
    instagram: { type: PackageInstagramDraftSchema, default: () => ({}) },
  },
  { _id: false }
);

const PackageDirectoryLocaleContentSchema = new Schema<PackageDirectoryLocaleContent>(
  {
    badge: { type: String, trim: true, default: "" },
    title: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const PackageRecordSchema = new Schema(
  {
    id: { type: String, trim: true, required: true },
    order: { type: Number, default: 1 },
    category: { type: String, trim: true, default: "business" },
    coverImageUrl: { type: String, trim: true, default: "" },
    startingPrice: { type: Number, default: 0 },
    slugs: {
      az: { type: String, trim: true, default: "" },
      en: { type: String, trim: true, default: "" },
      ru: { type: String, trim: true, default: "" },
    } as Record<PackageLocale, unknown>,
    content: {
      az: { type: PackageLocaleContentSchema, default: () => ({}) },
      en: { type: PackageLocaleContentSchema, default: () => ({}) },
      ru: { type: PackageLocaleContentSchema, default: () => ({}) },
    } as Record<PackageLocale, unknown>,
  },
  { _id: false }
);

const PackageSolutionsConfigSchema = new Schema<IPackageSolutionsConfig>(
  {
    singletonKey: { type: String, required: true, unique: true },
    config: {
      directory: {
        az: { type: PackageDirectoryLocaleContentSchema, default: () => ({}) },
        en: { type: PackageDirectoryLocaleContentSchema, default: () => ({}) },
        ru: { type: PackageDirectoryLocaleContentSchema, default: () => ({}) },
      } as Record<PackageLocale, unknown>,
      packages: { type: [PackageRecordSchema], default: [] },
    },
  },
  { timestamps: true }
);

export const PackageSolutionsConfigModel: Model<IPackageSolutionsConfig> =
  mongoose.models.PackageSolutionsConfig ||
  mongoose.model<IPackageSolutionsConfig>("PackageSolutionsConfig", PackageSolutionsConfigSchema);
