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
router.get("/",checkAuth(Role.ADMIN), UserControllers.getAllUsers)

export const UserRoutes = router