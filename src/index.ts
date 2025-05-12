import { createServer, Server } from "http";
import { connectToDatabase } from "./lib/db/mongodb";
import { config } from "./config";

let httpServer: Server = createServer();


const startServer = ()=> {
    connectToDatabase();
    httpServer.listen(config.port, () => {
        console.log(`Server is running on port ${config.port}`);
    });
}