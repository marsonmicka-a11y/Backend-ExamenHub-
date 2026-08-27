import { courseRepository } from "../repositories/course.repository";
import { ApiError } from "../middlewares/error.middleware";

export const courseService = {

  // Voir tous les cours
  async listCourses() {
    return courseRepository.findAll();
  },


  // Chercher un cours
  async getCourse(id: number) {
    const course = await courseRepository.findById(id);

    if (!course) {
      throw new ApiError(404, "Cours introuvable");
    }

    return course;
  },


  // Créer un cours
  async createCourse(params: {
    code: string;
    name: string;
    description?: string;
  }) {

    // Vérifier les champs
    if (!params.code || !params.name) {
      throw new ApiError(400, "code et name sont requis");
    }

    // Vérifier si le code existe déjà
    const course = await courseRepository.findByCode(params.code);

    if (course) {
      throw new ApiError(409, "Ce cours existe déjà");
    }

    // Créer le cours
    return courseRepository.create({
      code: params.code,
      name: params.name,
      description: params.description || null
    });
  },


  // Modifier un cours
  async updateCourse(id: number, params: any) {

    // Vérifier que le cours existe
    await this.getCourse(id);

    // Modifier
    const course = await courseRepository.update(id, params);

    return course;
  },


  // Supprimer un cours
  async deleteCourse(id: number) {

    // Vérifier que le cours existe
    await this.getCourse(id);

    // Vérifier s'il possède des examens
    const count = await courseRepository.countExams(id);

    if (count > 0) {
      throw new ApiError(
        409,
        "Impossible de supprimer : ce cours possède des examens"
      );
    }

    // Supprimer
    await courseRepository.delete(id);
  }

};