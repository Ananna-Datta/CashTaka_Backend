import httpStatus from "http-status-codes";
import { envVars } from "../../config/env";
import AppError from "../../errorhelper/appError";
import { IAuthProvider, IUser, UserStatus } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import { Wallet } from "../wallet/wallet.model";
import { Transactions } from "../transection/transaction.model";
import mongoose, { Types } from "mongoose";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
  }

  if (!password) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password is required");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });

  const wallet = await Wallet.create({
    user: user._id,
    amount: 50,
    currency: "BDT",
  });

  user.wallet = wallet._id;
  await user.save();

  const userWithWallet = await User.findById(user._id).populate("wallet");

  return userWithWallet;
};

const deposit = async (userId: string, amount: number) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }
  if (wallet.isBlocked) {
    throw new AppError(httpStatus.FORBIDDEN, "Wallet is currently blocked");
  }
  wallet.amount += amount;
  await wallet.save();

  const transaction = await Transactions.create({
    user: userId,
    wallet: wallet._id,
    amount,
    type: "deposit",
  });

  await User.findByIdAndUpdate(userId, {
    $push: { transactions: transaction._id },
  });

  return wallet;
};

const withdraw = async (userId: string, amount: number) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }
  if (wallet.isBlocked) {
    throw new AppError(httpStatus.FORBIDDEN, "Wallet is currently blocked");
  }

  if (wallet.amount < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
  }

  wallet.amount -= amount;
  await wallet.save();

  const transaction = await Transactions.create({
    user: userId,
    wallet: wallet._id,
    amount,
    type: "withdraw",
  });

  await User.findByIdAndUpdate(userId, {
    $push: { transactions: transaction._id },
  });

  return wallet;
};


const transfer = async ({
  fromUserId,
  toUserId,
  amount,
  method,
  description,
}: {
  fromUserId: string;
  toUserId: string;
  amount: number;
  method?: string;
  description?: string;
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const senderWallet = await Wallet.findOne({ user: fromUserId }).session(session);
    const receiverWallet = await Wallet.findOne({ user: toUserId }).session(session);

    if (!senderWallet || !receiverWallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }

    if (senderWallet.isBlocked) {
      throw new AppError(httpStatus.FORBIDDEN, "Sender's wallet is blocked");
    }

    if (receiverWallet.isBlocked) {
      throw new AppError(httpStatus.FORBIDDEN, "Receiver's wallet is blocked");
    }

    if (senderWallet.amount < amount) {
      throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
    }

    senderWallet.amount -= amount;
    receiverWallet.amount += amount;

    await senderWallet.save({ session });
    await receiverWallet.save({ session });

    const transaction = await Transactions.create(
      [
        {
          user: fromUserId,
          wallet: senderWallet._id,
          receiver: toUserId,
          amount,
          type: "send",
          method: method || "wallet transfer",
          description,
          status: "completed", 
        },
      ],
      { session }
    );

    await User.findByIdAndUpdate(
      fromUserId,
      { $push: { transactions: transaction[0]._id } },
      { session }
    );
    await User.findByIdAndUpdate(
      toUserId,
      { $push: { transactions: transaction[0]._id } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      message: "Transfer successful",
      senderBalance: senderWallet.amount,
      receiverBalance: receiverWallet.amount,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};


const getAllUsers = async () => {
  const users = await User.find({}).populate("wallet");
  const totalUsers = await User.countDocuments();
  return {
    data: users,
    meta: { total: totalUsers },
  };
};

const getTransactionHistory = async (userId: string) => {
  const userObjectId = new Types.ObjectId(userId);

  const transactions = await Transactions.find({
    $or: [{ user: userObjectId }, { receiver: userObjectId }],
  })
    .populate("user", "name email")
    .populate("receiver", "name email")
    .populate("wallet", "-__v -createdAt -updatedAt")
    .sort({ createdAt: -1 });

  return transactions;
};

const getMe = async (userId: string): Promise<IUser | null> => {
  const user = await User.findById(userId)
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
};

const approveAgent = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user || user.role !== "AGENT") {
    throw new AppError(httpStatus.BAD_REQUEST, "User is not an agent");
  }

  user.status = "approved";
  await user.save();
  return user;
};

const suspendAgent = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user || user.role !== "AGENT") {
    throw new AppError(httpStatus.BAD_REQUEST, "User is not an agent");
  }

  user.status = "suspended";
  await user.save();
  return user;
};

const handleDeposit = async (userId: string, amount: number) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.role === "AGENT" && user.status !== ("approved" as UserStatus)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only approved agents can deposit money"
    );
  }

  //   if (!user.status || user.status !== "approved") {
  //   throw new AppError(httpStatus.FORBIDDEN, "Only approved users can deposit money");
  // }

  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  if (wallet.isBlocked) {
    throw new AppError(httpStatus.FORBIDDEN, "Wallet is currently blocked");
  }

  wallet.amount += amount;
  await wallet.save();

  return wallet;
};

const handlewithdraw = async (userId: string, amount: number) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.role === "AGENT" && user.status !== ("approved" as UserStatus)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only approved agents can deposit money"
    );
  }

  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }
  if (wallet.isBlocked) {
    throw new AppError(httpStatus.FORBIDDEN, "Wallet is currently blocked");
  }

  if (wallet.amount < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
  }

  wallet.amount -= amount;
  await wallet.save();

  const transaction = await Transactions.create({
    user: userId,
    wallet: wallet._id,
    amount,
    type: "withdraw",
    method: "agent withdraw",
    description: "Cash-out by agent",
  });

  await User.findByIdAndUpdate(userId, {
    $push: { transactions: transaction._id },
  });

  return wallet;
};

export const UserServices = {
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
};
