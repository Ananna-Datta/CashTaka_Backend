import  express, { Request, Response }  from 'express';


const app = express()

app.get("/", (req:Request,res:Response)=>{
    res.status(200).json({
        success:true,
        massage:"Welcome to Tour management system backend"
    })
})

export default app;