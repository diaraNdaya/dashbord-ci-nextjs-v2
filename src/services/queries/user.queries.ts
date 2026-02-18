import type {
  CustomerSearchParams,
  SellerSearchParams,
} from "@/lib/types/user.type";
import {
  getAllDocumentsAction,
  getAllVerifiedCustomersAction,
  getAllVerifiedSellersAction,
  validateDocumentAction,
} from "@/services/actions/document.actions";
import { fetchOrdersAction } from "@/services/actions/orders.actions";
import {
  blockUserAction,
  fetchSellersAction,
  fetchTopSellersAction,
  fetchUsersAction,
  fetchUsersBlockedAction,
} from "@/services/actions/user.actions";

// Queries pour les clients
export const fetchUsersQueryOptions = (
  page: number,
  limit: number,
  searchParams?: CustomerSearchParams,
) => ({
  queryKey: ["users", page, limit, searchParams] as const,
  queryFn: async () => {
    const result = await fetchUsersAction(page, limit, searchParams);
    if (result.success) {
      return result.data;
    }
    throw new Error(
      result.error.message || "Erreur lors de la récupération des utilisateurs",
    );
  },
});

// Queries pour les vendeurs
export const fetchSellersQueryOptions = (
  page: number,
  limit: number,
  searchParams?: SellerSearchParams,
) => ({
  queryKey: ["sellers", page, limit, searchParams] as const,
  queryFn: async () => {
    const result = await fetchSellersAction(page, limit, searchParams);
    if (result.success) {
      return result.data;
    }
    throw new Error(
      result.error.message || "Erreur lors de la récupération des vendeurs",
    );
  },
});

export const fetchTopSellersQueryOptions = () => ({
  queryKey: ["sellers", "top"] as const,
  queryFn: async () => {
    const result = await fetchTopSellersAction();
    if (result.success) {
      return result.data;
    }
    throw new Error(
      result.error.message || "Erreur lors de la récupération des top vendeurs",
    );
  },
});

// Queries pour les commandes
export const fetchOrdersQueryOptions = (page: number, limit: number) => ({
  queryKey: ["orders", page, limit] as const,
  queryFn: async () => {
    const result = await fetchOrdersAction(page, limit);
    if (result.success) {
      return result.data;
    }
    throw new Error(
      result.error.message || "Erreur lors de la récupération des commandes",
    );
  },
});

// Queries pour les utilisateurs bloqués
export const fetchUsersBlockedQueryOptions = (page: number, limit: number) => ({
  queryKey: ["users", "blocked", page, limit] as const,
  queryFn: async () => {
    const result = await fetchUsersBlockedAction(page, limit);
    if (result.success) {
      return result.data;
    }
    throw new Error(
      result.error.message ||
        "Erreur lors de la récupération des utilisateurs bloqués",
    );
  },
});

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
export const blockUserMutationOptions = () => ({
  mutationFn: blockUserAction,
});

export const validateDocumentMutationOptions = () => ({
  mutationFn: ({ id, statut }: { id: string; statut: string }) =>
    validateDocumentAction(id, statut),
});
