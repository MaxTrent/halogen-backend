import express from "express";
import { config } from "./config";
import bootstrap from "./startup/bootstrap";

const app = express();

bootstrap(app);


export default app;
