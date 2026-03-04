import { z } from "zod";

export const newsletterSchema = z.object({
  first_name: z
    .string()
    .min(1, "Le prénom est requis")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères"),
  last_name: z
    .string()
    .min(1, "Le nom est requis")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  company: z
    .string()
    .min(1, "L'entreprise est requise")
    .max(100, "L'entreprise ne peut pas dépasser 100 caractères"),
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
  message: z
    .string()
    .min(1, "Le message est requis")
    .max(1000, "Le message ne peut pas dépasser 1000 caractères"),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;
