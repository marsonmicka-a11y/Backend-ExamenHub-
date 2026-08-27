import { Router } from "express";
import { examController } from "../controllers/exam.controller";
import { authenticate } from "../security/auth.middleware";
import { requireRole } from "../security/role.middleware";

// ================= ADMIN =================

export const examAdminRouter = Router();

examAdminRouter.use(authenticate);
examAdminRouter.use(requireRole("admin"));

examAdminRouter.get("/", examController.list);
examAdminRouter.post("/", examController.create);
examAdminRouter.get("/:id", examController.getOne);
examAdminRouter.put("/:id", examController.update);
examAdminRouter.delete("/:id", examController.remove);


// ================= ÉTUDIANT =================

export const examStudentRouter = Router();

examStudentRouter.use(authenticate);
examStudentRouter.use(requireRole("student"));

examStudentRouter.get("/", examController.listAvailableForStudent);
examStudentRouter.get("/:id", examController.getForStudent);
examStudentRouter.post("/:id/submit", examController.submit);

export default examAdminRouter;