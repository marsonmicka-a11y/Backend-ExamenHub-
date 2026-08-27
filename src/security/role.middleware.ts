import { Request, Response, NextFunction } from "express";
import { ApiError } from "../middlewares/error.middleware";

export function requireRole(role: string) {

  return (req: Request, res: Response, next: NextFunction) => {

    // Vérifier si l'utilisateur est connecté
    if (!req.user) {
      throw new ApiError(401, "Non authentifié");
    }

    // Vérifier le rôle
    if (req.user.role !== role) {
      throw new ApiError(403, "Accès refusé");
    }

    // Continuer
    next();
  };
}