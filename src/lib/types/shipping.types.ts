export interface ShippingMethodCredentials {
  name: string;
  price: number;
  description: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  active: boolean;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShippingMethodsApiResponse {
  success: boolean;
  message?: string;
  data: ShippingMethod[];
  totalItems?: number;
  limit?: number;
  totalPages?: number;
  page?: number;
}

export interface ShippingMethodApiResponse {
  success: boolean;
  message?: string;
  data: ShippingMethod;
}
