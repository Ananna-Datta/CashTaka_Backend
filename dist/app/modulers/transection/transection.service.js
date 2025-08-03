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
const transaction_model_1 = require("./transaction.model");
const getAllTransactions = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* ({ page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc", } = {}) {
    const skip = (page - 1) * limit;
    const transactions = yield transaction_model_1.Transactions.find()
        .populate("user", "name email")
        .populate("wallet", "amount currency")
        .populate("receiver", "name email")
        .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(limit);
    const total = yield transaction_model_1.Transactions.countDocuments();
    return {
        total,
        page,
        limit,
        transactions,
    };
});
exports.default = getAllTransactions;
