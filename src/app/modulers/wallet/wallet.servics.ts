import httpStatus from 'http-status-codes';
import AppError from "../../errorhelper/appError";
import { Wallet } from "./wallet.model";

const blockWallet = async (userId: string) => {
  const wallet = await Wallet.findOneAndUpdate(
    { user: userId },
    { isBlocked: true },
    { new: true }
  );
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }
  return wallet;
};

const unblockWallet = async (userId: string) => {
  const wallet = await Wallet.findOneAndUpdate(
    { user: userId },
    { isBlocked: false },
    { new: true }
  );
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }
  return wallet;
};

export const WalletService = {
  blockWallet,
  unblockWallet,
};
