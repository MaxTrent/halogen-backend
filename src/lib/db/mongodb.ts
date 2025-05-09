import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

import { config } from "";

export const connectToDatabase = async ()=> {
    console.log("connecting to mongodb");
    let connection;
    try{
        connection = await mongoose.connect(pro)
    }
}