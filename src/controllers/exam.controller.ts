import { Request, Response } from "express";
import { examService } from "../services/exam.service";

function getId(value: string): number {
  const id = Number(value);

  if (!Number.isInteger(id)) {
    throw new Error("Identifiant invalide");
  }

  return id;
}

export const examController = {

  

  async list(req: Request, res: Response): Promise<void> {
    const exams = await examService.listExams();

    res.status(200).json(exams);
  },

  
  async getOne(req: Request, res: Response): Promise<void> {
    const id = getId(req.params.id);

    const exam = await examService.getExam(id);

    res.status(200).json(exam);
  },

  
  async create(req: Request, res: Response): Promise<void> {

    const courseId = req.body.courseId;
    const title = req.body.title;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    if (!courseId || !startDate || !endDate) {
      throw new Error("courseId, startDate et endDate sont requis");
    }

    const exam = await examService.createExam({
      courseId: Number(courseId),
      title,
      startDate,
      endDate
    });

    res.status(201).json(exam);
  },

  
  async update(req: Request, res: Response): Promise<void> {

    const id = getId(req.params.id);

    const title = req.body.title;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    const exam = await examService.updateExam(id, {
      title,
      startDate,
      endDate
    });

    res.status(200).json(exam);
  },

  
  async remove(req: Request, res: Response): Promise<void> {

    const id = getId(req.params.id);

    await examService.deleteExam(id);

    res.status(204).send();
  },


  
    async listAvailableForStudent(
    req: Request,
    res: Response
  ): Promise<void> {

    const studentId = req.user!.sub;

    const exams =
      await examService.listAvailableExamsForStudent(studentId);

    res.status(200).json(exams);
  },

  
  async getForStudent(
    req: Request,
    res: Response
  ): Promise<void> {

    const studentId = req.user!.sub;
    const examId = getId(req.params.id);

    const exam =
      await examService.getExamForStudent(studentId, examId);

    res.status(200).json(exam);
  },

  
  async submit(
    req: Request,
    res: Response
  ): Promise<void> {

    const studentId = req.user!.sub;
    const examId = getId(req.params.id);

    const answers = req.body.answers;

    const result =
      await examService.submitExam(
        studentId,
        examId,
        answers ?? []
      );

    res.status(201).json(result);
  }
};
