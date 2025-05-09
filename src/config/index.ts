import dotenv from "dotenv";
import vine, {errors} from "@vinejs/vine";
import path, { dirname } from "path";
import { fileURLToPath } from "url";


const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({path: path.join(__dirname, "../.env")});
let envVars:any;

async function getEnvVars() {
try{
    const env = await vine.object({
        PORT: vine.number()
    });

    const validator = vine.compile(env);
    envVars = await validator.validate(process.env);
    return envVars;
}catch(e){
if (e instanceof errors.E_VALIDATION_ERROR){
    throw new Error(`Invalid environment variables: ${JSON.stringify(e.messages)}`);
}
}
    
}
