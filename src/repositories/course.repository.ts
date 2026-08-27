import { pool, Queryable } from "../database/connection";
import { Course } from "../models/course.model";

export const courseRepository = {

  // Trouver tous les cours
  async findAll(db: Queryable = pool): Promise<Course[]> {

    const result = await db.query(
      "SELECT * FROM courses ORDER BY created_at DESC"
    );

    return result.rows;
  },


  // Trouver un cours par son ID
  async findById(
    id: number,
    db: Queryable = pool
  ): Promise<Course | null> {

    const result = await db.query(
      "SELECT * FROM courses WHERE id = $1",
      [id]
    );

    return result.rows[0] ?? null;
  },


  // Trouver un cours par son code
  async findByCode(
    code: string,
    db: Queryable = pool
  ): Promise<Course | null> {

    const result = await db.query(
      "SELECT * FROM courses WHERE code = $1",
      [code]
    );

    return result.rows[0] ?? null;
  },


  // Créer un cours
  async create(
    params: {
      code: string;
      name: string;
      description: string | null;
    },
    db: Queryable = pool
  ): Promise<Course> {

    const result = await db.query(
      `INSERT INTO courses
       (code, name, description)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [
        params.code,
        params.name,
        params.description
      ]
    );

    return result.rows[0];
  },


  // Modifier un cours
  async update(
    id: number,
    params: {
      code?: string;
      name?: string;
      description?: string | null;
    },
    db: Queryable = pool
  ): Promise<Course | null> {

    const result = await db.query(
      `UPDATE courses
       SET code = COALESCE($2, code),
           name = COALESCE($3, name),
           description = COALESCE($4, description)
       WHERE id = $1
       RETURNING *`,
      [
        id,
        params.code ?? null,
        params.name ?? null,
        params.description ?? null
      ]
    );

    return result.rows[0] ?? null;
  },


  // Supprimer un cours
  async delete(
    id: number,
    db: Queryable = pool
  ): Promise<void> {

    await db.query(
      "DELETE FROM courses WHERE id = $1",
      [id]
    );
  },


  // Compter les examens d'un cours
  async countExams(
    id: number,
    db: Queryable = pool
  ): Promise<number> {

    const result = await db.query(
      "SELECT COUNT(*)::int AS count FROM exams WHERE course_id = $1",
      [id]
    );

    return Number(result.rows[0].count);
  }
};