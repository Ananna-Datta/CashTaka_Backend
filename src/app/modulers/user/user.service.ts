import httpStatus from 'http-status-codes';
import { envVars } from "../../config/env";
import AppError from "../../errorhelper/appError";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import bcrypt from 'bcryptjs';

const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
    }

    if (!password) {
        throw new AppError(httpStatus.BAD_REQUEST, "Password is required");
    }

    const hashedPassword = await bcrypt.hash(password, Number(envVars.BCRYPT_SALT_ROUND));

    const user = await User.create({
        email,
        password: hashedPassword,
        ...rest
    });

    return user;
};

const getAllUsers = async () => {
    const users = await User.find({});
    const totalUsers = await User.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUsers
        }
    };
};

export const UserServices = {
    createUser,
    getAllUsers
};
