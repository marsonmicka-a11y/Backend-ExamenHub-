import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: parseInt(process.env.PORT ?? "4000", 10),
  db: {
    host: process.env.DB_HOST ?? "localhost",
    port: parseInt(process.env.DB_PORT ?? "5432", 10),
    database: process.env.DB_NAME ?? "exam_app",
    user: process.env.DB_USER ?? "exam_user",
    password: process.env.DB_PASSWORD ?? "exam_password",
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? "dev_secret_change_me",
    expiresIn: process.env.JWT_EXPIRES_IN ?? "8h",
  },
};
