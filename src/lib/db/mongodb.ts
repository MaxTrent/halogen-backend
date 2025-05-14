import mongoose from "mongoose";
import dotenv from "dotenv";
import { config } from "../../config";
dotenv.config();

export const connectToDatabase = async () => {
  console.log("connecting to mongodb");
  let connection;
  try {
    connection = await mongoose.connect(config.dbUrl);
    console.log("connected successfully to db");
    return connection;
  } catch (err) {
    if (err instanceof Error) {
      console.log("Error connecting to mongo", err.message);
    } else {
      console.log("Unknown error", err);
    }
  }
};
