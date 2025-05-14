import {Express} from "express";
import router from "../routes/index";

export default function registerRoutes(app: Express) {
 app.get("/", (req, res)=>{
    res.json({
        success: true,
        message: "OK",
        timestamp:  new Date().toISOString(),
        IP: req.ip,
        URL: req.originalUrl,});
 });
 app.use("/api", router);
}