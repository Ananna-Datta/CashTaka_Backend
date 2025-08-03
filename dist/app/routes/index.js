"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modulers/user/user.route");
const auth_route_1 = require("../modulers/auth/auth.route");
const wallet_route_1 = require("../modulers/wallet/wallet.route");
const transection_route_1 = require("../modulers/transection/transection.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.UserRoutes
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes
    },
    {
        path: "/wallet",
        route: wallet_route_1.WalletRoutes
    },
    {
        path: "/transection",
        route: transection_route_1.TransactionRoutes
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
