import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UserRole } from "../models/user.model";

export interface TokenPayload {
  sub: number; // id de l'utilisateur
  role: UserRole;
  email: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  } as jwt.SignOptions);
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, env.jwt.secret) as unknown as TokenPayload;
}
