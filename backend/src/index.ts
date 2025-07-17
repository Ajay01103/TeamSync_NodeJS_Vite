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
import userRoutes from "./routes/user.route"
import isAuthenticated from "./middlewares/isAuthenticated.middleware"
import workspaceRoutes from "./routes/workspace.route"
import memberRoutes from "./routes/member.route"
import ProjectRoutes from "./routes/project.route"
import taskRoutes from "./routes/task.route"

const app = express()
const BASE_PATH = config.BASE_PATH

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
  session({
    name: "aj_session",
    keys: [config.SESSION_SECRET],
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: config.NODE_ENV === "production" ? "none" : "lax",
    domain: config.NODE_ENV === "production" ? undefined : undefined, // Remove domain restriction in production
  })
)

app.use(passport.initialize())
app.use(passport.session())

// Apply CORS before any route handlers
app.use(
  cors({
    origin: [
      config.FRONTEND_ORIGIN,
      "https://ajay-teamsync.vercel.app",
      "http://localhost:3000", // for local development
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie"],
  })
)

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
app.use(`${BASE_PATH}/user`, isAuthenticated, userRoutes)
app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRoutes)
app.use(`${BASE_PATH}/member`, isAuthenticated, memberRoutes)
app.use(`${BASE_PATH}/project`, isAuthenticated, ProjectRoutes)
app.use(`${BASE_PATH}/task`, isAuthenticated, taskRoutes)

// Error handling
app.use(errorHandler)

app.listen(config.PORT, async () => {
  console.log(`Server is running on port ${config.PORT} in ${config.NODE_ENV}`)
  await ConnectDatabase()
})
