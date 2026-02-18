import {
  getAllDocumentsAction,
  getAllVerifiedCustomersAction,
  getAllVerifiedSellersAction,
  validateDocumentAction,
} from "@/services/actions/document.actions";

// Queries pour les documents
export const getAllDocumentsQueryOptions = (page: number, limit: number) => ({
  queryKey: ["documents", page, limit] as const,
  queryFn: async () => {
    const result = await getAllDocumentsAction(page, limit);
    if (result.success) {
      return result.data;
    }
    throw new Error(
      result.error.message || "Erreur lors de la récupération des documents",
    );
  },
});

export const getAllVerifiedSellersQueryOptions = (
  page: number,
  limit: number,
  statut: string,
) => ({
  queryKey: ["sellers", "verified", page, limit, statut] as const,
  queryFn: async () => {
    const result = await getAllVerifiedSellersAction(page, limit, statut);
    if (result.success) {
      return result.data;
    }
    throw new Error(
      result.error.message ||
        "Erreur lors de la récupération des vendeurs vérifiés",
    );
  },
});

export const getAllVerifiedCustomersQueryOptions = (
  page: number,
  limit: number,
  statut: string,
) => ({
  queryKey: ["customers", "verified", page, limit, statut] as const,
  queryFn: async () => {
    const result = await getAllVerifiedCustomersAction(page, limit, statut);
    if (result.success) {
      return result.data;
    }
    throw new Error(
      result.error.message ||
        "Erreur lors de la récupération des clients vérifiés",
    );
  },
});

// Mutations
export const validateDocumentMutationOptions = () => ({
  mutationFn: ({ id, statut }: { id: string; statut: string }) =>
    validateDocumentAction(id, statut),
});
