import bcrypt from "bcrypt";
import { userRepository } from "../repositories/user.repository";
import { ApiError } from "../middlewares/error.middleware";
import { toPublicUser } from "../models/user.model";

export const studentService = {

  async listStudents() {

    const students =
      await userRepository.listByRole("student");

    return students.map(toPublicUser);
  },


  async createStudent(data: any) {

    if (!data.email || !data.password || !data.fullName) {
      throw new ApiError(
        400,
        "email, password et nom sont requis"
      );
    }

    const existing =
      await userRepository.findByEmail(data.email);

    if (existing) {
      throw new ApiError(
        409,
        "Cet email existe déjà"
      );
    }


    const passwordHash =
      await bcrypt.hash(data.password, 10);


    const student =
      await userRepository.create({
        email: data.email,
        passwordHash: passwordHash,
        role: "student",
        fullName: data.fullName
      });


    return toPublicUser(student);
  },


  async setActive(id: number, active: boolean) {

    const student =
      await userRepository.findById(id);

    if (!student || student.role !== "student") {
      throw new ApiError(
        404,
        "Étudiant introuvable"
      );
    }


    const updated =
      await userRepository.setActive(
        id,
        active
      );

    return toPublicUser(updated!);
  },


  async deactivate(id: number) {

    return this.setActive(id, false);
  }

};