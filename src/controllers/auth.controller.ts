import { Request, Response } from "express";
import { authService } from "../services/auth.service";

export const authController = {
  async login(req: Request, res: Response): Promise<void> {

    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      res.status(400).json({
        message: "Email et password sont requis"
      });
      return;
    }

    const result = await authService.login(email, password);

    res.status(200).json(result);
  }
};