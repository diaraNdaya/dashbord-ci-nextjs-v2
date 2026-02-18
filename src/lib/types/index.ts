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

export type SalesData = {
  date: string;
  ventes: number;
  commandes: number;
};

export type TopProductsData = {
  produit: string;
  ventes: number;
  revenus: number;
};

export type UsersData = {
  day: string;
  nouveaux: number;
  total: number;
};

export interface CustomerSearchParams {
  name?: string;
  city?: string;
}

export interface SellerSearchParams {
  store_name?: string;
  business_address?: string;
}

export interface userBlockedDataResponse {
  success: boolean;
  message: string;
  data: userBlockedData[];
  totalItems: number;
  totalPages: number;
  limit: number;
  page: number;
}
export interface userBlockedData {
  id: string;
  email: string;
  username: string;
  phone_number: string;
  city: string;
  country: string;
  dateOfBirth: string;
  is_active: boolean;
  isVendor: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  provider: string;
  socialId?: any;
  password_hash: string;
  clientStripeId: string;
  status: boolean;
  role_Id: string;
  createdAt: string;
  updatedAt: string;
  Customers: Customers;
  Seller: Seller;
}

export interface Seller {
  id: string;
  user_id: string;
  store_name: string;
  business_address: string;
  company_logo: string;
  subscriptions: number;
  subscribes: number;
  likes: number;
  isVerified: boolean;
  createdAt: string;
  status: boolean;
  cover_url: string;
  updatedAt: string;
  is_ADV: string;
}

export interface Customers {
  id: string;
  user_id: string;
  address: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
}
