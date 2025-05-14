import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";

export default function bootstrap(app: Express) {
  app.use(helmet());
  app.use(cors());
  app.use(cookieParser());
  app.use(compression());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.static("public"));
  app.use(mongoSanitize());
  app.options("*", cors());
};

