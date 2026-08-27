import { pool, Queryable } from "../database/connection";
import { Question } from "../models/question.model";

// Ne gère QUE la table `questions`. La gestion des choix associés
// est déléguée à choice.repository.ts ; c'est la couche service
// (question.service.ts) qui orchestre les deux dans une transaction.
export const questionRepository = {
  async findByExam(examId: number, db: Queryable = pool): Promise<Question[]> {
    const result = await db.query<Question>(
      "SELECT * FROM questions WHERE exam_id = $1 ORDER BY id ASC",
      [examId]
    );
    return result.rows;
  },

  async findById(id: number, db: Queryable = pool): Promise<Question | null> {
    const result = await db.query<Question>("SELECT * FROM questions WHERE id = $1", [id]);
    return result.rows[0] ?? null;
  },

  async create(
    params: { examId: number; statement: string; points: number },
    db: Queryable = pool
  ): Promise<Question> {
    const result = await db.query<Question>(
      `INSERT INTO questions (exam_id, statement, points)
       VALUES ($1, $2, $3) RETURNING *`,
      [params.examId, params.statement, params.points]
    );
    return result.rows[0];
  },

  async update(
    id: number,
    params: { statement: string; points: number },
    db: Queryable = pool
  ): Promise<Question | null> {
    const result = await db.query<Question>(
      `UPDATE questions SET statement = $2, points = $3 WHERE id = $1 RETURNING *`,
      [id, params.statement, params.points]
    );
    return result.rows[0] ?? null;
  },

  async delete(id: number, db: Queryable = pool): Promise<void> {
    await db.query("DELETE FROM questions WHERE id = $1", [id]);
  },
};
