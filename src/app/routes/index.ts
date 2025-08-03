import { Router } from "express"
import { UserRoutes } from "../modulers/user/user.route"
import { AuthRoutes } from "../modulers/auth/auth.route"
import { WalletRoutes } from "../modulers/wallet/wallet.route"
import { TransactionRoutes } from "../modulers/transection/transection.route"

export const router = Router()

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path:"/auth",
        route:AuthRoutes
    },
    {
        path:"/wallet",
        route:WalletRoutes
    },
    {
        path:"/transection",
        route:TransactionRoutes
    },
    
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})