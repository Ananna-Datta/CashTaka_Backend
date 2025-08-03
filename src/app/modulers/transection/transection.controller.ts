import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import getAllTransactions from "./transection.service";

const getTransactionsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder = (req.query.sortOrder as string) === "asc" ? "asc" : "desc";

    const result = await getAllTransactions({ page, limit, sortBy, sortOrder });

    res.status(httpStatus.OK).json({
      success: true,
      message: "Transactions retrieved successfully",
      data: result.transactions,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export { getTransactionsController };
