import { Request, Response, NextFunction } from "express";
import { ApiError } from "../middlewares/error.middleware";

export function requireRole(role: string) {

  return (req: Request, res: Response, next: NextFunction) => {

    if (!req.user) {
      throw new ApiError(401, "Non authentifié");
    }

    if (req.user.role !== role) {
      throw new ApiError(403, "Accès refusé");
    }

    next();
  };
}