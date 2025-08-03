// import  checkAuth  from './../../middlewares/checkAuth';
// import  checkAuth  from './../../middlewares/checkAuth';
import { Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { userValidationSchema } from "./user.validation";
import { Role } from './user.interface';
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router()

router.post("/register", validateRequest(userValidationSchema), UserControllers.createUser)
router.post("/deposit",checkAuth(Role.USER), UserControllers.deposit)
router.post("/withdraw",checkAuth(Role.USER), UserControllers.withdraw)
router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe)
router.post("/sent",checkAuth(Role.USER), UserControllers.transfer)
router.get("/transactions", checkAuth("USER",), UserControllers.getTransactionHistory);
router.post("/agentDeposit", checkAuth("AGENT"), UserControllers.agentDeposit);
router.post("/agentWithdraw", checkAuth("AGENT",), UserControllers.agentWithdraw);
router.get("/",checkAuth(Role.ADMIN), UserControllers.getAllUsers)
router.patch("/approve-agent/:userId", checkAuth(Role.ADMIN), UserControllers.approveAgent);
router.patch("/suspend-agent/:userId", checkAuth(Role.ADMIN), UserControllers.suspendAgent);


export const UserRoutes = router