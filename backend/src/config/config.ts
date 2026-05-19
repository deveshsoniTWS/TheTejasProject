import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: process.env.PORT || 8000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || "supersecretkey",
  NODE_ENV: process.env.NODE_ENV || "development",
  SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS || 10,
};
