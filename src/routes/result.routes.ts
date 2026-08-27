import { Router } from "express";
import { resultController } from "../controllers/result.controller";
import { authenticate } from "../security/auth.middleware";
import { requireRole } from "../security/role.middleware";


export const examResultsRouter = Router();

examResultsRouter.use(authenticate);
examResultsRouter.use(requireRole("admin"));

examResultsRouter.get(
  "/:id/results",
  resultController.getExamResults
);



export const myResultsRouter = Router();

myResultsRouter.use(authenticate);
myResultsRouter.use(requireRole("student"));

myResultsRouter.get(
  "/results",
  resultController.getMyResults
);

export default examResultsRouter;