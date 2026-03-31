import mongoose, { Schema, type Document, type Model } from "mongoose";
import type {
  SocialProofContent,
  SocialProofFaqItem,
  SocialProofLocale,
  SocialProofTestimonial,
} from "@/lib/social-proof-content";

interface ISocialProofContent extends Document {
  singletonKey: string;
  content: SocialProofContent;
  createdAt: Date;
  updatedAt: Date;
}

const SocialProofTestimonialSchema = new Schema<SocialProofTestimonial>(
  {
    quote: { type: String, trim: true, default: "" },
    author: { type: String, trim: true, default: "" },
    role: { type: String, trim: true, default: "" },
    company: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const SocialProofFaqItemSchema = new Schema<SocialProofFaqItem>(
  {
    question: { type: String, trim: true, default: "" },
    answer: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const SocialProofLocaleContentSchema = new Schema(
  {
    testimonialsEyebrow: { type: String, trim: true, default: "" },
    testimonialsTitle: { type: String, trim: true, default: "" },
    testimonialsDescription: { type: String, trim: true, default: "" },
    testimonials: { type: [SocialProofTestimonialSchema], default: [] },
    faqEyebrow: { type: String, trim: true, default: "" },
    faqTitle: { type: String, trim: true, default: "" },
    faqDescription: { type: String, trim: true, default: "" },
    faqItems: { type: [SocialProofFaqItemSchema], default: [] },
  },
  { _id: false }
);

const SocialProofContentSchema = new Schema<ISocialProofContent>(
  {
    singletonKey: { type: String, required: true, unique: true },
    content: {
      az: { type: SocialProofLocaleContentSchema, default: () => ({}) },
      en: { type: SocialProofLocaleContentSchema, default: () => ({}) },
      ru: { type: SocialProofLocaleContentSchema, default: () => ({}) },
    } as Record<SocialProofLocale, unknown>,
  },
  { timestamps: true }
);

export const SocialProofContentModel: Model<ISocialProofContent> =
  mongoose.models.SocialProofContent ||
  mongoose.model<ISocialProofContent>("SocialProofContent", SocialProofContentSchema);
