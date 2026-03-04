export interface CreateBannerCredential {
  file_path: string;
  description: string;
  provider: "BANNER";
  productLink?: string;
}

// Votre réponse personnalisée pour la liste des banners
export interface BannerResponse {
  success: boolean;
  message?: string;
  data: Banner[];
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}

// Réponse pour l'upload de fichier
export interface UploadFileResponse {
  success: boolean;

  url: string;
}

export interface Banner {
  id: string;
  user_Id: string;
  file_path: string;
  description: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
  user?: BannerUser;
}

export interface BannerUser {
  id: string;
  email: string;
  username: string;
  phone_number: string | null;
  city: string;
  country: string;
  dateOfBirth: string;
  is_active: boolean;
  isVendor: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  provider: string;
  socialId: string | null;
  password_hash: string;
  clientStripeId: string;
  status: boolean;
  role_Id: string;
  createdAt: string;
  updatedAt: string;
}
