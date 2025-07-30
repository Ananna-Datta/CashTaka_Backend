/* eslint-disable no-console */
import {Server} from "http"
import mongoose from "mongoose"
import app from "./app";
import { envVars } from "./app/config/env";

let server:Server;


const startServer = async()=>{
    try{
        await mongoose.connect(envVars.DB_URL)
        console.log("Connected to db");

        server = app.listen(envVars.PORT,()=>{
            console.log(`app is listenning in port 5000`);
        })

    }catch{
        console.log("error");
    }
}
startServer()


// cloud site a ami user ami jate bondho kore ata smoothly off hoi ajonno
process.on("SIGTERM",()=>{
    console.log("Sigterm rejection detection..... server shuttting down");
    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
})
// localhost a ami user ami jate bondho kore ata smoothly off hoi ajonno
process.on("SIGINT",()=>{
    console.log("Sigint rejection detection..... server shuttting down");
    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
})
process.on("unhandledRejection",(err)=>{
    console.log("UNhandle rejection detection..... server shuttting down",err);
    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
})
process.on("uncaughtException",(err)=>{
    console.log("UNhandle Exception detection..... server shuttting down",err);
    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
})