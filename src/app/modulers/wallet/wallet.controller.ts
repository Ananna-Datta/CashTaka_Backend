import { Request, Response } from "express";
import { WalletService } from "./wallet.servics";

export const WalletController = {
  blockWallet: async (req: Request, res: Response) => {
    const { userId } = req.params;
    const wallet = await WalletService.blockWallet(userId);
    res.status(200).json({
      success: true,
      message: "Wallet blocked successfully",
      data: wallet,
    });
  },

  unblockWallet: async (req: Request, res: Response) => {
    const { userId } = req.params;
    const wallet = await WalletService.unblockWallet(userId);
    res.status(200).json({
      success: true,
      message: "Wallet unblocked successfully",
      data: wallet,
    });
  },
};
