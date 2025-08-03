/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status-codes';
import { UserServices } from "./user.service";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errorhelper/appError';
import { Transactions } from '../transection/transaction.model';
import { JwtPayload } from 'jsonwebtoken';
import { sendResponse } from '../../utils/sendResponse';
import { User } from './user.model';
import { Wallet } from '../wallet/wallet.model';

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserServices.createUser(req.body);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: "User created successfully",
    data: user,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await UserServices.getAllUsers();
  res.status(httpStatus.OK).json({
    success: true,
    message: "All users retrieved successfully",
    data: result,
  });
});

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;

    const result = await UserServices.getMe(decodedToken.userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Your profile retrieved successfully',
      data: result,
    });
  }
);

const deposit = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }
  
  const result = await UserServices.deposit(userId, req.body.amount);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Deposit successful",
    data: result,
    // data: null,
  });
});


const withdraw = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }
  
  const result = await UserServices.withdraw(userId, req.body.amount);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Money withdrawn successfully",
    data: result,
  });
});

const transfer = catchAsync(async (req: Request, res: Response) => {
  const fromUserId = req.user?.userId;
  const { toUserId, amount, method, description } = req.body;

  if (!fromUserId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  const result = await UserServices.transfer({
    fromUserId,
    toUserId,
    amount,
    method,
    description,
  });

  res.status(httpStatus.OK).json({
    success: true,
    message: "Money transferred successfully",
    data: result,
  });
});

const getTransactionHistory = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  const transactions = await UserServices.getTransactionHistory(userId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Transaction history retrieved successfully",
    data: transactions,
  });
});

const approveAgent = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await UserServices.approveAgent(userId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Agent approved successfully",
    data: result,
  });
};

const suspendAgent = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await UserServices.suspendAgent(userId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Agent suspended successfully",
    data: result,
  });
};

const agentDeposit = catchAsync(async (req: Request, res: Response) => {
  const { userId, amount } = req.body;
  if (!userId || !amount) throw new AppError(httpStatus.BAD_REQUEST, "User ID and amount required");

  const wallet = await UserServices.handleDeposit(userId, amount);

  res.status(httpStatus.OK).json({
    success: true,
    message: `Added ${amount} to user ${userId}'s wallet successfully.`,
    data: wallet,
  });
});

const agentWithdraw = catchAsync(async (req: Request, res: Response) => {
  const { userId, amount } = req.body;
  if (!userId || !amount) throw new AppError(httpStatus.BAD_REQUEST, "User ID and amount required");

  const wallet = await UserServices.handlewithdraw(userId, amount);

  res.status(httpStatus.OK).json({
    success: true,
    message: `Withdrew ${amount} from user ${userId}'s wallet successfully.`,
    data: wallet,
  });
});


export const UserControllers = {
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
