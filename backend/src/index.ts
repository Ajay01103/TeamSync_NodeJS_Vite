import "dotenv/config"
import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import session from "cookie-session"
import { config } from "./config/app.config"

import passport from "passport"
import "./config/passport.config"

import ConnectDatabase from "./config/database.config"
import { errorHandler } from "./middlewares/error-handler.middleware"
import { asyncHandler } from "./middlewares/async-handler.middleware"
import { HTTPSTATUS } from "./config/http.config"
import { BadRequestException } from "./utils/appError"
import { ErrorCodeEnum } from "./enums/error-code.enum"
import authRoutes from "./routes/auth.route"

const app = express()
const BASE_PATH = config.BASE_PATH

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
  session({
    name: "aj_session",
    keys: [config.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.use(cors({ origin: config.FRONTEND_ORIGIN, credentials: true }))

app.get(
  `/`,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // throw new BadRequestException(
    //   "This is a bad request",
    //   ErrorCodeEnum.AUTH_INVALID_TOKEN
    // )
    // protection from unauthorized access (auth related)

    return res.status(HTTPSTATUS.OK).json({ message: "Hello world" })
  })
)

app.use(`${BASE_PATH}/auth`, authRoutes)

// Error handling
app.use(errorHandler)

app.listen(config.PORT, async () => {
  console.log(`Server is running on port ${config.PORT} in ${config.NODE_ENV}`)
  await ConnectDatabase()
})
