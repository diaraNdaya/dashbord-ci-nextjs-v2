import { z } from "zod";

const isFile = (v: unknown): v is File =>
  typeof File !== "undefined" && v instanceof File;

// Schema de validation pour le formulaire de banner
export const bannerSchema = z.object({
  image: z
    .custom<File>((v) => v === null || v === undefined || isFile(v), {
      message: "Fichier invalide",
    })
    .nullable()
    .optional(),
  description: z.string().min(1, "La description est requise"),
  productLink: z
    .string()
    .url({ message: "URL invalide" })
    .optional()
    .or(z.literal("")),
});

export type BannerFormData = z.infer<typeof bannerSchema>;
