"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../../config/env");
const appError_1 = __importDefault(require("../../errorhelper/appError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const wallet_model_1 = require("../wallet/wallet.model");
const transaction_model_1 = require("../transection/transaction.model");
const mongoose_1 = __importStar(require("mongoose"));
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User already exists");
    }
    if (!password) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Password is required");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const authProvider = {
        provider: "credentials",
        providerId: email,
    };
    const user = yield user_model_1.User.create(Object.assign({ email, password: hashedPassword, auths: [authProvider] }, rest));
    const wallet = yield wallet_model_1.Wallet.create({
        user: user._id,
        amount: 50,
        currency: "BDT",
    });
    user.wallet = wallet._id;
    yield user.save();
    const userWithWallet = yield user_model_1.User.findById(user._id).populate("wallet");
    return userWithWallet;
});
const deposit = (userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const wallet = yield wallet_model_1.Wallet.findOne({ user: userId });
    if (!wallet) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    }
    if (wallet.isBlocked) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Wallet is currently blocked");
    }
    wallet.amount += amount;
    yield wallet.save();
    const transaction = yield transaction_model_1.Transactions.create({
        user: userId,
        wallet: wallet._id,
        amount,
        type: "deposit",
    });
    yield user_model_1.User.findByIdAndUpdate(userId, {
        $push: { transactions: transaction._id },
    });
    return wallet;
});
const withdraw = (userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const wallet = yield wallet_model_1.Wallet.findOne({ user: userId });
    if (!wallet) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    }
    if (wallet.isBlocked) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Wallet is currently blocked");
    }
    if (wallet.amount < amount) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance");
    }
    wallet.amount -= amount;
    yield wallet.save();
    const transaction = yield transaction_model_1.Transactions.create({
        user: userId,
        wallet: wallet._id,
        amount,
        type: "withdraw",
    });
    yield user_model_1.User.findByIdAndUpdate(userId, {
        $push: { transactions: transaction._id },
    });
    return wallet;
});
const transfer = (_a) => __awaiter(void 0, [_a], void 0, function* ({ fromUserId, toUserId, amount, method, description, }) {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // ✅ STEP 1: Check if toUserId is an email or ObjectId
        let receiverUser;
        if (mongoose_1.default.Types.ObjectId.isValid(toUserId)) {
            receiverUser = yield user_model_1.User.findById(toUserId);
        }
        else {
            receiverUser = yield user_model_1.User.findOne({ email: toUserId });
        }
        if (!receiverUser) {
            throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Receiver not found");
        }
        // ✅ STEP 2: Find wallets
        const senderWallet = yield wallet_model_1.Wallet.findOne({ user: fromUserId }).session(session);
        const receiverWallet = yield wallet_model_1.Wallet.findOne({ user: receiverUser._id }).session(session);
        if (!senderWallet || !receiverWallet) {
            throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
        }
        if (senderWallet.isBlocked) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Sender's wallet is blocked");
        }
        if (receiverWallet.isBlocked) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Receiver's wallet is blocked");
        }
        if (senderWallet.amount < amount) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance");
        }
        // ✅ STEP 3: Update balances
        senderWallet.amount -= amount;
        receiverWallet.amount += amount;
        yield senderWallet.save({ session });
        yield receiverWallet.save({ session });
        // ✅ STEP 4: Record transaction
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const transaction = yield transaction_model_1.Transactions.create([
            {
                user: fromUserId,
                wallet: senderWallet._id,
                receiver: receiverUser._id,
                amount,
                type: "send",
                method: method || "wallet transfer",
                description,
                status: "completed",
            },
        ], { session });
        yield session.commitTransaction();
        session.endSession();
        return {
            message: "Transfer successful",
            senderBalance: senderWallet.amount,
            receiverBalance: receiverWallet.amount,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find({}).populate("wallet");
    const totalUsers = yield user_model_1.User.countDocuments();
    return {
        data: users,
        meta: { total: totalUsers },
    };
});
const getTransactionHistory = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userObjectId = new mongoose_1.Types.ObjectId(userId);
    const transactions = yield transaction_model_1.Transactions.find({
        $or: [{ user: userObjectId }, { receiver: userObjectId }],
    })
        .populate("user", "name email")
        .populate("receiver", "name email")
        .populate("wallet", "-__v -createdAt -updatedAt")
        .sort({ createdAt: -1 });
    return transactions;
});
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId)
        .select("-password")
        .populate("wallet") // Wallet populate
        .populate({
        path: "transactions", // transactions populate from User schema
        populate: {
            path: "receiver",
            select: "name email",
        },
    });
    return user;
});
const approveAgent = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user || user.role !== "AGENT") {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is not an agent");
    }
    user.status = "approved";
    yield user.save();
    return user;
});
const suspendAgent = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user || user.role !== "AGENT") {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is not an agent");
    }
    user.status = "suspended";
    yield user.save();
    return user;
});
const handleDeposit = (email, amount, agentId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user)
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    if (user.role === "AGENT" && user.status !== "approved") {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Only approved agents can deposit money");
    }
    const wallet = yield wallet_model_1.Wallet.findOne({ user: user._id });
    if (!wallet)
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    if (wallet.isBlocked)
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Wallet is blocked");
    wallet.amount += amount;
    yield wallet.save();
    console.log("Agent ID:", agentId);
    yield transaction_model_1.Transactions.create({
        user: user._id,
        wallet: wallet._id,
        amount,
        type: "deposit",
        method: "agent deposit",
        description: "Cash-in by agent",
        agent: new mongoose_1.Types.ObjectId(agentId),
    });
    return wallet;
});
const handlewithdraw = (email, amount, agentId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user)
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    const wallet = yield wallet_model_1.Wallet.findOne({ user: user._id });
    if (!wallet)
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    if (wallet.isBlocked)
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Wallet is currently blocked");
    if (wallet.amount < amount) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance");
    }
    wallet.amount -= amount;
    yield wallet.save();
    console.log("Agent ID:", agentId);
    yield transaction_model_1.Transactions.create({
        user: user._id,
        wallet: wallet._id,
        amount,
        type: "withdraw",
        method: "agent withdraw",
        description: "Cash-out by agent",
        agent: new mongoose_1.Types.ObjectId(agentId),
    });
    return wallet;
});
const getAgentTransactions = (agentId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!agentId) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Agent ID is required");
    }
    const transactions = yield transaction_model_1.Transactions.find({ agent: new mongoose_1.Types.ObjectId(agentId) })
        .populate("user", "name email")
        .populate("wallet", "-__v -createdAt -updatedAt")
        .sort({ createdAt: -1 });
    return transactions;
});
const updateProfile = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, phone } = payload;
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (name)
        user.name = name;
    if (phone)
        user.phone = phone;
    yield user.save();
    return user;
});
const updatePassword = (userId, currentPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const isMatch = yield bcryptjs_1.default.compare(currentPassword, user.password);
    if (!isMatch) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Current password is incorrect");
    }
    const hashed = yield bcryptjs_1.default.hash(newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    user.password = hashed;
    yield user.save();
    return { message: "Password updated successfully" };
});
const blockUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user)
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    if (user.role === "AGENT")
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Cannot block an agent here");
    user.IsActive = user_interface_1.IsActive.BLOCKED;
    yield user.save();
    return user;
});
const unblockUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user)
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    if (user.role === "AGENT")
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Cannot unblock an agent here");
    user.IsActive = user_interface_1.IsActive.ACTIVE;
    yield user.save();
    return user;
});
exports.UserServices = {
    createUser,
    getAllUsers,
    deposit,
    withdraw,
    transfer,
    getTransactionHistory,
    getMe,
    handleDeposit,
    handlewithdraw,
    approveAgent,
    suspendAgent,
    getAgentTransactions,
    updateProfile,
    updatePassword,
    blockUser,
    unblockUser
};
