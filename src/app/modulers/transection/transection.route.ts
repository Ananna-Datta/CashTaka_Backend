import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth"; 
import { Role } from "../user/user.interface"; 
import { getTransactionsController } from "./transection.controller";

const router = Router();

router.get("/",checkAuth(Role.ADMIN),getTransactionsController);

export const TransactionRoutes = router;
