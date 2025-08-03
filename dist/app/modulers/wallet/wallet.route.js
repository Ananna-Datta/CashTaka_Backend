"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRoutes = void 0;
const express_1 = __importDefault(require("express"));
const wallet_controller_1 = require("./wallet.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const router = express_1.default.Router();
router.patch("/block/:userId", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), wallet_controller_1.WalletController.blockWallet);
router.patch("/unblock/:userId", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), wallet_controller_1.WalletController.unblockWallet);
exports.WalletRoutes = router;
