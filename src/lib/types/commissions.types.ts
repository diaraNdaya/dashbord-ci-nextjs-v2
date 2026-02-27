import { Order } from "./orders.type";
import { Product, Seller } from "./products.types";

export type CommissionRule = {
  id: string;
  rate: number;
  createdAt: string;
  updatedAt: string;
};

export interface CommissionsSellers {
  id: string;
  seller_Id: string;
  commission: number;
  commission_Id: string;
  createdAt: string;
  updatedAt: string;
  seller: Seller;
  commissionRate: CommissionRate;
}

interface CommissionRate {
  id: string;
  rate: number;
  createdAt: string;
  updatedAt: string;
}

export interface CommissionsSellersApiResponse {
  success: boolean;
  message: string;
  data: CommissionsSellers[];
  totalItems: number;
  limit: number;
  totalPages: number;
  page: number;
}

export interface CountCommissionResponse {
  success: boolean;
  message: string;
  data: number;
}

export interface CountCommissionDataResponse {
  success: boolean;
  message: string;
  data: CountCommissionData;
}

interface CountCommissionData {
  success: boolean;
  totalCommission: number;
}

export interface CommissionEvolution {
  period: string;
  total: number;
  tva: number;
  net: number;
}

export interface CommissionEvolutionResponse {
  success: boolean;
  message: string;
  data: CommissionEvolution;
}

export interface CommissionDataBySeller {
  id: string;
  seller_Id: string;
  product_Id: string;
  quantity: number;
  totalPrice: number;
  order_Id: string;
  commissionRate: number;
  commission: number;
  createdAt: string;
  updatedAt: string;
  seller: Seller;
  product: Product;
  order: Order;
}

export interface CommissionDataBySellerResponse {
  success: boolean;
  message: string;
  data: CommissionDataBySeller[];
  totalItems: number;
  limit: number;
  totalPages: number;
  page: number;
}
