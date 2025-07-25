import jwt, { SignOptions } from "jsonwebtoken"
import { UserDocument } from "../models/user.model"
import { config } from "../config/app.config"

export type AccessPayload = {
  userId: UserDocument["_id"]
}

type SignOptsAndSecret = SignOptions & {
  secret: string
}

const defaults: SignOptions = {
  audience: ["user"],
}

export const accessTokenSignature: SignOptsAndSecret = {
  expiresIn: parseInt(config.JWT_EXPIRES_IN),
  secret: config.JWT_SECRET,
}

export const signJwtToken = (payload: AccessPayload, options?: SignOptsAndSecret) => {
  const { secret, ...opts } = options || accessTokenSignature

  return jwt.sign(payload, secret, {
    ...defaults,
    ...opts,
  })
}
