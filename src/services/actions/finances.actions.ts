"use server";

import { serverRequest } from "@/services/server/axios-server.server";
import { safeAction } from "@/services/server/safe-action.server";
import { endpoints } from "../endpoints";

// Types pour les réponses financières
interface CommissionGlobaleResponse {
  success: boolean;
  message: string;
  data: {
    commission: number;
    tva?: number;
    total?: number;
  };
}

interface TransactionsResponse {
  success: boolean;
  message: string;
  data: {
    transactions: Array<{
      id: string;
      amount: number;
      type: string;
      status: string;
      createdAt: string;
      user?: {
        name: string;
        email: string;
      };
    }>;
    totalItems: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

interface CommissionEvolutionResponse {
  success: boolean;
  message: string;
  data: Array<{
    date: string;
    commission: number;
    transactions: number;
  }>;
}

interface CommissionSellersResponse {
  success: boolean;
  message: string;
  data: Array<{
    id: string;
    seller_name: string;
    commission_amount: number;
    total_sales: number;
    commission_rate: number;
    createdAt: string;
  }>;
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
}

// Actions pour récupérer les données financières
export async function getCommissionGlobaleAction() {
  return safeAction<CommissionGlobaleResponse>(async () => {
    return serverRequest<CommissionGlobaleResponse>(
      endpoints.DASHBOARD.getCommissionGlobale(),
      {
        method: "GET",
      },
    );
  });
}

export async function getTransactionsAction(
  period: string,
  date: string,
  page: number,
  limit: number,
  search?: string,
) {
  return safeAction<TransactionsResponse>(async () => {
    return serverRequest<TransactionsResponse>(
      endpoints.DASHBOARD.getTransactions(period, date, page, limit, search),
      {
        method: "GET",
      },
    );
  });
}

export async function getCommissionEvolutionAction(
  period: string,
  date: string,
) {
  return safeAction<CommissionEvolutionResponse>(async () => {
    return serverRequest<CommissionEvolutionResponse>(
      endpoints.DASHBOARD.getCommissionEvolution(period, date),
      {
        method: "GET",
      },
    );
  });
}

export async function getCommissionSellersAction(page: number, limit: number) {
  return safeAction<CommissionSellersResponse>(async () => {
    return serverRequest<CommissionSellersResponse>(
      endpoints.DASHBOARD.getCommissionsSellers(page, limit),
      {
        method: "GET",
      },
    );
  });
}

export async function getCommissionSellerByIdAction(
  id: string,
  page: number,
  limit: number,
) {
  return safeAction<CommissionSellersResponse>(async () => {
    return serverRequest<CommissionSellersResponse>(
      endpoints.DASHBOARD.getCommissionsSellersById(id, page, limit),
      {
        method: "GET",
      },
    );
  });
}
