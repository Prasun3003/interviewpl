import dotenv from "dotenv";
dotenv.config();

export const ENV = {
    PORT: process.env.PORT || 3000,
    DB_URL: process.env.DB_URL || "mongodb://localhost:27017/test",
}