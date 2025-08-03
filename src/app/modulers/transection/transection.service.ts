import { Transactions } from "./transaction.model";

interface GetTransactionsOptions {
  page?: number;
  limit?: number;
  sortBy?: string;       // e.g. "createdAt"
  sortOrder?: "asc" | "desc";  // ascending or descending
}

const getAllTransactions = async ({
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  sortOrder = "desc",
}: GetTransactionsOptions = {}) => {
  const skip = (page - 1) * limit;

  const transactions = await Transactions.find()
    .populate("user", "name email")
    .populate("wallet", "amount currency")
    .populate("receiver", "name email")
    .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(limit);

  const total = await Transactions.countDocuments();

  return {
    total,
    page,
    limit,
    transactions,
  };
};

export default getAllTransactions;
