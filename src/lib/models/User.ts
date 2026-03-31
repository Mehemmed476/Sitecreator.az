import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { userRoles, type UserRole } from "@/lib/auth-roles";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  company?: string;
  phone?: string;
  leadIds: Types.ObjectId[];
  portalEnabled: boolean;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: userRoles, required: true, default: "client" },
    company: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    leadIds: [{ type: Schema.Types.ObjectId, ref: "Contact" }],
    portalEnabled: { type: Boolean, default: true },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
