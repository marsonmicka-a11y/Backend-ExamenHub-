import { Router } from "express";
import { questionController } from "../controllers/question.controller";
import { authenticate } from "../security/auth.middleware";
import { requireRole } from "../security/role.middleware";

export const examQuestionsRouter = Router();

examQuestionsRouter.use(authenticate);
examQuestionsRouter.use(requireRole("admin"));

examQuestionsRouter.get(
  "/:id/questions",
  questionController.listForExam
);

examQuestionsRouter.post(
  "/:id/questions",
  questionController.createForExam
);


export const questionsRouter = Router();

questionsRouter.use(authenticate);
questionsRouter.use(requireRole("admin"));

questionsRouter.put(
  "/:id",
  questionController.update
);

questionsRouter.delete(
  "/:id",
  questionController.remove
);

export default questionsRouter;