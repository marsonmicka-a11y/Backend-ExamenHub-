import { pool, Queryable } from "../database/connection";
import { Attempt } from "../models/attempt.model";

export const attemptRepository = {

  async findByStudentAndExam(
    studentId: number,
    examId: number,
    db: Queryable = pool
  ): Promise<Attempt | null> {

    const result = await db.query(
      "SELECT * FROM attempts WHERE student_id = $1 AND exam_id = $2",
      [studentId, examId]
    );

    return result.rows[0] ?? null;
  },


  async findById(
    id: number,
    db: Queryable = pool
  ): Promise<Attempt | null> {

    const result = await db.query(
      "SELECT * FROM attempts WHERE id = $1",
      [id]
    );

    return result.rows[0] ?? null;
  },


  async findByExam(
    examId: number,
    db: Queryable = pool
  ): Promise<Attempt[]> {

    const result = await db.query(
      "SELECT * FROM attempts WHERE exam_id = $1 ORDER BY submitted_at ASC",
      [examId]
    );

    return result.rows;
  },


  async findByStudent(
    studentId: number,
    db: Queryable = pool
  ): Promise<Attempt[]> {

    const result = await db.query(
      "SELECT * FROM attempts WHERE student_id = $1 ORDER BY submitted_at DESC",
      [studentId]
    );

    return result.rows;
  },


  async create(
    params: {
      studentId: number;
      examId: number;
      score: number;
      maxScore: number;
    },
    db: Queryable = pool
  ): Promise<Attempt> {

    const result = await db.query(
      `INSERT INTO attempts
       (student_id, exam_id, score, max_score)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        params.studentId,
        params.examId,
        params.score,
        params.maxScore
      ]
    );

    return result.rows[0];
  }
};
