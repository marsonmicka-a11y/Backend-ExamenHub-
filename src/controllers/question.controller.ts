import { Request, Response } from "express";
import { questionService } from "../services/question.service";

function getId(value: string): number {
  const id = Number(value);

  if (!Number.isInteger(id)) {
    throw new Error("Identifiant invalide");
  }

  return id;
}

export const questionController = {

  // Voir les questions d'un examen
  async listForExam(req: Request, res: Response): Promise<void> {

    const examId = getId(req.params.id);

    const questions =
      await questionService.listQuestions(examId);

    res.status(200).json(questions);
  },


  // Créer une question
  async createForExam(req: Request, res: Response): Promise<void> {

    const examId = getId(req.params.id);

    const statement = req.body.statement;
    const points = req.body.points;
    const choices = req.body.choices ?? [];

    const question =
      await questionService.createQuestion({
        examId,
        statement,
        points,
        choices
      });

    res.status(201).json(question);
  },


  // Modifier une question
  async update(req: Request, res: Response): Promise<void> {

    const id = getId(req.params.id);

    const statement = req.body.statement;
    const points = req.body.points;
    const choices = req.body.choices ?? [];

    const question =
      await questionService.updateQuestion(id, {
        statement,
        points,
        choices
      });

    res.status(200).json(question);
  },


  // Supprimer une question
  async remove(req: Request, res: Response): Promise<void> {

    const id = getId(req.params.id);

    await questionService.deleteQuestion(id);

    res.status(204).send();
  }
};