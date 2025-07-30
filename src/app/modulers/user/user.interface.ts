import { Types } from "mongoose";

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

export interface IUser{
    _id?: Types.ObjectId
    name:string,
    email:string,
    phone?:string,
    password:string,
    role:Role,
    IsActive?:IsActive,
    IsVarified?:boolean,
    wallet?: Types.ObjectId[],
    transaction?: Types.ObjectId[],
}