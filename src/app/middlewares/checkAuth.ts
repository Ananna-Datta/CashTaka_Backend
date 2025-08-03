import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { verifyToken } from "../utils/jwt";
import httpStatus from "http-status-codes";
import AppError from "../errorhelper/appError";
import { User } from "../modulers/user/user.model";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(403, "No Token Received");
      }

      const token = accessToken.startsWith("Bearer ")
        ? accessToken.slice(7)
        : accessToken;

      const verifiedToken = verifyToken(
        token,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isUserExist = await User.findOne({ email: verifiedToken.email });

      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
      }
      if (isUserExist.role === "AGENT" && isUserExist.status === "suspended") {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "Suspended agents cannot access this feature"
        );
      
      }

      if (!authRoles.includes(verifiedToken.role?.toUpperCase())) {
        throw new AppError(403, "You are not permitted to view this route!!!");
      }

      req.user = verifiedToken;
      next();
    } catch (error) {
      console.log("jwt error", error);
      next(error);
    }
  };
