import type { Customer, Seller } from "@/lib/types/index";

export interface CustomerDetailApiResponse {
  success?: boolean;
  message?: string;
  customer?: Customer;
  data?: Customer;
}

export interface SellerDetailApiResponse {
  success?: boolean;
  message?: string;
  seller?: Seller;
  data?: Seller;
}
