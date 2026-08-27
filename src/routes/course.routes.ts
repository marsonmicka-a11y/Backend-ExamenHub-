import { Router } from "express";
import { courseController } from "../controllers/course.controller";
import { authenticate } from "../security/auth.middleware";
import { requireRole } from "../security/role.middleware";

// Administrateur uniquement.
const router = Router();
router.use(authenticate, requireRole("admin"));

router.get("/", courseController.list);
router.post("/", courseController.create);
router.put("/:id", courseController.update);
router.delete("/:id", courseController.remove);

export default router;
