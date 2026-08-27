import { pool, Queryable } from "../database/connection";
import { Choice } from "../models/choice.model";

export const choiceRepository = {

  // Trouver les choix d'une question
  async findByQuestion(
    questionId: number,
    db: Queryable = pool
  ): Promise<Choice[]> {

    const result = await db.query(
      "SELECT * FROM choices WHERE question_id = $1 ORDER BY id ASC",
      [questionId]
    );

    return result.rows;
  },


  // Trouver les choix de plusieurs questions
  async findByQuestions(
    questionIds: number[],
    db: Queryable = pool
  ): Promise<Choice[]> {

    if (questionIds.length === 0) {
      return [];
    }

    const result = await db.query(
      "SELECT * FROM choices WHERE question_id = ANY($1::int[]) ORDER BY id ASC",
      [questionIds]
    );

    return result.rows;
  },


  // Trouver un choix par son ID
  async findById(
    id: number,
    db: Queryable = pool
  ): Promise<Choice | null> {

    const result = await db.query(
      "SELECT * FROM choices WHERE id = $1",
      [id]
    );

    return result.rows[0] ?? null;
  },


  // Créer plusieurs choix
  async createMany(
    questionId: number,
    choices: {
      label: string;
      isCorrect: boolean;
    }[],
    db: Queryable = pool
  ): Promise<Choice[]> {

    const created: Choice[] = [];

    for (const choice of choices) {

      const result = await db.query(
        `INSERT INTO choices
        (question_id, label, is_correct)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [
          questionId,
          choice.label,
          choice.isCorrect
        ]
      );

      created.push(result.rows[0]);
    }

    return created;
  },


  // Supprimer les choix d'une question
  async deleteByQuestion(
    questionId: number,
    db: Queryable = pool
  ): Promise<void> {

    await db.query(
      "DELETE FROM choices WHERE question_id = $1",
      [questionId]
    );
  }
};