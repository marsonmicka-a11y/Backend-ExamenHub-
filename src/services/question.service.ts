import { withTransaction } from "../database/connection";
import { questionRepository } from "../repositories/question.repository";
import { choiceRepository } from "../repositories/choice.repository";
import { examRepository } from "../repositories/exam.repository";
import { ApiError } from "../middlewares/error.middleware";


// Vérifier les choix d'une question
function validateChoices(choices: any[]) {

  // Il faut entre 2 et 6 choix
  if (choices.length < 2 || choices.length > 6) {
    throw new ApiError(
      400,
      "Il faut entre 2 et 6 choix"
    );
  }

  // Il faut exactement 1 bonne réponse
  const correct = choices.filter(c => c.isCorrect);

  if (correct.length !== 1) {
    throw new ApiError(
      400,
      "Il faut exactement 1 bonne réponse"
    );
  }

  // Chaque choix doit avoir un texte
  for (const choice of choices) {
    if (!choice.label) {
      throw new ApiError(
        400,
        "Chaque choix doit avoir un texte"
      );
    }
  }
}


// Vérifier que l'examen existe
async function checkExam(examId: number) {

  const exam = await examRepository.findById(examId);

  if (!exam) {
    throw new ApiError(
      404,
      "Examen introuvable"
    );
  }

  return exam;
}


// Vérifier que l'examen n'est pas encore utilisé
async function checkExamNotLocked(examId: number) {

  const count = await examRepository.countAttempts(examId);

  if (count > 0) {
    throw new ApiError(
      409,
      "Impossible de modifier les questions"
    );
  }
}


export const questionService = {


  // =========================
  // AFFICHER LES QUESTIONS
  // =========================

  async listQuestions(examId: number) {

    await checkExam(examId);

    const questions =
      await questionRepository.findByExam(examId);

    const choices =
      await choiceRepository.findByQuestions(
        questions.map(q => q.id)
      );

    return questions.map(question => ({
      ...question,

      choices: choices.filter(
        choice => choice.question_id === question.id
      )
    }));
  },


  // =========================
  // UNE QUESTION
  // =========================

  async getQuestion(id: number) {

    const question =
      await questionRepository.findById(id);

    if (!question) {
      throw new ApiError(
        404,
        "Question introuvable"
      );
    }

    const choices =
      await choiceRepository.findByQuestion(id);

    return {
      ...question,
      choices
    };
  },


  // =========================
  // CRÉER UNE QUESTION
  // =========================

  async createQuestion(data: any) {

    // Vérifier l'énoncé
    if (!data.statement) {
      throw new ApiError(
        400,
        "L'énoncé est requis"
      );
    }

    // Vérifier les choix
    validateChoices(data.choices);

    // Vérifier l'examen
    await checkExam(data.examId);

    // Vérifier que l'examen est modifiable
    await checkExamNotLocked(data.examId);


    // Transaction
    return withTransaction(async client => {

      // Créer la question
      const question =
        await questionRepository.create(
          {
            examId: data.examId,
            statement: data.statement,
            points: data.points || 1
          },
          client
        );


      // Créer les choix
      const choices =
        await choiceRepository.createMany(
          question.id,
          data.choices,
          client
        );


      return {
        ...question,
        choices
      };
    });
  },


  // =========================
  // MODIFIER UNE QUESTION
  // =========================

  async updateQuestion(id: number, data: any) {

    // Chercher la question
    const question =
      await questionRepository.findById(id);

    if (!question) {
      throw new ApiError(
        404,
        "Question introuvable"
      );
    }

    // Vérifier les choix
    validateChoices(data.choices);

    // Vérifier que l'examen est modifiable
    await checkExamNotLocked(question.exam_id);


    return withTransaction(async client => {

      // Modifier la question
      const updated =
        await questionRepository.update(
          id,
          {
            statement: data.statement,
            points: data.points || question.points
          },
          client
        );


      // Supprimer les anciens choix
      await choiceRepository.deleteByQuestion(
        id,
        client
      );


      // Ajouter les nouveaux choix
      const choices =
        await choiceRepository.createMany(
          id,
          data.choices,
          client
        );


      return {
        ...updated,
        choices
      };
    });
  },


  // =========================
  // SUPPRIMER UNE QUESTION
  // =========================

  async deleteQuestion(id: number) {

    const question =
      await questionRepository.findById(id);

    if (!question) {
      throw new ApiError(
        404,
        "Question introuvable"
      );
    }

    // Vérifier que l'examen n'est pas verrouillé
    await checkExamNotLocked(
      question.exam_id
    );

    // Supprimer
    await questionRepository.delete(id);
  }

};