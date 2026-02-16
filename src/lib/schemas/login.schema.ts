import { z } from "zod";
const VALIDATION_MESSAGES = {
  USERNAME_REQUIRED: "Le nom d'utilisateur est requis",
  PASSWORD_MIN_LENGTH: "Le mot de passe doit contenir au moins 6 caractères",
};

export const LoginSchema = () =>
  z.object({
    username: z
      .string()
      .min(1, { message: VALIDATION_MESSAGES.USERNAME_REQUIRED }),
    password: z
      .string()
      .min(6, { message: VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH }),
  });

export type LoginType = z.infer<ReturnType<typeof LoginSchema>>;
