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
const getAllTransactions = (_a) => __awaiter(void 0, [_a], void 0, function* ({ page = 1, limit = 10, type, status, minAmount, maxAmount, search, startDate, endDate, sortBy = "createdAt", sortOrder = "desc", }) {
    const skip = (page - 1) * limit;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query = {};
    if (type)
        query.type = type;
    if (status)
        query.status = status;
    if (minAmount !== undefined)
        query.amount = Object.assign(Object.assign({}, query.amount), { $gte: minAmount });
    if (maxAmount !== undefined)
        query.amount = Object.assign(Object.assign({}, query.amount), { $lte: maxAmount });
    if (startDate)
        query.createdAt = Object.assign(Object.assign({}, query.createdAt), { $gte: new Date(startDate) });
    if (endDate)
        query.createdAt = Object.assign(Object.assign({}, query.createdAt), { $lte: new Date(endDate) });
    if (search)
        query["user.name"] = { $regex: search, $options: "i" }; // search by user name
    const transactions = yield transaction_model_1.Transactions.find(query)
        .populate("user", "name email")
        .populate("wallet", "amount currency")
        .populate("receiver", "name email")
        .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(limit);
    const total = yield transaction_model_1.Transactions.countDocuments(query);
    return {
        total,
        page,
        limit,
        transactions,
    };
});
exports.default = getAllTransactions;
