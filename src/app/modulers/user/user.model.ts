import { model, Schema } from "mongoose";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    versionKey: false,
    _id: false,
  }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    phone: { type: String },

    IsActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },

    wallet: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
    },

    transactions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Transactions",
      },
    ],
    status: {
      type: String,
      enum: ["approved", "pending", "suspended"],
      default: "pending",
      required: true,
    },

    auths: [authProviderSchema],
    IsVarified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<IUser>("User", userSchema);
