import type {
  CategoryCredentials,
  CategorySearchParams,
  CategoryUpdateParams,
  SubcategoryCredentials,
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

export const getAllCategoriesQueryOptions = (
  page: number,
  limit: number,
  searchParams?: CategorySearchParams,
) => ({
  queryKey: ["categories", page, limit, searchParams] as const,
  queryFn: async () => {
    const result = await getAllCategoriesAction(page, limit, searchParams);
    if (result.success) {
      return result;
    }
    throw new Error(
      result.message || "Erreur lors de la récupération des catégories",
    );
  },
});

export const getAllSubCategoriesQueryOptions = (
  page: number,
  limit: number,
  searchParams?: SubcategorySearchParams,
) => ({
  queryKey: ["subcategories", page, limit, searchParams] as const,
  queryFn: async () => {
    const result = await getAllSubCategoriesAction(page, limit, searchParams);
    if (result.success) {
      return result;
    }
    throw new Error(
      result.message || "Erreur lors de la récupération des sous-catégories",
    );
  },
});

export const createCategoryMutationOptions = () => ({
  mutationFn: (data: CategoryCredentials) => createCategoryAction(data),
});

export const updateCategoryMutationOptions = () => ({
  mutationFn: ({ id, data }: { id: string; data: CategoryUpdateParams }) =>
    updateCategoryAction(id, data),
});
export const deleteCategoryMutationOptions = () => ({
  mutationFn: ({ id }: { id: string }) => deleteCategoryAction(id),
});

export const createSubCategoryMutationOptions = () => ({
  mutationFn: (data: SubcategoryCredentials) => createSubCategoryAction(data),
});
export const updateSubCategoryMutationOptions = () => ({
  mutationFn: ({ id, data }: { id: string; data: SubcategoryUpdateParams }) =>
    updateSubCategoryAction(id, data),
});

export const deleteSubCategoryMutationOptions = () => ({
  mutationFn: ({ id }: { id: string }) => deleteSubCategoryAction(id),
});

export const uploadFileMutationOptions = () => ({
  mutationFn: ({ file }: { file: File }) => uploadFileAction(file),
});
