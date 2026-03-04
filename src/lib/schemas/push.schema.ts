import { z } from "zod";

export const pushNotificationSchema = z.object({
  title: z
    .string()
    .min(1, "Le titre est requis")
    .max(100, "Le titre ne peut pas dépasser 100 caractères"),
  body: z
    .string()
    .min(1, "Le message est requis")
    .max(500, "Le message ne peut pas dépasser 500 caractères"),
  imageUrl: z
    .string()
    .url("L'URL de l'image doit être valide")
    .optional()
    .or(z.literal("")),
});

export type PushNotificationFormData = z.infer<typeof pushNotificationSchema>;
