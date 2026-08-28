import bcrypt from "bcrypt";
import { userRepository } from "../repositories/user.repository";
import { signToken } from "../security/jwt";
import { ApiError } from "../middlewares/error.middleware";
import { toPublicUser } from "../models/user.model";

export const authService = {

  async login(email: string, password: string) {

    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new ApiError(401, "Email ou mot de passe incorrect");
    }

    if (!user.active) {
      throw new ApiError(403, "Ce compte a été désactivé");
    }

    const correct = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!correct) {
      throw new ApiError(401, "Email ou mot de passe incorrect");
    }

    const token = signToken({
      sub: user.id,
      role: user.role,
      email: user.email
    });

    return {
      token: token,
      user: toPublicUser(user)
    };
  }

};
