import { Router } from "express"
import { getCurrentUserController } from "../controllers/user.controller"
import { passportAuthenticateJWT } from "../config/passport.config"

const userRoutes = Router()

userRoutes.get("/current", getCurrentUserController)

export default userRoutes
