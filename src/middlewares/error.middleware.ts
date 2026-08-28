import { Request, Response, NextFunction } from "express";

export class ApiError extends Error {

  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}


export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {

  if (err instanceof ApiError) {

    res.status(err.status).json({
      message: err.message
    });

    return;
  }


  if ((err as any).code === "23505") {

    res.status(409).json({
      message: "Cette ressource existe déjà"
    });

    return;
  }


  if ((err as any).code === "23503") {

    res.status(409).json({
      message: "Cette ressource est liée à une autre"
    });

    return;
  }


  console.error(err);

  res.status(500).json({
    message: "Erreur interne du serveur"
  });
}