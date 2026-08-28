import { courseRepository } from "../repositories/course.repository";
import { ApiError } from "../middlewares/error.middleware";

export const courseService = {

  async listCourses() {
    return courseRepository.findAll();
  },


  async getCourse(id: number) {
    const course = await courseRepository.findById(id);

    if (!course) {
      throw new ApiError(404, "Cours introuvable");
    }

    return course;
  },


  async createCourse(params: {
    code: string;
    name: string;
    description?: string;
  }) {

    if (!params.code || !params.name) {
      throw new ApiError(400, "code et name sont requis");
    }

    const course = await courseRepository.findByCode(params.code);

    if (course) {
      throw new ApiError(409, "Ce cours existe déjà");
    }

    return courseRepository.create({
      code: params.code,
      name: params.name,
      description: params.description || null
    });
  },


  async updateCourse(id: number, params: any) {

    await this.getCourse(id);

    const course = await courseRepository.update(id, params);

    return course;
  },


  async deleteCourse(id: number) {

    await this.getCourse(id);

    const count = await courseRepository.countExams(id);

    if (count > 0) {
      throw new ApiError(
        409,
        "Impossible de supprimer : ce cours possède des examens"
      );
    }

    await courseRepository.delete(id);
  }

};