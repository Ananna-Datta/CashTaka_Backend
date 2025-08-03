import  express, {  Request, Response }  from 'express';
import cors from "cors"
import { router } from './app/routes';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import { envVars } from './app/config/env';

const app = express()
app.use(express.json())
app.use(cors({
    origin:envVars.FRONTEND_URL,
    credentials:true
}));
app.set("trust proxy",1);
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1",router)

app.get("/", (req:Request,res:Response)=>{
    res.status(200).json({
        success:true,
        message:"Welcome to Digital Wallet system backend"
    })
})
app.use(notFound)
app.use(globalErrorHandler)

export default app;