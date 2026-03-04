import { z } from "zod";

export const versionSchema = z.object({
  latestVersion: z
    .string()
    .min(1, "La version est requise")
    .regex(/^\d+\.\d+\.\d+$/, "Format de version invalide (ex: 1.0.0)"),
  minVersion: z
    .string()
    .min(1, "La version minimale est requise")
    .regex(/^\d+\.\d+\.\d+$/, "Format de version invalide (ex: 1.0.0)"),
  forceUpdateMessage: z
    .string()
    .min(1, "Le message de mise à jour forcée est requis")
    .max(500, "Le message ne peut pas dépasser 500 caractères"),
});

export type VersionFormData = z.infer<typeof versionSchema>;
