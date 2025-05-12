import mongoose from "mongoose";
import dotenv from "dotenv";
import { config } from "../../config";
dotenv.config();


export const connectToDatabase = async ()=> {
    console.log("connecting to mongodb");
    let connection;
    try{
        connection = await mongoose.connect(config.dbUrl);
        console.log("connected successfully to db");
        return connection;
    }
    catch(err){
        console.log("Error connecting to MongoDB:", err.message);
        // throw new Error("MongoDB connection failed");
    }
};