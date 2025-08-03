import { Types } from "mongoose";

export interface IWallet {
  user: Types.ObjectId;         // Reference to User
  amount: number;               // Current balance
  currency?: string;            // Optional: Default to BDT
  isBlocked?: boolean;          // Optional: Default to false
}