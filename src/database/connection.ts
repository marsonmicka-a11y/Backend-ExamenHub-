import { Pool, PoolClient } from "pg";
import { env } from "../config/env";

// Connexion à PostgreSQL
export const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  database: env.db.database,
  user: env.db.user,
  password: env.db.password,
});

// Afficher une erreur si la connexion PostgreSQL rencontre un problème
pool.on("error", (error) => {
  console.error("Erreur PostgreSQL :", error);
});

// Permet d'utiliser soit pool, soit un client
export type Queryable = Pool | PoolClient;

// Faire plusieurs requêtes dans une transaction
export async function withTransaction<T>(
  work: (client: PoolClient) => Promise<T>
): Promise<T> {

  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    const result = await work(client);

    await client.query("COMMIT");

    return result;

  } catch (error) {

    await client.query("ROLLBACK");

    throw error;

  } finally {

    client.release();

  }
}