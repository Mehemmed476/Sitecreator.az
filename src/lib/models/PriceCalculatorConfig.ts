import mongoose, { Document, Model, Schema } from "mongoose";
import { defaultPriceCalculatorConfig, type PriceCalculatorConfig } from "@/lib/price-calculator";

export interface IPriceCalculatorConfig extends Document {
  singletonKey: "main";
  config: PriceCalculatorConfig;
  createdAt: Date;
  updatedAt: Date;
}

const PriceCalculatorConfigSchema = new Schema<IPriceCalculatorConfig>(
  {
    singletonKey: {
      type: String,
      default: "main",
      enum: ["main"],
      unique: true,
    },
    config: {
      type: Schema.Types.Mixed,
      required: true,
      default: defaultPriceCalculatorConfig,
    },
  },
  { timestamps: true }
);

export const PriceCalculatorConfigModel: Model<IPriceCalculatorConfig> =
  mongoose.models.PriceCalculatorConfig ||
  mongoose.model<IPriceCalculatorConfig>(
    "PriceCalculatorConfig",
    PriceCalculatorConfigSchema
  );

