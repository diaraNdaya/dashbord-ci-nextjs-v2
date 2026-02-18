import { ApiResponse } from "@/services/api.type";
import { Customer } from "./index";
import { Seller } from "./products.types";

interface Admins {
  id: string;
  user_id: string;
  permissions: boolean;
  admin_level: number;
  createdAt: string;
  updatedAt: string;
}

interface Role {
  id: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  phone_number?: any;
  city: string;
  country: string;
  dateOfBirth: string;
  is_active: boolean;
  isVendor: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  provider: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socialId?: any;
  password_hash: string;
  clientStripeId: string;
  status: boolean;
  role_Id: string;
  createdAt: string;
  updatedAt: string;
  role: Role;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ConnectInfo?: any;
  Seller?: Seller;
  Customers?: Customer;
  Admins: Admins;
}
export interface OtpCredentials {
  email: string;
  fullName: string;
  phone_number: string;
  dateOfBirth: string;
  country: string;
  city: string;
  isVendor: boolean;
  password_hash: string;
}

export interface VerifyOtpCredentials {
  otp: string;
  key: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface VerifyOtpResponse extends ApiResponse<any> {
  accessToken: string;
  refreshToken: string;
}

enum Roles {
  SELLER = "SELLER",
  CUSTOMER = "CUSTOMER",
}
export interface changeRoleCredentials {
  role: "SELLER" | "CUSTOMER";
  userId: string;
}

export const loginCredential = {
  username: "",
  password: "",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface LoginResponse extends ApiResponse<any> {
  user: User;
  accessToken: string;
  refreshToken: string;
  success?: boolean;
  keys?: string;
  message?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface OptResponse extends ApiResponse<any> {
  keys: string;
}

export interface Profile extends User {
  Admins: Admins;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ProfileResponse extends ApiResponse<any> {
  user: Profile;
}

export interface changePassword {
  oldPassword: string;
  newPassword: string;
}

export interface updateProfileCredentials {
  username: string;
  phone_number: string;
  dateOfBirth: string;
  country: string;
  city: string;
  fullName: string;
}

export interface ResetPasswordCredentials {
  new_password: string;
  confirmPassword: string;
}
// Types pour les paramètres de recherche
export interface CustomerSearchParams {
  name?: string;
  city?: string;
}

export interface SellerSearchParams {
  store_name?: string;
  business_address?: string;
}

// Types pour les réponses des documents et validations
export interface DocumentsResponse {
  success: boolean;
  message: string;
  data: unknown[];
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface ValidationResponse {
  success: boolean;
  message: string;
  data: unknown;
}
