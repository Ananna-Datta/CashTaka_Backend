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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const appError_1 = __importDefault(require("../../errorhelper/appError"));
const wallet_model_1 = require("./wallet.model");
const blockWallet = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOneAndUpdate({ user: userId }, { isBlocked: true }, { new: true });
    if (!wallet) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    }
    return wallet;
});
const unblockWallet = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOneAndUpdate({ user: userId }, { isBlocked: false }, { new: true });
    if (!wallet) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    }
    return wallet;
});
exports.WalletService = {
    blockWallet,
    unblockWallet,
};
