import { z } from "zod";

export const shippingMethodSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  price: z
    .number()
    .min(0, "Le prix doit être positif")
    .max(999999, "Le prix ne peut pas dépasser 999999"),
  description: z
    .string()
    .min(1, "La description est requise")
    .max(500, "La description ne peut pas dépasser 500 caractères"),
});

export type ShippingMethodFormData = z.infer<typeof shippingMethodSchema>;
