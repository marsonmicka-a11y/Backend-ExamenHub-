import { examRepository } from "../repositories/exam.repository";
import { attemptRepository } from "../repositories/attempt.repository";
import { userRepository } from "../repositories/user.repository";
import { ApiError } from "../middlewares/error.middleware";

// 50% = réussite
const PASS = 0.5;

export const resultService = {

  // ==========================
  // ADMIN : résultats d'un examen
  // ==========================

  async getExamResults(examId: number) {

    // Vérifier que l'examen existe
    const exam = await examRepository.findById(examId);

    if (!exam) {
      throw new ApiError(404, "Examen introuvable");
    }


    // Récupérer les tentatives
    const attempts =
      await attemptRepository.findByExam(examId);


    // Préparer les résultats
    const results = [];

    for (const attempt of attempts) {

      // Chercher l'étudiant
      const student =
        await userRepository.findById(
          attempt.student_id
        );

      // Calculer le pourcentage
      const percent =
        attempt.max_score > 0
          ? attempt.score / attempt.max_score
          : 0;


      results.push({
        attemptId: attempt.id,
        studentId: attempt.student_id,

        studentName:
          student?.full_name ?? "Inconnu",

        studentEmail:
          student?.email ?? "",

        score: Number(attempt.score),
        maxScore: Number(attempt.max_score),

        // >= 50% = admis
        passed: percent >= PASS,

        submittedAt: attempt.submitted_at
      });
    }


    return {
      exam: {
        id: exam.id,
        title: exam.title
      },
      results
    };
  },


  // ==========================
  // ÉTUDIANT : mes résultats
  // ==========================

  async getMyResults(studentId: number) {

    // Récupérer les examens passés
    const attempts =
      await attemptRepository.findByStudent(
        studentId
      );


    const results = [];

    for (const attempt of attempts) {

      // Chercher l'examen
      const exam =
        await examRepository.findById(
          attempt.exam_id
        );


      // Calculer le pourcentage
      const percent =
        attempt.max_score > 0
          ? attempt.score / attempt.max_score
          : 0;


      results.push({
        attemptId: attempt.id,
        examId: attempt.exam_id,

        examTitle:
          exam?.title ?? "Examen supprimé",

        score: Number(attempt.score),
        maxScore: Number(attempt.max_score),

        passed: percent >= PASS,

        submittedAt: attempt.submitted_at
      });
    }


    // Calculer la moyenne
    let total = 0;

    for (const result of results) {
      if (result.maxScore > 0) {
        total += result.score / result.maxScore;
      }
    }

    const average =
      results.length > 0
        ? total / results.length
        : 0;


    return {
      results,
      averagePercent:
        Math.round(average * 10000) / 100
    };
  }

};