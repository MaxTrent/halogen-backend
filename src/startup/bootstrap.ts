import express, {Express} from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

const bootstrap = (app: Express)=>{
    console.log('Bootstraping application...');
    app.use(helmet());
    app.use(cors());
    app.use(cookieParser());

    // Add your bootstrap logic here
    console.log('Application bootstrapped successfully');
    return true;
}

export default bootstrap;