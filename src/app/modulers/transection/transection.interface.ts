import { Types } from "mongoose";

export type TransactionType = "deposit" | "withdraw" | "send";
export type TransactionStatus = "pending" | "completed" | "reversed";

export interface ITransaction {
  user: Types.ObjectId;
  wallet: Types.ObjectId;
  type: TransactionType;
  amount: number;
  method?: string;
  description?: string;
  receiver?: Types.ObjectId;
  status: TransactionStatus;
  createdAt?: Date;
  updatedAt?: Date;
  agent: { type: Types.ObjectId, ref: "User" },
}
