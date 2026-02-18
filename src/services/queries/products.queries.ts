import type {
  Product,
  ProductBySellerParams,
  ProductsApiResponse,
} from "@/lib/types/products.types";
import {
  deleteProductAction,
  getAllProductsAction,
  getOneProductAction,
  getProductBySellerAction,
  getTopProductsAction,
} from "@/services/actions/products.actions";

// Queries pour les produits
export const getAllProductsQueryOptions = (page: number, limit: number) => ({
  queryKey: ["products", page, limit] as const,
  queryFn: async (): Promise<ProductsApiResponse> => {
    const result = await getAllProductsAction(page, limit);
    if (result.success) {
      // Access the nested structure: result.data.data
      const response = result.data as { data: ProductsApiResponse };
      return response.data;
    }
    throw new Error(
      result.error.message || "Erreur lors de la récupération des produits",
    );
  },
});

export const getTopProductsQueryOptions = () => ({
  queryKey: ["products", "top"] as const,
  queryFn: async (): Promise<ProductsApiResponse> => {
    const result = await getTopProductsAction();
    if (result.success) {
      // Access the nested structure: result.data.data
      const response = result.data as { data: ProductsApiResponse };
      return response.data;
    }
    throw new Error(
      result.error.message ||
        "Erreur lors de la récupération des produits populaires",
    );
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
  queryFn: async () => {
    const result = await getProductBySellerAction(params);
    if (result.success) {
      return result.data;
    }
    throw new Error(
      result.error.message ||
        "Erreur lors de la récupération des produits du vendeur",
    );
  },
});

export const getOneProductQueryOptions = (id: string) => ({
  queryKey: ["products", id] as const,
  queryFn: async (): Promise<Product> => {
    const result = await getOneProductAction(id);
    if (result.success) {
      // Access the nested structure: result.data.data.product.product
      const response = result.data as {
        data: { product: { product: Product } };
      };
      return response.data.product.product;
    }
    throw new Error(
      result.error.message || "Erreur lors de la récupération du produit",
    );
  },
  enabled: !!id, // Ne s'exécute que si l'ID est fourni
});

// Mutations
export const deleteProductMutationOptions = () => ({
  mutationFn: deleteProductAction,
});
