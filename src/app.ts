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



app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);

app.use("/api/students", studentRoutes);

app.use("/api/courses", courseRoutes);

app.use("/api/exams", examAdminRouter);

app.use("/api/exams", examQuestionsRouter);
app.use("/api/questions", questionsRouter);

app.use("/api/exams", examResultsRouter);
app.use("/api/my", myResultsRouter);

app.use("/api/my/exams", examStudentRouter);



app.get("/api/health", (req, res) => {
  res.json({
    status: "ok"
  });
});




app.use("/api", (req, res) => {
  throw new ApiError(404, "Route introuvable");
});



app.use(errorMiddleware);



app.listen(env.port, () => {
  console.log(
    `Serveur démarré sur http://localhost:${env.port}`
  );
});


export default app;
