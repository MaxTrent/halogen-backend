import { Router } from "express";

const AuthRouter = Router();

AuthRouter.use("/", AuthRouter);


export default AuthRouter;