import { Request, Response } from "express";
import { resultService } from "../services/result.service";

function getId(value: string): number {
  const id = Number(value);

  if (!Number.isInteger(id)) {
    throw new Error("Identifiant invalide");
  }

  return id;
}

export const resultController = {

  async getExamResults(req: Request, res: Response): Promise<void> {

    const examId = getId(req.params.id);

    const results = await resultService.getExamResults(examId);

    res.status(200).json(results);
  },


  async getMyResults(req: Request, res: Response): Promise<void> {

    const studentId = req.user!.sub;

    const results = await resultService.getMyResults(studentId);

    res.status(200).json(results);
  }
};