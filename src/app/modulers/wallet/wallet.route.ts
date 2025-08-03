import express from "express";
import { WalletController } from "./wallet.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = express.Router();

router.patch("/block/:userId",checkAuth(Role.ADMIN), WalletController.blockWallet);
router.patch("/unblock/:userId",checkAuth(Role.ADMIN), WalletController.unblockWallet);

export const WalletRoutes = router;
