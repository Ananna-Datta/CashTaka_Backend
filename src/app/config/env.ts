/* eslint-disable @typescript-eslint/no-non-null-assertion */
import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: string;
  BCRYPT_SALT_ROUND: number;
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES: string;
  EXPRESS_SESSION_SECRET: string;
  JWT_REFRESH_EXPIRES: string;
  JWT_REFRESH_SECRET: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables: string[] = [
    "PORT",
    "DB_URL",
    "NODE_ENV",
    "BCRYPT_SALT_ROUND",
    "JWT_ACCESS_SECRET",
    "JWT_ACCESS_EXPIRES",
    "EXPRESS_SESSION_SECRET",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRES"
  ];
  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`MIssing require environment variable ${key}`);
    }
  });
  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL!,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    BCRYPT_SALT_ROUND: Number(process.env.BCRYPT_SALT_ROUND!),
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES!,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET!,
    JWT_REFRESH_EXPIRES:process.env.JWT_REFRESH_EXPIRES!,
    JWT_REFRESH_SECRET:process.env.JWT_REFRESH_SECRET!
  };
};

export const envVars: EnvConfig = loadEnvVariables();
