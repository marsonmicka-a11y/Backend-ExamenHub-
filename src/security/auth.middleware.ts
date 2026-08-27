import { NextFunction, Request, Response } from "express";
import { verifyToken, TokenPayload } from "./jwt";
import { ApiError } from "../middlewares/error.middleware";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

// Vérifie la présence et la validité du JWT (en-tête Authorization: Bearer <token>)
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw new ApiError(401, "Non authentifié");
  }
  const token = header.slice("Bearer ".length);
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    throw new ApiError(401, "Token invalide ou expiré");
  }
}
