import { Request, Response } from "express";
import { courseService } from "../services/course.service";

function getId(value: string): number {
  const id = Number(value);

  if (!Number.isInteger(id)) {
    throw new Error("Identifiant invalide");
  }

  return id;
}

export const courseController = {

  // GET /courses
  async list(req: Request, res: Response): Promise<void> {
    const courses = await courseService.listCourses();

    res.status(200).json(courses);
  },

  // POST /courses
  async create(req: Request, res: Response): Promise<void> {
    const code = req.body.code;
    const name = req.body.name;
    const description = req.body.description;

    const course = await courseService.createCourse({
      code,
      name,
      description
    });

    res.status(201).json(course);
  },

  // PUT /courses/:id
  async update(req: Request, res: Response): Promise<void> {
    const id = getId(req.params.id);

    const code = req.body.code;
    const name = req.body.name;
    const description = req.body.description;

    const course = await courseService.updateCourse(id, {
      code,
      name,
      description
    });

    res.status(200).json(course);
  },

  // DELETE /courses/:id
  async remove(req: Request, res: Response): Promise<void> {
    const id = getId(req.params.id);

    await courseService.deleteCourse(id);

    res.status(204).send();
  }
};