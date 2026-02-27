import z from "zod";

export const isFile = (v: unknown): v is File =>
  typeof File !== "undefined" && v instanceof File;

/** Schémas Zod */
export const createSchema = z.object({
  name: z
    .string({
      message: "Le nom de la catégorie doit contenir au moins 2 caractères",
    })
    .min(2, {
      message: "Le nom de la catégorie doit contenir au moins 2 caractères",
    }),
  description: z.string().min(2, {
    message: "La description doit contenir au moins 2 caractères",
  }),
  type: z
    .string({
      message: "Veuillez sélectionner un type",
    })
    .min(1, {
      message: "Le type est requis",
    }),
  mainImage: z
    .custom<File>((v) => v === null || v === undefined || isFile(v), {
      message: "Fichier invalide",
    })
    .nullable()
    .optional(),
  additionalImages: z
    .array(z.custom<File>((v) => isFile(v), { message: "Fichier invalide" }))
    .min(4, {
      message: "Veuillez sélectionner exactement 4 images supplémentaires",
    })
    .max(4, {
      message: "Veuillez sélectionner exactement 4 images supplémentaires",
    }),
});

export const updateSchema = z.object({
  /** Tous facultatifs */
  name: z.string().optional(),
  description: z.string().optional(),
  type: z.string().optional(),
  mainImage: z
    .custom<File>((v) => v === null || v === undefined || isFile(v), {
      message: "Fichier invalide",
    })
    .nullable()
    .optional(),
  /** On n'édite PAS les images supplémentaires en update.
   * On garde ce champ présent pour le form, toujours tableau vide.
   */
  additionalImages: z
    .array(z.custom<File>((v) => isFile(v)))
    .max(0)
    .optional()
    .default([]),
});

/** Types dérivés */
export type CreateValues = z.infer<typeof createSchema>;
export type UpdateValues = z.infer<typeof updateSchema>;
export type FormValues = CreateValues | UpdateValues;
