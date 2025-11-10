import { Transactions } from "./transaction.model";

export interface GetTransactionsOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  type?: string;     
  status?: string; 
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
}


const getAllTransactions = async ({
  page = 1,
  limit = 10,
  type,
  status,
  minAmount,
  maxAmount,
  search,
  startDate,
  endDate,
  sortBy = "createdAt",
  sortOrder = "desc",
}: GetTransactionsOptions) => {
  const skip = (page - 1) * limit;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = {};

  if (type) query.type = type;
  if (status) query.status = status;
  if (minAmount !== undefined) query.amount = { ...query.amount, $gte: minAmount };
  if (maxAmount !== undefined) query.amount = { ...query.amount, $lte: maxAmount };
  if (startDate) query.createdAt = { ...query.createdAt, $gte: new Date(startDate) };
  if (endDate) query.createdAt = { ...query.createdAt, $lte: new Date(endDate) };
  if (search) query["user.name"] = { $regex: search, $options: "i" }; // search by user name

  const transactions = await Transactions.find(query)
    .populate("user", "name email")
    .populate("wallet", "amount currency")
    .populate("receiver", "name email")
    .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(limit);

  const total = await Transactions.countDocuments(query);

  return {
    total,
    page,
    limit,
    transactions,
  };
};


export default getAllTransactions;
