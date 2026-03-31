import mongoose, { Schema, type Document, type Model } from "mongoose";
import type {
  ServiceDirectoryLocaleContent,
  ServiceFaqItem,
  ServiceInfoItem,
  ServiceLocale,
  ServicePageLocaleContent,
  ServicePagesConfig,
} from "@/lib/service-pages";

interface IServicePagesConfig extends Document {
  singletonKey: string;
  config: ServicePagesConfig;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceInfoItemSchema = new Schema<ServiceInfoItem>(
  {
    title: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const ServiceFaqItemSchema = new Schema<ServiceFaqItem>(
  {
    question: { type: String, trim: true, default: "" },
    answer: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const ServicePageLocaleContentSchema = new Schema<ServicePageLocaleContent>(
  {
    cardTitle: { type: String, trim: true, default: "" },
    cardDescription: { type: String, trim: true, default: "" },
    heroBadge: { type: String, trim: true, default: "" },
    heroTitle: { type: String, trim: true, default: "" },
    heroDescription: { type: String, trim: true, default: "" },
    primaryCta: { type: String, trim: true, default: "" },
    secondaryCta: { type: String, trim: true, default: "" },
    overviewTitle: { type: String, trim: true, default: "" },
    overviewDescription: { type: String, trim: true, default: "" },
    outcomesTitle: { type: String, trim: true, default: "" },
    outcomes: { type: [ServiceInfoItemSchema], default: [] },
    deliverablesTitle: { type: String, trim: true, default: "" },
    deliverables: { type: [String], default: [] },
    processTitle: { type: String, trim: true, default: "" },
    processSteps: { type: [ServiceInfoItemSchema], default: [] },
    faqTitle: { type: String, trim: true, default: "" },
    faqDescription: { type: String, trim: true, default: "" },
    faqItems: { type: [ServiceFaqItemSchema], default: [] },
    finalCtaTitle: { type: String, trim: true, default: "" },
    finalCtaDescription: { type: String, trim: true, default: "" },
    seoTitle: { type: String, trim: true, default: "" },
    seoDescription: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const ServiceDirectoryLocaleContentSchema = new Schema<ServiceDirectoryLocaleContent>(
  {
    badge: { type: String, trim: true, default: "" },
    title: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const ServicePageRecordSchema = new Schema(
  {
    id: { type: String, trim: true, required: true },
    order: { type: Number, default: 1 },
    slugs: {
      az: { type: String, trim: true, default: "" },
      en: { type: String, trim: true, default: "" },
      ru: { type: String, trim: true, default: "" },
    } as Record<ServiceLocale, unknown>,
    content: {
      az: { type: ServicePageLocaleContentSchema, default: () => ({}) },
      en: { type: ServicePageLocaleContentSchema, default: () => ({}) },
      ru: { type: ServicePageLocaleContentSchema, default: () => ({}) },
    } as Record<ServiceLocale, unknown>,
  },
  { _id: false }
);

const ServicePagesConfigSchema = new Schema<IServicePagesConfig>(
  {
    singletonKey: { type: String, required: true, unique: true },
    config: {
      directory: {
        az: { type: ServiceDirectoryLocaleContentSchema, default: () => ({}) },
        en: { type: ServiceDirectoryLocaleContentSchema, default: () => ({}) },
        ru: { type: ServiceDirectoryLocaleContentSchema, default: () => ({}) },
      } as Record<ServiceLocale, unknown>,
      services: { type: [ServicePageRecordSchema], default: [] },
    },
  },
  { timestamps: true }
);

export const ServicePagesConfigModel: Model<IServicePagesConfig> =
  mongoose.models.ServicePagesConfig ||
  mongoose.model<IServicePagesConfig>("ServicePagesConfig", ServicePagesConfigSchema);
