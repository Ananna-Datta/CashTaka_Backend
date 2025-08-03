"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
const wallet_servics_1 = require("./wallet.servics");
exports.WalletController = {
    blockWallet: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.params;
        const wallet = yield wallet_servics_1.WalletService.blockWallet(userId);
        res.status(200).json({
            success: true,
            message: "Wallet blocked successfully",
            data: wallet,
        });
    }),
    unblockWallet: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.params;
        const wallet = yield wallet_servics_1.WalletService.unblockWallet(userId);
        res.status(200).json({
            success: true,
            message: "Wallet unblocked successfully",
            data: wallet,
        });
    }),
};
