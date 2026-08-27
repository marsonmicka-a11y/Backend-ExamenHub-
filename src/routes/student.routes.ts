import { Router } from "express";
import { studentController } from "../controllers/student.controller";
import { authenticate } from "../security/auth.middleware";
import { requireRole } from "../security/role.middleware";

const router = Router();

router.use(authenticate);

router.use(requireRole("admin"));

router.get("/", studentController.list);

router.post("/", studentController.create);

router.put("/:id", studentController.update);

router.delete("/:id", studentController.remove);

export default router;