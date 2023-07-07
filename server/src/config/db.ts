import { configDotenv } from "dotenv";
import mongoose from "mongoose";

configDotenv();

export const connectMongoDB = async () => {
  try {
    const db = await mongoose.connect(
      (process.env.MONGODB_URI as string) ||
        "mongodb://localhost:27017/maadhyam-blogging-app"
    )
    console.log("MongoDB connected");
    return db;
  } catch (error) {
    console.log(error);
  }
};
