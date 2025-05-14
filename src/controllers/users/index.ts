import e, { Router } from "express";

const UserRouter = Router();

UserRouter.use("/", UserContr);

export default UserRouter;