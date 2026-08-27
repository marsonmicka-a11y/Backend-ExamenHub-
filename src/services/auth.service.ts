import bcrypt from "bcrypt";
import { userRepository } from "../repositories/user.repository";
import { signToken } from "../security/jwt";
import { ApiError } from "../middlewares/error.middleware";
import { toPublicUser } from "../models/user.model";

export const authService = {

  async login(email: string, password: string) {

    // 1. Chercher l'utilisateur
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new ApiError(401, "Email ou mot de passe incorrect");
    }

    // 2. Vérifier si le compte est actif
    if (!user.active) {
      throw new ApiError(403, "Ce compte a été désactivé");
    }

    // 3. Vérifier le mot de passe
    const correct = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!correct) {
      throw new ApiError(401, "Email ou mot de passe incorrect");
    }

    // 4. Créer le token
    const token = signToken({
      sub: user.id,
      role: user.role,
      email: user.email
    });

    // 5. Retourner le token et l'utilisateur
    return {
      token: token,
      user: toPublicUser(user)
    };
  }

};