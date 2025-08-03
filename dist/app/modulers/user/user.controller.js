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
exports.UserControllers = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_service_1 = require("./user.service");
const catchAsync_1 = require("../../utils/catchAsync");
const appError_1 = __importDefault(require("../../errorhelper/appError"));
const sendResponse_1 = require("../../utils/sendResponse");
const createUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.UserServices.createUser(req.body);
    res.status(http_status_codes_1.default.CREATED).json({
        success: true,
        message: "User created successfully",
        data: user,
    });
}));
const getAllUsers = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.getAllUsers();
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        message: "All users retrieved successfully",
        data: result,
    });
}));
const getMe = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const result = yield user_service_1.UserServices.getMe(decodedToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Your profile retrieved successfully',
        data: result,
    });
}));
const deposit = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        throw new appError_1.default(http_status_codes_1.default.UNAUTHORIZED, "User not authenticated");
    }
    const result = yield user_service_1.UserServices.deposit(userId, req.body.amount);
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        message: "Deposit successful",
        data: result,
        // data: null,
    });
}));
const withdraw = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        throw new appError_1.default(http_status_codes_1.default.UNAUTHORIZED, "User not authenticated");
    }
    const result = yield user_service_1.UserServices.withdraw(userId, req.body.amount);
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        message: "Money withdrawn successfully",
        data: result,
    });
}));
const transfer = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const fromUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { toUserId, amount, method, description } = req.body;
    if (!fromUserId) {
        throw new appError_1.default(http_status_codes_1.default.UNAUTHORIZED, "User not authenticated");
    }
    const result = yield user_service_1.UserServices.transfer({
        fromUserId,
        toUserId,
        amount,
        method,
        description,
    });
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        message: "Money transferred successfully",
        data: result,
    });
}));
const getTransactionHistory = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        throw new appError_1.default(http_status_codes_1.default.UNAUTHORIZED, "User not authenticated");
    }
    const transactions = yield user_service_1.UserServices.getTransactionHistory(userId);
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        message: "Transaction history retrieved successfully",
        data: transactions,
    });
}));
const approveAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield user_service_1.UserServices.approveAgent(userId);
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        message: "Agent approved successfully",
        data: result,
    });
});
const suspendAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield user_service_1.UserServices.suspendAgent(userId);
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        message: "Agent suspended successfully",
        data: result,
    });
});
const agentDeposit = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, amount } = req.body;
    if (!userId || !amount)
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User ID and amount required");
    const wallet = yield user_service_1.UserServices.handleDeposit(userId, amount);
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        message: `Added ${amount} to user ${userId}'s wallet successfully.`,
        data: wallet,
    });
}));
const agentWithdraw = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, amount } = req.body;
    if (!userId || !amount)
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User ID and amount required");
    const wallet = yield user_service_1.UserServices.handlewithdraw(userId, amount);
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        message: `Withdrew ${amount} from user ${userId}'s wallet successfully.`,
        data: wallet,
    });
}));
exports.UserControllers = {
    createUser,
    getAllUsers,
    deposit,
    withdraw,
    transfer,
    getTransactionHistory,
    getMe,
    agentDeposit,
    agentWithdraw,
    approveAgent,
    suspendAgent
};
