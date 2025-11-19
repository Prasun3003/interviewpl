import dotenv from "dotenv";
dotenv.config({quiet: true});

export const ENV = {
    PORT: process.env.PORT || 3000,
    DB_URL: process.env.DB_URL || "mongodb://localhost:27017/test",
    NODE_ENV: process.env.NODE_ENV || "development",
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY || "pk_test_1234567890",
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || "sk_test_1234567890",
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY || "pk_test_1234567890",
    INNGEST_EVENT_KEY : process.env.INNGEST_EVENT_KEY,
    INNGEST_SIGNING_KEY : process.env.INNGEST_SIGNING_KEY,
    STREAM_API_KEY : process.env.STREAM_API_KEY,
    STREAM_API_SECRET : process.env.STREAM_API_SECRET

}