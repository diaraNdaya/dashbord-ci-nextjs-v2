export interface CreateDeliveryCredential {
  fullName: string;
  username: string;
  email: string;
  address: string;
  phone: string;
  role: "DELIVERY";
  password: string;
  confirmPassword: string;
}

export interface createDeliveryResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
}

export interface DeliveryRole {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryUser {
  id: string;
  fullName: string;
  username: string;
  address: string;
  dateOfBirth?: string | null;
  createdAt: string;
  updatedAt: string;
  phone: string;
  email: string;
  numberPermis?: string | null;
  numberCarteGrise: string;
  numberAssurance: string;
  numberAssuranceDate?: string | null;
  numberCarteGriseDate?: string | null;
  numberPermisDate?: string | null;
  numberMatricule: string;
  numberMatriculeDate?: string | null;
  role: DeliveryRole;
}

export interface DeliveryApiResponse {
  success: boolean;
  message: string;
  data: DeliveryUser[];
  totalItems?: number;
  limit?: number;
  totalPages?: number;
  page?: number;
}
