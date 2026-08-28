import { withTransaction } from "../database/connection";
import { examRepository } from "../repositories/exam.repository";
import { courseRepository } from "../repositories/course.repository";
import { questionRepository } from "../repositories/question.repository";
import { choiceRepository } from "../repositories/choice.repository";
import { attemptRepository } from "../repositories/attempt.repository";
import { answerRepository } from "../repositories/answer.repository";
import { ApiError } from "../middlewares/error.middleware";
import { Exam } from "../models/exam.model";
import { PublicQuestion } from "../models/question.model";
import { toPublicChoice } from "../models/choice.model";

interface SubmittedAnswer {
  questionId: number;
  choiceId: number | null;
}

export const examService = {

  async listExams(): Promise<Exam[]> {
    return examRepository.findAll();
  },

  async getExam(id: number): Promise<Exam> {
    const exam = await examRepository.findById(id);
    if (!exam) throw new ApiError(404, "Examen introuvable");
    return exam;
  },

  async createExam(params: {
    courseId: number;
    title: string;
    startDate: string;
    endDate: string;
  }): Promise<Exam> {
    if (!params.title || !params.title.trim()) {
      throw new ApiError(400, "Le titre de l'examen est requis");
    }
    const course = await courseRepository.findById(params.courseId);
    if (!course) throw new ApiError(400, "Cours introuvable");

    const startDate = new Date(params.startDate);
    const endDate = new Date(params.endDate);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new ApiError(400, "Dates invalides");
    }
    if (endDate <= startDate) {
      throw new ApiError(400, "La date de fin doit être postérieure à la date de début");
    }

    return examRepository.create({
      courseId: params.courseId,
      title: params.title,
      startDate,
      endDate,
    });
  },

  async updateExam(
    id: number,
    params: { title?: string; startDate?: string; endDate?: string }
  ): Promise<Exam> {
    const exam = await this.getExam(id);

    const startDate = params.startDate ? new Date(params.startDate) : exam.start_date;
    const endDate = params.endDate ? new Date(params.endDate) : exam.end_date;
    if (isNaN(new Date(startDate).getTime()) || isNaN(new Date(endDate).getTime())) {
      throw new ApiError(400, "Dates invalides");
    }
    if (new Date(endDate) <= new Date(startDate)) {
      throw new ApiError(400, "La date de fin doit être postérieure à la date de début");
    }

    const updated = await examRepository.update(id, {
      title: params.title,
      startDate: params.startDate ? startDate : undefined,
      endDate: params.endDate ? endDate : undefined,
    });
    if (!updated) throw new ApiError(404, "Examen introuvable");
    return updated;
  },

  async deleteExam(id: number): Promise<void> {
    await this.getExam(id);
    const attemptCount = await examRepository.countAttempts(id);
    if (attemptCount > 0) {
      throw new ApiError(
        409,
        "Impossible de supprimer cet examen : des tentatives ont déjà été enregistrées"
      );
    }
    await examRepository.delete(id);
  },


  async listAvailableExamsForStudent(studentId: number): Promise<Exam[]> {
    return examRepository.findAvailableForStudent(studentId);
  },


  async getExamForStudent(
    studentId: number,
    examId: number
  ): Promise<{ exam: Exam; questions: PublicQuestion[] }> {
    const exam = await examRepository.findById(examId);
    if (!exam) throw new ApiError(404, "Examen introuvable");

    const now = new Date();
    if (now < exam.start_date || now > exam.end_date) {
      throw new ApiError(403, "Cet examen n'est pas disponible actuellement");
    }

    const existingAttempt = await attemptRepository.findByStudentAndExam(studentId, examId);
    if (existingAttempt) {
      throw new ApiError(409, "Vous avez déjà passé cet examen");
    }

    const questions = await questionRepository.findByExam(examId);
    const choices = await choiceRepository.findByQuestions(questions.map((q) => q.id));

    const publicQuestions: PublicQuestion[] = questions.map((q) => ({
      id: q.id,
      statement: q.statement,
      points: q.points,
      choices: choices
        .filter((c) => c.question_id === q.id)
        .map(toPublicChoice), // RG-07 : jamais is_correct
    }));

    return { exam, questions: publicQuestions };
  },

  async submitExam(
    studentId: number,
    examId: number,
    submittedAnswers: SubmittedAnswer[]
  ): Promise<{
    score: number;
    maxScore: number;
    details: {
      questionId: number;
      statement: string;
      points: number;
      selectedChoiceId: number | null;
      isCorrect: boolean;
      pointsAwarded: number;
      correctChoiceId: number;
      choices: { id: number; label: string; isCorrect: boolean }[];
    }[];
  }> {
    const exam = await examRepository.findById(examId);
    if (!exam) throw new ApiError(404, "Examen introuvable");

    const now = new Date();
    if (now < exam.start_date || now > exam.end_date) {
      throw new ApiError(403, "La fenêtre de disponibilité de cet examen est fermée");
    }

    const existingAttempt = await attemptRepository.findByStudentAndExam(studentId, examId);
    if (existingAttempt) {
      throw new ApiError(409, "Vous avez déjà passé cet examen");
    }

    const questions = await questionRepository.findByExam(examId);
    if (questions.length === 0) {
      throw new ApiError(400, "Cet examen ne contient aucune question");
    }
    const allChoices = await choiceRepository.findByQuestions(questions.map((q) => q.id));

    const answerByQuestion = new Map<number, number | null>();
    for (const a of submittedAnswers ?? []) {
      answerByQuestion.set(a.questionId, a.choiceId ?? null);
    }

    let score = 0;
    let maxScore = 0;
    const details: {
      questionId: number;
      statement: string;
      points: number;
      selectedChoiceId: number | null;
      isCorrect: boolean;
      pointsAwarded: number;
      correctChoiceId: number;
      choices: { id: number; label: string; isCorrect: boolean }[];
    }[] = [];
    const answersToInsert: {
      questionId: number;
      choiceId: number | null;
      isCorrect: boolean;
      pointsAwarded: number;
    }[] = [];

    for (const question of questions) {
      const questionChoices = allChoices.filter((c) => c.question_id === question.id);
      const correctChoice = questionChoices.find((c) => c.is_correct)!;
      maxScore += Number(question.points);

      const selectedChoiceId = answerByQuestion.has(question.id)
        ? answerByQuestion.get(question.id) ?? null
        : null;

      let isCorrect = false;
      let pointsAwarded = 0;
      if (selectedChoiceId !== null) {
        const selectedChoice = questionChoices.find((c) => c.id === selectedChoiceId);
        if (!selectedChoice) {
          throw new ApiError(400, `Choix invalide pour la question ${question.id}`);
        }
        isCorrect = selectedChoice.is_correct;
        pointsAwarded = isCorrect ? Number(question.points) : 0;
      }

      score += pointsAwarded;
      answersToInsert.push({
        questionId: question.id,
        choiceId: selectedChoiceId,
        isCorrect,
        pointsAwarded,
      });
      details.push({
        questionId: question.id,
        statement: question.statement,
        points: Number(question.points),
        selectedChoiceId,
        isCorrect,
        pointsAwarded,
        correctChoiceId: correctChoice.id,
        choices: questionChoices.map((c) => ({
          id: c.id,
          label: c.label,
          isCorrect: c.is_correct,
        })),
      });
    }

    await withTransaction(async (client) => {
      const attempt = await attemptRepository.create(
        { studentId, examId, score, maxScore },
        client
      );
      await answerRepository.createMany(attempt.id, answersToInsert, client);
    });

    // RG-12 : l'étudiant voit immédiatement sa note et la correction complète.
    return { score, maxScore, details };
  },
};
