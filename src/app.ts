import "express-async-errors";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import studentRoutes from "./routes/student.routes";
import courseRoutes from "./routes/course.routes";
import { examAdminRouter, examStudentRouter } from "./routes/exam.routes";
import { examQuestionsRouter, questionsRouter } from "./routes/question.routes";
import { examResultsRouter, myResultsRouter } from "./routes/result.routes";

import { errorMiddleware, ApiError } from "./middlewares/error.middleware";
import { env } from "./config/env";


const app = express();


// ========================
// CONFIGURATION
// ========================

app.use(cors());
app.use(express.json());


// ========================
// ROUTES
// ========================

// Connexion
app.use("/api/auth", authRoutes);

// Étudiants
app.use("/api/students", studentRoutes);

// Cours
app.use("/api/courses", courseRoutes);

// Examens
app.use("/api/exams", examAdminRouter);

// Questions
app.use("/api/exams", examQuestionsRouter);
app.use("/api/questions", questionsRouter);

// Résultats
app.use("/api/exams", examResultsRouter);
app.use("/api/my", myResultsRouter);

// Examens étudiant
app.use("/api/my/exams", examStudentRouter);


// ========================
// TEST DU SERVEUR
// ========================

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok"
  });
});


// ========================
// ROUTE INEXISTANTE
// ========================

app.use("/api", (req, res) => {
  throw new ApiError(404, "Route introuvable");
});


// ========================
// GESTION DES ERREURS
// ========================

app.use(errorMiddleware);


// ========================
// DÉMARRER LE SERVEUR
// ========================

app.listen(env.port, () => {
  console.log(
    `Serveur démarré sur http://localhost:${env.port}`
  );
});


export default app;