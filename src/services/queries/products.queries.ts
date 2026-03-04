import type {
  ProductApiResponse,
  ProductBySellerParams,
  ProductsApiResponse,
  UpdateProductCredentials,
} from "@/lib/types/products.types";
import {
  blockedProductAction,
  breakProductAction,
  deleteProductAction,
  getAllProductsAction,
  getOneProductAction,
  getProductBySellerAction,
  getTopProductsAction,
  updateProductAction,
} from "@/services/actions/products.actions";

// Queries pour les produits
export const getAllProductsQueryOptions = (page: number, limit: number) => ({
  queryKey: ["products", page, limit] as const,
  queryFn: async (): Promise<ProductsApiResponse> => {
    const result = await getAllProductsAction(page, limit);
    if (
      result &&
      typeof result === "object" &&
      "success" in result &&
      result.success
    ) {
      return result as ProductsApiResponse;
    }
    const errorMessage =
      result && typeof result === "object" && "message" in result
        ? result.message
        : "Erreur lors de la récupération des produits";
    throw new Error(errorMessage);
  },
});

export const getTopProductsQueryOptions = () => ({
  queryKey: ["products", "top"] as const,
  queryFn: async (): Promise<ProductsApiResponse> => {
    const result = await getTopProductsAction();
    if (
      result &&
      typeof result === "object" &&
      "success" in result &&
      result.success
    ) {
      return result as ProductsApiResponse;
    }
    const errorMessage =
      result && typeof result === "object" && "message" in result
        ? result.message
        : "Erreur lors de la récupération des produits populaires";
    throw new Error(errorMessage);
  },
});

export const getProductBySellerQueryOptions = (
  params: ProductBySellerParams,
) => ({
  queryKey: [
    "products",
    "seller",
    params.id,
    params.page,
    params.limit,
  ] as const,
  queryFn: async (): Promise<ProductsApiResponse> => {
    const result = await getProductBySellerAction(params);
    if (
      result &&
      typeof result === "object" &&
      "success" in result &&
      result.success
    ) {
      return result as ProductsApiResponse;
    }
    const errorMessage =
      result && typeof result === "object" && "message" in result
        ? result.message
        : "Erreur lors de la récupération des produits du vendeur";
    throw new Error(errorMessage);
  },
});

export const getOneProductQueryOptions = (id: string) => ({
  queryKey: ["products", id] as const,
  queryFn: async () => {
    const result = await getOneProductAction(id);
    if (result.success) {
      return (result as ProductApiResponse).product.product;
    }
    throw new Error(
      result.message || "Erreur lors de la récupération du produit",
    );
  },
  enabled: !!id,
});

export const deleteProductMutationOptions = () => ({
  mutationFn: deleteProductAction,
});

export const updateProductMutationOptions = () => ({
  mutationFn: async ({
    id,
    params,
  }: {
    id: string;
    params: UpdateProductCredentials;
  }) => {
    return await updateProductAction({ id, params });
  },
});

export const blockedProductMutationOptions = () => ({
  mutationFn: async (id: string) => {
    return await blockedProductAction(id);
  },
});

export const breakProductMutationOptions = () => ({
  mutationFn: async (id: string) => {
    return await breakProductAction(id);
  },
});
