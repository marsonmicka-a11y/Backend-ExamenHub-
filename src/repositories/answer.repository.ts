import { pool, Queryable } from "../database/connection";
import { AttemptAnswer } from "../models/answer.model";

export const answerRepository = {

  // Trouver les réponses d'une tentative
  async findByAttempt(
    attemptId: number,
    db: Queryable = pool
  ): Promise<AttemptAnswer[]> {

    const result = await db.query(
      "SELECT * FROM attempt_answers WHERE attempt_id = $1 ORDER BY question_id ASC",
      [attemptId]
    );

    return result.rows;
  },


  // Créer plusieurs réponses
  async createMany(
    attemptId: number,
    answers: {
      questionId: number;
      choiceId: number | null;
      isCorrect: boolean;
      pointsAwarded: number;
    }[],
    db: Queryable = pool
  ): Promise<AttemptAnswer[]> {

    const created: AttemptAnswer[] = [];

    for (const answer of answers) {

      const result = await db.query(
        `INSERT INTO attempt_answers
        (attempt_id, question_id, choice_id, is_correct, points_awarded)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [
          attemptId,
          answer.questionId,
          answer.choiceId,
          answer.isCorrect,
          answer.pointsAwarded
        ]
      );

      created.push(result.rows[0]);
    }

    return created;
  }
};