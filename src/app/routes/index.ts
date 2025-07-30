import { Router } from "express"
import { UserRoutes } from "../modulers/user/user.route"

export const router = Router()

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})