import { Router } from "express";
import { authController } from "../controllers/auth.controller";

const router = Router();

// Public
router.post("/login", authController.login);

export default router;
