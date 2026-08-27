import { pool, Queryable } from "../database/connection";
import { User, UserRole } from "../models/user.model";

export const userRepository = {
  async findByEmail(email: string, db: Queryable = pool): Promise<User | null> {
    const result = await db.query<User>("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0] ?? null;
  },

  async findById(id: number, db: Queryable = pool): Promise<User | null> {
    const result = await db.query<User>("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0] ?? null;
  },

  async listByRole(role: UserRole, db: Queryable = pool): Promise<User[]> {
    const result = await db.query<User>(
      "SELECT * FROM users WHERE role = $1 ORDER BY created_at DESC",
      [role]
    );
    return result.rows;
  },

  async create(
    params: { email: string; passwordHash: string; role: UserRole; fullName: string },
    db: Queryable = pool
  ): Promise<User> {
    const result = await db.query<User>(
      `INSERT INTO users (email, password_hash, role, full_name)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [params.email, params.passwordHash, params.role, params.fullName]
    );
    return result.rows[0];
  },

  async setActive(id: number, active: boolean, db: Queryable = pool): Promise<User | null> {
    const result = await db.query<User>(
      "UPDATE users SET active = $2 WHERE id = $1 RETURNING *",
      [id, active]
    );
    return result.rows[0] ?? null;
  },
};
