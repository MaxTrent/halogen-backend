import e, { Router } from "express";

const UserRouter = Router();

UserRouter.use("/", UserController);

export default UserRouter;