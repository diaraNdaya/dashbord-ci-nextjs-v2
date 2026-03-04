import type {
  CommissionCreateData,
  CommissionSearchParams,
  CommissionUpdateData,
} from "@/services/actions/commission.actions";
import {
  createCommissionAction,
  deleteCommissionAction,
  getAllDocumentsAction,
  getAllVerifiedCustomersAction,
  getAllVerifiedSellersAction,
  getCommissionConfigAction,
  getCommissionCountAction,
  getCommissionEvolutionAction,
  getCommissionGlobaleAction,
  getCommissionsBySellerIdAction,
  getCommissionsSellersAction,
  getDeletedSellersAction,
  updateCommissionAction,
  validateDocumentAction,
} from "@/services/actions/commission.actions";

// Query options pour récupérer les commissions des vendeurs
export const getCommissionsSellersQueryOptions = (
  page: number,
  limit: number,
  searchParams?: CommissionSearchParams,
) => ({
  queryKey: ["commissions", "sellers", page, limit, searchParams] as const,
  queryFn: async () => {
    const result = await getCommissionsSellersAction(page, limit, searchParams);

    // Handle deeply nested structure: result.data.data.data
    if (result && typeof result === "object" && "data" in result) {
      const level1 = result.data;
      if (level1 && typeof level1 === "object" && "data" in level1) {
        const level2 = level1.data;
        if (level2 && typeof level2 === "object" && "data" in level2) {
          return level2; // This contains {data: [], totalItems, totalPages, etc.}
        }

        return level1;
      }

      return result.data;
    }

    return result;
  },
});

// Query options pour récupérer la commission globale
export const getCommissionGlobaleQueryOptions = () => ({
  queryKey: ["commissions", "globale"] as const,
  queryFn: async () => {
    const result = await getCommissionGlobaleAction();
    // Handle ActionResult type
    if (result && typeof result === "object" && "data" in result) {
      return result;
    }
    return result;
  },
});

// Query options pour récupérer la configuration de commission
export const getCommissionConfigQueryOptions = () => ({
  queryKey: ["commissions", "config"] as const,
  queryFn: async () => {
    const result = await getCommissionConfigAction();
    // Handle ActionResult type
    if (result && typeof result === "object" && "data" in result) {
      return result;
    }
    return result;
  },
});

// Query options pour récupérer l'évolution des commissions
export const getCommissionEvolutionQueryOptions = (
  period: string,
  date: string,
) => ({
  queryKey: ["commissions", "evolution", period, date] as const,
  queryFn: async () => {
    const result = await getCommissionEvolutionAction(period, date);
    if (result && typeof result === "object" && "data" in result) {
      return result.data;
    }

    // Handle direct array response
    if (Array.isArray(result)) {
      return result;
    }

    return result;
  },
});

export const getCommissionsBySellerIdQueryOptions = (
  id: string,
  page: number,
  limit: number,
) => ({
  queryKey: ["commissions", "seller", id, page, limit] as const,
  queryFn: async () => {
    const result = await getCommissionsBySellerIdAction(id, page, limit);
    // Handle ActionResult type
    if (result && typeof result === "object" && "data" in result) {
      return result;
    }
    return result;
  },
});

// Query options pour récupérer tous les documents
export const getAllDocumentsQueryOptions = (page: number, limit: number) => ({
  queryKey: ["documents", page, limit] as const,
  queryFn: async () => {
    const result = await getAllDocumentsAction(page, limit);
    // Handle ActionResult type
    if (result && typeof result === "object" && "data" in result) {
      return result;
    }
    return result;
  },
});

// Query options pour récupérer les vendeurs vérifiés
export const getAllVerifiedSellersQueryOptions = (
  page: number,
  limit: number,
  statut: string,
) => ({
  queryKey: ["sellers", "verified", page, limit, statut] as const,
  queryFn: async () => {
    const result = await getAllVerifiedSellersAction(page, limit, statut);
    // Handle ActionResult type
    if (result && typeof result === "object" && "data" in result) {
      return result;
    }
    return result;
  },
});

// Query options pour récupérer les clients vérifiés
export const getAllVerifiedCustomersQueryOptions = (
  page: number,
  limit: number,
  statut: string,
) => ({
  queryKey: ["customers", "verified", page, limit, statut] as const,
  queryFn: async () => {
    const result = await getAllVerifiedCustomersAction(page, limit, statut);
    // Handle ActionResult type
    if (result && typeof result === "object" && "data" in result) {
      return result;
    }
    return result;
  },
});

// Query options pour récupérer les vendeurs supprimés
export const getDeletedSellersQueryOptions = (page: number, limit: number) => ({
  queryKey: ["sellers", "deleted", page, limit] as const,
  queryFn: async () => {
    const result = await getDeletedSellersAction(page, limit);
    // Handle ActionResult type
    if (result && typeof result === "object" && "data" in result) {
      return result;
    }
    return result;
  },
});

// Query options pour récupérer le nombre de commissions
export const getCommissionCountQueryOptions = () => ({
  queryKey: ["commissions", "count"] as const,
  queryFn: async () => {
    const result = await getCommissionCountAction();
    // Handle ActionResult type
    if (result && typeof result === "object" && "data" in result) {
      return result;
    }
    return result;
  },
});

// Mutation options pour créer une commission
export const createCommissionMutationOptions = () => ({
  mutationFn: async (data: CommissionCreateData) => {
    const result = await createCommissionAction(data);
    // Handle ActionResult type
    if (result && typeof result === "object" && "data" in result) {
      return result;
    }
    return result;
  },
});

// Mutation options pour mettre à jour une commission
export const updateCommissionMutationOptions = () => ({
  mutationFn: async (data: CommissionUpdateData) => {
    const result = await updateCommissionAction(data);
    // Handle ActionResult type
    if (result && typeof result === "object" && "data" in result) {
      return result;
    }
    return result;
  },
});

// Mutation options pour supprimer une commission
export const deleteCommissionMutationOptions = () => ({
  mutationFn: async ({ id }: { id: string }) => {
    const result = await deleteCommissionAction(id);
    // Handle ActionResult type
    if (result && typeof result === "object" && "data" in result) {
      return result;
    }
    return result;
  },
});

// Mutation options pour valider un document
export const validateDocumentMutationOptions = () => ({
  mutationFn: async ({ id, statut }: { id: string; statut: string }) => {
    const result = await validateDocumentAction(id, statut);
    // Handle ActionResult type
    if (result && typeof result === "object" && "data" in result) {
      return result;
    }
    return result;
  },
});
