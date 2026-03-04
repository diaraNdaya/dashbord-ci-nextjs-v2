import { z } from "zod";

const baseDeliveryUserFields = {
  fullName: z
    .string()
    .min(1, "Le nom complet est requis")
    .max(100, "Le nom complet ne peut pas dépasser 100 caractères"),
  username: z
    .string()
    .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères")
    .max(50, "Le nom d'utilisateur ne peut pas dépasser 50 caractères")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Le nom d'utilisateur ne peut contenir que des lettres, chiffres et underscores",
    ),
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
  address: z
    .string()
    .min(1, "L'adresse est requise")
    .max(200, "L'adresse ne peut pas dépasser 200 caractères"),
  phone: z
    .string()
    .min(1, "Le numéro de téléphone est requis")
    .regex(/^[+]?[\d\s\-()]+$/, "Format de numéro de téléphone invalide"),
};

export const deliveryUserSchema = z
  .object({
    ...baseDeliveryUserFields,
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre",
      ),
    confirmPassword: z
      .string()
      .min(1, "La confirmation du mot de passe est requise"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const deliveryUserEditSchema = z.object(baseDeliveryUserFields);

export type DeliveryUserFormData = z.infer<typeof deliveryUserSchema>;
export type DeliveryUserEditFormData = z.infer<typeof deliveryUserEditSchema>;
