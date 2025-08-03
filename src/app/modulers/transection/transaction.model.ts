import { Schema, model } from "mongoose";
import { ITransaction } from "./transection.interface";
// import { ITransactionHistory } from "./transection.interface";
// import { ITransactionHistory } from "./transactionHistory.interface";

const transactionHistorySchema = new Schema<ITransaction>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    wallet: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    type: {
      type: String,
      enum: ["deposit", "withdraw", "send"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount must be positive"],
    },
    status: {
      type: String,
      enum: ["pending", "completed", "reversed"],
      default: "completed",
    },
    method: {
      type: String,
    },
    description: {
      type: String,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User", // Only for 'send' type
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
    versionKey: false,
  }
);

export const Transactions = model<ITransaction>(
  "Transactions",
  transactionHistorySchema
);
