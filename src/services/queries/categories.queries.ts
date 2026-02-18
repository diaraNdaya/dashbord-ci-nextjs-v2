import type {
  CategoryUpdateParams,
  SubcategorySearchParams,
  SubcategoryUpdateParams,
} from "@/lib/types/categories.types";
import {
  createCategoryAction,
  createSubCategoryAction,
  deleteCategoryAction,
  deleteSubCategoryAction,
  getAllCategoriesAction,
  getAllSubCategoriesAction,
  updateCategoryAction,
  updateSubCategoryAction,
  uploadFileAction,
} from "@/services/actions/categories.actions";

// Queries pour les catégories
export const getAllCategoriesQueryOptions = (page: number, limit: number) => ({
  queryKey: ["categories", page, limit] as const,
  queryFn: async () => {
    const result = await getAllCategoriesAction(page, limit);
    if (result.success) {
      return result.data;
    }
    throw new Error(
      result.error.message || "Erreur lors de la récupération des catégories",
    );
  },
});

// Queries pour les sous-catégories
export const getAllSubCategoriesQueryOptions = (
  page: number,
  limit: number,
  searchParams?: SubcategorySearchParams,
) => ({
  queryKey: ["subcategories", page, limit, searchParams] as const,
  queryFn: async () => {
    const result = await getAllSubCategoriesAction(page, limit, searchParams);
    if (result.success) {
      return result.data;
    }
    throw new Error(
      result.error.message ||
        "Erreur lors de la récupération des sous-catégories",
    );
  },
});

// Mutations pour les catégories
export const createCategoryMutationOptions = () => ({
  mutationFn: createCategoryAction,
});

export const updateCategoryMutationOptions = () => ({
  mutationFn: ({ id, data }: { id: string; data: CategoryUpdateParams }) =>
    updateCategoryAction(id, data),
});

export const deleteCategoryMutationOptions = () => ({
  mutationFn: deleteCategoryAction,
});

// Mutations pour les sous-catégories
export const createSubCategoryMutationOptions = () => ({
  mutationFn: createSubCategoryAction,
});

export const updateSubCategoryMutationOptions = () => ({
  mutationFn: ({ id, data }: { id: string; data: SubcategoryUpdateParams }) =>
    updateSubCategoryAction(id, data),
});

export const deleteSubCategoryMutationOptions = () => ({
  mutationFn: deleteSubCategoryAction,
});

// Mutation pour l'upload de fichiers
export const uploadFileMutationOptions = () => ({
  mutationFn: uploadFileAction,
});
