import { ApiResponse } from "@/services/api.type";

// Interface pour une catégorie
export interface Category {
  id: string;
  name: string;
  description: string;
  url: string;
  images: string[];
  slug: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

// Interface pour une sous-catégorie
export interface Subcategory {
  id: string;
  name: string;
  description: string;
  url: string;
  type: string;
  category_id: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

// Réponses API pour les catégories
export interface CategoryApiResponse {
  success: boolean;
  message: string;
  data: Category[];
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
}

// Réponses API pour les sous-catégories
export interface SubcategoryApiResponse {
  success: boolean;
  message: string;
  data: Subcategory[];
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
}

// Credentials pour créer une catégorie
export interface CategoryCredentials {
  name: string;
  description: string;
  url: string;
  images: string[];
  type?: string;
}

// Credentials pour créer une sous-catégorie
export interface SubcategoryCredentials {
  name: string;
  description: string;
  url: string;
  type: string;
  category_id: string;
}

// Types pour les paramètres de mise à jour
export interface CategoryUpdateParams {
  name: string;
  description: string;
  url: string;
  images: string[];
}

export interface SubcategoryUpdateParams {
  name: string;
  description: string;
  type: string;
  url: string;
  category_id?: string;
}

// Types pour les paramètres de recherche
export interface SubcategorySearchParams {
  search?: string;
}

// Type pour les réponses de création
export interface CategoryCreateResponse extends ApiResponse<{ id: string }> {}

// Type pour les réponses de suppression
export interface CategoryDeleteResponse extends ApiResponse<unknown> {}

// Type pour l'upload de fichiers
export interface FileUploadResponse {
  url: string;
}
