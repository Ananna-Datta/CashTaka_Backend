"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transactions = void 0;
const mongoose_1 = require("mongoose");
// import { ITransactionHistory } from "./transection.interface";
// import { ITransactionHistory } from "./transactionHistory.interface";
const transactionHistorySchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    wallet: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User", // Only for 'send' type
    },
}, {
    timestamps: true, // adds createdAt and updatedAt
    versionKey: false,
});
exports.Transactions = (0, mongoose_1.model)("Transactions", transactionHistorySchema);
