import { withTransaction } from "../database/connection";
import { questionRepository } from "../repositories/question.repository";
import { choiceRepository } from "../repositories/choice.repository";
import { examRepository } from "../repositories/exam.repository";
import { ApiError } from "../middlewares/error.middleware";


function validateChoices(choices: any[]) {

  if (choices.length < 2 || choices.length > 6) {
    throw new ApiError(
      400,
      "Il faut entre 2 et 6 choix"
    );
  }

  const correct = choices.filter(c => c.isCorrect);

  if (correct.length !== 1) {
    throw new ApiError(
      400,
      "Il faut exactement 1 bonne réponse"
    );
  }

  for (const choice of choices) {
    if (!choice.label) {
      throw new ApiError(
        400,
        "Chaque choix doit avoir un texte"
      );
    }
  }
}


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



  async createQuestion(data: any) {

    if (!data.statement) {
      throw new ApiError(
        400,
        "L'énoncé est requis"
      );
    }

    validateChoices(data.choices);

    await checkExam(data.examId);

    await checkExamNotLocked(data.examId);


    return withTransaction(async client => {

      const question =
        await questionRepository.create(
          {
            examId: data.examId,
            statement: data.statement,
            points: data.points || 1
          },
          client
        );


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



  async updateQuestion(id: number, data: any) {

    const question =
      await questionRepository.findById(id);

    if (!question) {
      throw new ApiError(
        404,
        "Question introuvable"
      );
    }

    validateChoices(data.choices);

    await checkExamNotLocked(question.exam_id);


    return withTransaction(async client => {

      const updated =
        await questionRepository.update(
          id,
          {
            statement: data.statement,
            points: data.points || question.points
          },
          client
        );


      await choiceRepository.deleteByQuestion(
        id,
        client
      );


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



  async deleteQuestion(id: number) {

    const question =
      await questionRepository.findById(id);

    if (!question) {
      throw new ApiError(
        404,
        "Question introuvable"
      );
    }

    await checkExamNotLocked(
      question.exam_id
    );

    // Supprimer
    await questionRepository.delete(id);
  }

};
