import { Request, Response } from "express";
import { studentService } from "../services/student.service";

function getId(value: string): number {
  const id = Number(value);

  if (!Number.isInteger(id)) {
    throw new Error("Identifiant invalide");
  }

  return id;
}

export const studentController = {

  async list(req: Request, res: Response): Promise<void> {

    const students = await studentService.listStudents();

    res.status(200).json(students);
  },


  async create(req: Request, res: Response): Promise<void> {

    const email = req.body.email;
    const password = req.body.password;
    const fullName = req.body.fullName;

    const student = await studentService.createStudent({
      email,
      password,
      fullName
    });

    res.status(201).json(student);
  },


  
  async update(req: Request, res: Response): Promise<void> {

    const id = getId(req.params.id);
    const active = req.body.active;

    if (typeof active !== "boolean") {
      throw new Error("Le champ active doit être un boolean");
    }

    const student = await studentService.setActive(id, active);

    res.status(200).json(student);
  },


  
  async remove(req: Request, res: Response): Promise<void> {

    const id = getId(req.params.id);

    const student = await studentService.deactivate(id);

    res.status(200).json(student);
  }
};
