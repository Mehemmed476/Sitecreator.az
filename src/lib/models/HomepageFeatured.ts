import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHomepageFeatured extends Document {
  // 3 slot: string olarak portfolio id (ObjectId stringi)
  projectIds: string[];
  updatedAt: Date;
  createdAt: Date;
}

const HomepageFeaturedSchema = new Schema<IHomepageFeatured>(
  {
    projectIds: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const HomepageFeatured: Model<IHomepageFeatured> =
  mongoose.models.HomepageFeatured ||
  mongoose.model<IHomepageFeatured>("HomepageFeatured", HomepageFeaturedSchema);

