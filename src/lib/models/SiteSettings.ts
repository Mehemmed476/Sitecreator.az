import mongoose, { Document, Model, Schema } from "mongoose";
import { defaultSiteSettings } from "@/lib/site-settings";

export interface ISiteSettings extends Document {
  singletonKey: "main";
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  businessHours: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    singletonKey: {
      type: String,
      default: "main",
      enum: ["main"],
      unique: true,
    },
    email: { type: String, default: defaultSiteSettings.email, required: true },
    phone: { type: String, default: defaultSiteSettings.phone, required: true },
    whatsapp: {
      type: String,
      default: defaultSiteSettings.whatsapp,
      required: true,
    },
    instagram: {
      type: String,
      default: defaultSiteSettings.instagram,
      required: true,
    },
    businessHours: {
      type: String,
      default: defaultSiteSettings.businessHours,
      required: true,
    },
    address: {
      type: String,
      default: defaultSiteSettings.address,
      required: true,
    },
  },
  { timestamps: true }
);

export const SiteSettingsModel: Model<ISiteSettings> =
  mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
