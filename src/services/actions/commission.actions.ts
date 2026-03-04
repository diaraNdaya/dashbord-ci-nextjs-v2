"use server";

import type {
  CommissionDataBySellerResponse,
  CommissionEvolution,
  CommissionRule,
  CommissionsSellersApiResponse,
  CountCommissionDataResponse,
} from "@/lib/types/commissions.types";
import { serverRequest } from "@/services/server/axios-server.server";
import { safeAction } from "@/services/server/safe-action.server";
import { endpoints } from "../endpoints";

// Types pour les paramètres de recherche
export interface CommissionSearchParams {
  store_name?: string;
  business_address?: string;
}

// Types pour les données de commission
export interface CommissionCreateData {
  rate: number;
}

export interface CommissionUpdateData {
  rate: number;
}

export interface CommissionGlobaleData {
  status: string;
  commission: number;
  tva: number;
}

// Types pour les réponses API
export interface DocumentResponse {
  success: boolean;
  message: string;
  data: Document[];
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SellersApiResponse {
  success: boolean;
  message: string;
  data: Seller[];
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CustomersApiResponse {
  success: boolean;
  message: string;
  data: Customer[];
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Document {
  id: string;
  type: string;
  url: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Seller {
  id: string;
  user_id: string;
  store_name: string;
  business_address: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  user_id: string;
  name: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

// Action pour récupérer les commissions des vendeurs avec recherche
export async function getCommissionsSellersAction(
  page: number,
  limit: number,
  searchParams?: CommissionSearchParams,
) {
  return safeAction<CommissionsSellersApiResponse>(async () => {
    let url = endpoints.DASHBOARD.getCommissionsSellers(page, limit);

    if (searchParams) {
      const params = new URLSearchParams();
      if (searchParams.store_name && searchParams.store_name.trim() !== "") {
        params.append("store_name", searchParams.store_name.trim());
      }
      if (
        searchParams.business_address &&
        searchParams.business_address.trim() !== ""
      ) {
        params.append("business_address", searchParams.business_address.trim());
      }
      const paramString = params.toString();
      if (paramString) {
        url += `&${paramString}`;
      }
    }

    return serverRequest<CommissionsSellersApiResponse>(url, {
      method: "GET",
    });
  });
}

// Action pour créer une commission
export async function createCommissionAction(data: CommissionCreateData) {
  return safeAction<CommissionRule>(async () => {
    return serverRequest<CommissionRule>(
      endpoints.DASHBOARD.createCommission(),
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  });
}

// Action pour mettre à jour une commission
export async function updateCommissionAction(data: CommissionUpdateData) {
  return safeAction<CommissionRule>(async () => {
    return serverRequest<CommissionRule>(
      endpoints.DASHBOARD.createCommission(),
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  });
}

// Action pour supprimer une commission
export async function deleteCommissionAction(commissionId: string) {
  return safeAction<{ success: boolean; message: string }>(async () => {
    return serverRequest<{ success: boolean; message: string }>(
      endpoints.DASHBOARD.deleteCommission(commissionId),
      {
        method: "DELETE",
      },
    );
  });
}

// Action pour récupérer la configuration de commission
export async function getCommissionConfigAction() {
  return safeAction<CommissionRule>(async () => {
    return serverRequest<CommissionRule>(
      endpoints.DASHBOARD.configCommission(),
      {
        method: "GET",
      },
    );
  });
}

// Action pour récupérer la commission globale
export async function getCommissionGlobaleAction() {
  return safeAction<CommissionGlobaleData>(async () => {
    return serverRequest<CommissionGlobaleData>(
      endpoints.DASHBOARD.getCommissionGlobale(),
      {
        method: "GET",
      },
    );
  });
}

// Action pour récupérer l'évolution des commissions
export async function getCommissionEvolutionAction(
  period: string,
  date: string,
) {
  return safeAction<CommissionEvolution | CommissionEvolution[]>(async () => {
    const response = await serverRequest<{
      data: CommissionEvolution | CommissionEvolution[];
    }>(endpoints.DASHBOARD.getCommissionEvolution(period, date), {
      method: "GET",
    });

    // Gestion spéciale pour l'évolution des commissions
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data;
    } else {
      return response.data;
    }
  });
}

// Action pour récupérer tous les documents
export async function getAllDocumentsAction(page: number, limit: number) {
  return safeAction<DocumentResponse>(async () => {
    return serverRequest<DocumentResponse>(
      endpoints.DASHBOARD.getAllDocument(page, limit),
      {
        method: "GET",
      },
    );
  });
}

// Action pour récupérer les vendeurs vérifiés
export async function getAllVerifiedSellersAction(
  page: number,
  limit: number,
  statut: string,
) {
  return safeAction<SellersApiResponse>(async () => {
    return serverRequest<SellersApiResponse>(
      endpoints.DASHBOARD.sellersVerified(page, limit, statut),
      {
        method: "GET",
      },
    );
  });
}

// Action pour récupérer les clients vérifiés
export async function getAllVerifiedCustomersAction(
  page: number,
  limit: number,
  statut: string,
) {
  return safeAction<CustomersApiResponse>(async () => {
    return serverRequest<CustomersApiResponse>(
      endpoints.DASHBOARD.customersVerified(page, limit, statut),
      {
        method: "GET",
      },
    );
  });
}

// Action pour valider un document
export async function validateDocumentAction(id: string, statut: string) {
  return safeAction<{ success: boolean; message: string }>(async () => {
    return serverRequest<{ success: boolean; message: string }>(
      endpoints.DASHBOARD.validateDocument(id),
      {
        method: "PUT",
        body: JSON.stringify({ statut }),
      },
    );
  });
}

// Action pour récupérer les commissions d'un vendeur par ID
export async function getCommissionsBySellerIdAction(
  id: string,
  page: number,
  limit: number,
) {
  return safeAction<CommissionDataBySellerResponse>(async () => {
    return serverRequest<CommissionDataBySellerResponse>(
      endpoints.DASHBOARD.getCommissionsSellersById(id, page, limit),
      {
        method: "GET",
      },
    );
  });
}

// Action pour récupérer les vendeurs supprimés
export async function getDeletedSellersAction(page: number, limit: number) {
  return safeAction<SellersApiResponse>(async () => {
    return serverRequest<SellersApiResponse>(
      endpoints.DASHBOARD.getUsersDeleted(page, limit),
      {
        method: "GET",
      },
    );
  });
}

// Action pour récupérer le nombre total de commissions
export async function getCommissionCountAction() {
  return safeAction<CountCommissionDataResponse>(async () => {
    return serverRequest<CountCommissionDataResponse>(
      endpoints.DASHBOARD.getCountCommissionSellers(),
      {
        method: "GET",
      },
    );
  });
}
