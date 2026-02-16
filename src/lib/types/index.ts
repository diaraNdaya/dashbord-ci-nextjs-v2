import { User } from "./user.type";
export interface Customer {
  id: string;
  user_id: string;
  address: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  user: User;
}
export interface Seller {
  id: string;
  user_id: string;
  store_name: string;
  business_address: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  company_logo?: any;
  subscriptions: number;
  subscribes: number;
  likes: number;
  isVerified: boolean;
  createdAt: string;
  status: boolean;
  updatedAt: string;
  user: User;
}

export interface CustomersApiResponse {
  success: boolean;
  message: string;
  data: Customer[];
  totalItems: number;
  totalPage: number;
  page: number;
  limit: number;
}
export interface SellersApiResponse {
  success: boolean;
  message: string;
  data: Seller[];
  totalItems: number;
  limit: number;
  totalPages: number;
  page: number;
}
