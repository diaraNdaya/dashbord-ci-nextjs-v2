"use server";

import type {
  CategoryApiResponse,
  CategoryCreateResponse,
  CategoryCredentials,
  CategoryDeleteResponse,
  CategoryUpdateParams,
  FileUploadResponse,
  SubcategoryApiResponse,
  SubcategoryCredentials,
  SubcategorySearchParams,
  SubcategoryUpdateParams,
} from "@/lib/types/categories.types";
import { serverRequest } from "@/services/server/axios-server.server";
import { safeAction } from "@/services/server/safe-action.server";
import { endpoints } from "../endpoints";

export async function getAllCategoriesAction(page: number, limit: number) {
  return safeAction<CategoryApiResponse>(async () => {
    return serverRequest<CategoryApiResponse>(
      endpoints.CATEGORY.allCategory(page, limit),
      {
        method: "GET",
      },
    );
  });
}

export async function createCategoryAction(data: CategoryCredentials) {
  return safeAction<CategoryCreateResponse>(async () => {
    return serverRequest<CategoryCreateResponse>(
      endpoints.CATEGORY.createCategory(),
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  });
}

export async function updateCategoryAction(
  id: string,
  data: CategoryUpdateParams,
) {
  return safeAction<CategoryDeleteResponse>(async () => {
    return serverRequest<CategoryDeleteResponse>(
      endpoints.CATEGORY.updateCategory(id),
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
    );
  });
}

export async function deleteCategoryAction(id: string) {
  return safeAction<CategoryDeleteResponse>(async () => {
    return serverRequest<CategoryDeleteResponse>(
      endpoints.CATEGORY.deleteCategorie(id),
      {
        method: "DELETE",
      },
    );
  });
}

// Actions pour les sous-catégories
export async function getAllSubCategoriesAction(
  page: number,
  limit: number,
  searchParams?: SubcategorySearchParams,
) {
  return safeAction<SubcategoryApiResponse>(async () => {
    let url = endpoints.SUBCATEGORY.allSubcategory(page, limit);

    if (searchParams?.search) {
      url = `${url}&search=${searchParams.search}`;
    }

    return serverRequest<SubcategoryApiResponse>(url, {
      method: "GET",
    });
  });
}

export async function createSubCategoryAction(data: SubcategoryCredentials) {
  return safeAction<SubcategoryApiResponse>(async () => {
    return serverRequest<SubcategoryApiResponse>(
      endpoints.SUBCATEGORY.createSubcategory(),
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  });
}

export async function updateSubCategoryAction(
  id: string,
  data: SubcategoryUpdateParams,
) {
  return safeAction<CategoryDeleteResponse>(async () => {
    return serverRequest<CategoryDeleteResponse>(
      endpoints.CATEGORY.updateSubCategory(id),
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
    );
  });
}

export async function deleteSubCategoryAction(id: string) {
  return safeAction<CategoryDeleteResponse>(async () => {
    return serverRequest<CategoryDeleteResponse>(
      endpoints.CATEGORY.deleteSubcategory(id),
      {
        method: "DELETE",
      },
    );
  });
}

// Action pour l'upload de fichiers
export async function uploadFileAction(file: File) {
  return safeAction<FileUploadResponse>(async () => {
    const formData = new FormData();
    formData.append("file", file);

    return serverRequest<FileUploadResponse>(
      endpoints.DATARESSORCES.uploadFile(),
      {
        method: "POST",
        body: formData,
      },
      { tokenCookieName: "accessToken" },
    );
  });
}
