import { Request, Response } from "express";
import { resultService } from "../services/result.service";
import { ApiError } from "../middlewares/error.middleware";

function parseId(raw: string): number {
  const id = Number(raw);
  if (!Number.isInteger(id)) throw new ApiError(400, "Identifiant invalide");
  return id;
}

export const resultController = {
  async getExamResults(req: Request, res: Response): Promise<void> {
    const examId = parseId(req.params.id);
    const data = await resultService.getExamResults(examId);
    res.status(200).json(data);
  },

  async getMyResults(req: Request, res: Response): Promise<void> {
    const studentId = req.user!.sub;
    const data = await resultService.getMyResults(studentId);
    res.status(200).json(data);
  },
};
