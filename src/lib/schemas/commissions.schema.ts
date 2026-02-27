import z from "zod";

// Schéma de validation simplifié pour les commissions
export const commissionSchema = z.object({
  rate: z
    .number()
    .min(0.1, "Le taux doit être supérieur à 0")
    .max(100, "Le taux ne peut pas dépasser 100%"),
});

export type CommissionFormData = z.infer<typeof commissionSchema>;
