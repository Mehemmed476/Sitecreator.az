import mongoose, { Schema, type Document, type Model } from "mongoose";
import type {
  HomepageContent,
  HomepageItem,
  HomepageLocale,
} from "@/lib/homepage-content";

interface IHomepageContent extends Document {
  singletonKey: string;
  content: HomepageContent;
  createdAt: Date;
  updatedAt: Date;
}

const HomepageItemSchema = new Schema<HomepageItem>(
  {
    title: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const HomepageLocaleContentSchema = new Schema(
  {
    heroBadge: { type: String, trim: true, default: "" },
    heroTitle: { type: String, trim: true, default: "" },
    heroTitleHighlight: { type: String, trim: true, default: "" },
    heroDescription: { type: String, trim: true, default: "" },
    heroPrimaryCta: { type: String, trim: true, default: "" },
    heroSecondaryCta: { type: String, trim: true, default: "" },
    servicesTitle: { type: String, trim: true, default: "" },
    servicesDescription: { type: String, trim: true, default: "" },
    serviceItems: { type: [HomepageItemSchema], default: [] },
    whyUsTitle: { type: String, trim: true, default: "" },
    whyUsDescription: { type: String, trim: true, default: "" },
    whyUsItems: { type: [HomepageItemSchema], default: [] },
    portalFeatureEyebrow: { type: String, trim: true, default: "" },
    portalFeatureTitle: { type: String, trim: true, default: "" },
    portalFeatureDescription: { type: String, trim: true, default: "" },
    portalFeatureItems: { type: [HomepageItemSchema], default: [] },
    portalFeaturePrimaryCta: { type: String, trim: true, default: "" },
    portalFeatureSecondaryCta: { type: String, trim: true, default: "" },
    marketEyebrow: { type: String, trim: true, default: "" },
    marketTitle: { type: String, trim: true, default: "" },
    marketIntro: { type: String, trim: true, default: "" },
    marketBullets: { type: [String], default: [] },
    ctaTitle: { type: String, trim: true, default: "" },
    ctaDescription: { type: String, trim: true, default: "" },
    ctaButton: { type: String, trim: true, default: "" },
    featuredTitle: { type: String, trim: true, default: "" },
    featuredEmptyState: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const HomepageContentSchema = new Schema<IHomepageContent>(
  {
    singletonKey: { type: String, required: true, unique: true },
    content: {
      az: { type: HomepageLocaleContentSchema, default: () => ({}) },
      en: { type: HomepageLocaleContentSchema, default: () => ({}) },
      ru: { type: HomepageLocaleContentSchema, default: () => ({}) },
    } as Record<HomepageLocale, unknown>,
  },
  { timestamps: true }
);

export const HomepageContentModel: Model<IHomepageContent> =
  mongoose.models.HomepageContent ||
  mongoose.model<IHomepageContent>("HomepageContent", HomepageContentSchema);
