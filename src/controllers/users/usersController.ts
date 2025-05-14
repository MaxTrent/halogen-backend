import { Router } from "express";

class UserController{
    router:Router;
    constructor(){
        this.router = Router();
        this.init();
    }

    public async initiateSignUp(req: Request, res: Response, next: Function){
        try{
            const {fullname, email} = req.body;

        }catch(e){

        }
    }

    init(){

    }
}

export default new UserController().router;