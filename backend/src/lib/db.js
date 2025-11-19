import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    if(!ENV.DB_URL){
      throw new Error("DB_URL is not set");
    }
    const conn = await mongoose.connect(ENV.DB_URL);
    console.log("Connected to MongoDB:",conn.connection.host);
  } catch (error) {
    console.log(error);
  }
};