import { Types } from "mongoose";
import { IWallet } from "../wallet/wallet.interface";

export enum Role{
    ADMIN = "ADMIN",
    USER = "USER",
    AGENT = "AGENT"
}


export enum IsActive{
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export interface IAuthProvider {
    provider: "google" | "credentials";
    providerId: string;
}

export type UserStatus = "approved" | "suspended" | "pending";

export interface IUser{
    _id?: Types.ObjectId
    name:string,
    email:string,
    phone?:string,
    password:string,
    role:Role,
    IsActive?:IsActive,
    IsVarified?:boolean,
    status?: UserStatus;
    auths: IAuthProvider[],
    wallet?: Types.ObjectId | IWallet,
    transactions?: Types.ObjectId[],
}

