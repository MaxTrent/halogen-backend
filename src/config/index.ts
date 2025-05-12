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
        NODE_ENV: vine.enum(["development", "production"]),
        PORT: vine.number(),
        DB_CONNECTION_URL: vine.string(),
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

envVars = getEnvVars();

const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    dbUrl: envVars.DB_CONNECTION_URL,
}

export {config};
