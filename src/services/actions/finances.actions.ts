"use server";

import { serverRequest } from "@/services/server/axios-server.server";
import { safeAction } from "@/services/server/safe-action.server";
import { endpoints } from "../endpoints";

// Types pour les données financières (sans wrapper de réponse)
interface CommissionGlobaleData {
  commission: number;
  tva?: number;
  total?: number;
}

export interface TransactionsApiResponse {
  success: boolean;
  message: string;
  data: {
    success: boolean;
    data: Transaction[];
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface CommissionEvolutionData {
  date: string;
  commission: number;
  transactions: number;
}

interface CommissionSellersData {
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

export interface Transaction {
  id: string;
  orders_id: string;
  customer_id: string;
  payment_method: string;
  amount: number;
  payment_status: string;
  provider: string;
  currency: string;
  payment_date: string;
  paymentStripeId: string;
  stripeCustomerId: string;
  paidAt: string;
  phonePaid: string;
  paymentIntentId: string;
  failureReason: string;
  createdAt: string;
  reference: string;
  operator: string;
  transactionId: string;
  updatedAt: string;
  customer: Customer;
  Orders: Order[];
}

interface Order {
  id: string;
  customer_Id: string;
  orderDate: string;
  statut: string;
  payment_Id: string;
  shippingMethodId: string;
  shippingMethod: string;
  shippingDate: string;
  quantity: number;
  totalAmount: number;
  address_id: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
  userId?: string | null;
}

interface Customer {
  id: string;
  user_id: string;
  address: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
}

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

export async function getTransactionsAction(
  period: string,
  date: string,
  page: number,
  limit: number,
  search?: string,
) {
  return safeAction<TransactionsApiResponse>(async () => {
    return serverRequest<TransactionsApiResponse>(
      endpoints.PAYMENT.allPayment(period, date, page, limit, search),
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
  return safeAction<CommissionEvolutionData[]>(async () => {
    return serverRequest<CommissionEvolutionData[]>(
      endpoints.DASHBOARD.getCommissionEvolution(period, date),
      {
        method: "GET",
      },
    );
  });
}

export async function getCommissionSellersAction(page: number, limit: number) {
  return safeAction<CommissionSellersData>(async () => {
    return serverRequest<CommissionSellersData>(
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
  return safeAction<CommissionSellersData>(async () => {
    return serverRequest<CommissionSellersData>(
      endpoints.DASHBOARD.getCommissionsSellersById(id, page, limit),
      {
        method: "GET",
      },
    );
  });
}
