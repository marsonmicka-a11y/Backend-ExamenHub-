import bcrypt from "bcrypt";
import { userRepository } from "../repositories/user.repository";
import { ApiError } from "../middlewares/error.middleware";
import { toPublicUser } from "../models/user.model";

export const studentService = {

  // Voir tous les étudiants
  async listStudents() {

    const students =
      await userRepository.listByRole("student");

    return students.map(toPublicUser);
  },


  // Créer un étudiant
  async createStudent(data: any) {

    // Vérifier les informations
    if (!data.email || !data.password || !data.fullName) {
      throw new ApiError(
        400,
        "email, password et nom sont requis"
      );
    }

    // Vérifier si l'email existe déjà
    const existing =
      await userRepository.findByEmail(data.email);

    if (existing) {
      throw new ApiError(
        409,
        "Cet email existe déjà"
      );
    }


    // Crypter le mot de passe
    const passwordHash =
      await bcrypt.hash(data.password, 10);


    // Créer l'utilisateur
    const student =
      await userRepository.create({
        email: data.email,
        passwordHash: passwordHash,
        role: "student",
        fullName: data.fullName
      });


    // Ne pas envoyer le mot de passe
    return toPublicUser(student);
  },


  // Activer / désactiver un étudiant
  async setActive(id: number, active: boolean) {

    // Chercher l'étudiant
    const student =
      await userRepository.findById(id);

    if (!student || student.role !== "student") {
      throw new ApiError(
        404,
        "Étudiant introuvable"
      );
    }


    // Modifier active
    const updated =
      await userRepository.setActive(
        id,
        active
      );

    return toPublicUser(updated!);
  },


  // Désactiver un étudiant
  async deactivate(id: number) {

    return this.setActive(id, false);
  }

};