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
    if (result.success) {
      return result;
    }
    throw new Error(
      result.message || "Erreur lors de la récupération des commissions",
    );
  },
});

// Query options pour récupérer la commission globale
export const getCommissionGlobaleQueryOptions = () => ({
  queryKey: ["commissions", "globale"] as const,
  queryFn: async () => {
    const result = await getCommissionGlobaleAction();
    if (result.success) {
      return result;
    }
    throw new Error(
      result.message ||
        "Erreur lors de la récupération de la commission globale",
    );
  },
});

// Query options pour récupérer la configuration de commission
export const getCommissionConfigQueryOptions = () => ({
  queryKey: ["commissions", "config"] as const,
  queryFn: async () => {
    const result = await getCommissionConfigAction();
    if (result.success) {
      return result;
    }
    throw new Error(
      result.message || "Erreur lors de la récupération de la configuration",
    );
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
    if (result.success) {
      return result;
    }
    throw new Error(
      result.message || "Erreur lors de la récupération de l'évolution",
    );
  },
});

// Query options pour récupérer les commissions d'un vendeur
export const getCommissionsBySellerIdQueryOptions = (
  id: string,
  page: number,
  limit: number,
) => ({
  queryKey: ["commissions", "seller", id, page, limit] as const,
  queryFn: async () => {
    const result = await getCommissionsBySellerIdAction(id, page, limit);
    if (result.success) {
      return result;
    }
    throw new Error(
      result.message ||
        "Erreur lors de la récupération des commissions du vendeur",
    );
  },
});

// Query options pour récupérer tous les documents
export const getAllDocumentsQueryOptions = (page: number, limit: number) => ({
  queryKey: ["documents", page, limit] as const,
  queryFn: async () => {
    const result = await getAllDocumentsAction(page, limit);
    if (result.success) {
      return result;
    }
    throw new Error(
      result.message || "Erreur lors de la récupération des documents",
    );
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
    if (result.success) {
      return result;
    }
    throw new Error(
      result.message || "Erreur lors de la récupération des vendeurs vérifiés",
    );
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
    if (result.success) {
      return result;
    }
    throw new Error(
      result.message || "Erreur lors de la récupération des clients vérifiés",
    );
  },
});

// Query options pour récupérer les vendeurs supprimés
export const getDeletedSellersQueryOptions = (page: number, limit: number) => ({
  queryKey: ["sellers", "deleted", page, limit] as const,
  queryFn: async () => {
    const result = await getDeletedSellersAction(page, limit);
    if (result.success) {
      return result;
    }
    throw new Error(
      result.message || "Erreur lors de la récupération des vendeurs supprimés",
    );
  },
});

// Query options pour récupérer le nombre de commissions
export const getCommissionCountQueryOptions = () => ({
  queryKey: ["commissions", "count"] as const,
  queryFn: async () => {
    const result = await getCommissionCountAction();
    if (result.success) {
      return result;
    }
    throw new Error(
      result.message ||
        "Erreur lors de la récupération du nombre de commissions",
    );
  },
});

// Mutation options pour créer une commission
export const createCommissionMutationOptions = () => ({
  mutationFn: async (data: CommissionCreateData) => {
    console.log("rate", data);
    const result = await createCommissionAction(data);
    if (result.success) {
      return result;
    }
    throw new Error(
      result.message || "Erreur lors de la création de la commission",
    );
  },
});

// Mutation options pour mettre à jour une commission
export const updateCommissionMutationOptions = () => ({
  mutationFn: async (data: CommissionUpdateData) => {
    console.log("rate", data);
    const result = await updateCommissionAction(data);
    if (result.success) {
      return result;
    }
    throw new Error(
      result.message || "Erreur lors de la mise à jour de la commission",
    );
  },
});

// Mutation options pour supprimer une commission
export const deleteCommissionMutationOptions = () => ({
  mutationFn: async ({ id }: { id: string }) => {
    const result = await deleteCommissionAction(id);
    if (result.success) {
      return result;
    }
    throw new Error(
      result.message || "Erreur lors de la suppression de la commission",
    );
  },
});

// Mutation options pour valider un document
export const validateDocumentMutationOptions = () => ({
  mutationFn: async ({ id, statut }: { id: string; statut: string }) => {
    const result = await validateDocumentAction(id, statut);
    if (result.success) {
      return result;
    }
    throw new Error(
      result.message || "Erreur lors de la validation du document",
    );
  },
});
