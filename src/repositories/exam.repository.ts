import { pool, Queryable } from "../database/connection";
import { Exam } from "../models/exam.model";

export const examRepository = {
  async findAll(db: Queryable = pool): Promise<Exam[]> {
    const result = await db.query<Exam>("SELECT * FROM exams ORDER BY start_date DESC");
    return result.rows;
  },

  async findById(id: number, db: Queryable = pool): Promise<Exam | null> {
    const result = await db.query<Exam>("SELECT * FROM exams WHERE id = $1", [id]);
    return result.rows[0] ?? null;
  },

  async findByCourse(courseId: number, db: Queryable = pool): Promise<Exam[]> {
    const result = await db.query<Exam>(
      "SELECT * FROM exams WHERE course_id = $1 ORDER BY start_date DESC",
      [courseId]
    );
    return result.rows;
  },

  async create(
    params: { courseId: number; title: string; startDate: Date; endDate: Date },
    db: Queryable = pool
  ): Promise<Exam> {
    const result = await db.query<Exam>(
      `INSERT INTO exams (course_id, title, start_date, end_date)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [params.courseId, params.title, params.startDate, params.endDate]
    );
    return result.rows[0];
  },

  async update(
    id: number,
    params: { title?: string; startDate?: Date; endDate?: Date },
    db: Queryable = pool
  ): Promise<Exam | null> {
    const result = await db.query<Exam>(
      `UPDATE exams
       SET title = COALESCE($2, title),
           start_date = COALESCE($3, start_date),
           end_date = COALESCE($4, end_date)
       WHERE id = $1 RETURNING *`,
      [id, params.title ?? null, params.startDate ?? null, params.endDate ?? null]
    );
    return result.rows[0] ?? null;
  },

  async delete(id: number, db: Queryable = pool): Promise<void> {
    await db.query("DELETE FROM exams WHERE id = $1", [id]);
  },

  async countAttempts(id: number, db: Queryable = pool): Promise<number> {
    const result = await db.query<{ count: string }>(
      "SELECT COUNT(*)::int AS count FROM attempts WHERE exam_id = $1",
      [id]
    );
    return Number(result.rows[0].count);
  },


  async findAvailableForStudent(studentId: number, db: Queryable = pool): Promise<Exam[]> {
    const result = await db.query<Exam>(
      `SELECT e.* FROM exams e
       WHERE NOW() BETWEEN e.start_date AND e.end_date
         AND NOT EXISTS (
           SELECT 1 FROM attempts a WHERE a.exam_id = e.id AND a.student_id = $1
         )
       ORDER BY e.end_date ASC`,
      [studentId]
    );
    return result.rows;
  },
};
