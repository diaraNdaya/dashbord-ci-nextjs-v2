"use server";

import type {
  ProductApiResponse,
  ProductBySellerParams,
  ProductDeleteResponse,
  ProductsApiResponse,
  UpdateProductCredentials,
} from "@/lib/types/products.types";
import { serverRequest } from "@/services/server/axios-server.server";
import { safeAction } from "@/services/server/safe-action.server";
import { ApiResponse } from "../api.type";
import { endpoints } from "../endpoints";

export async function getAllProductsAction(page: number, limit: number) {
  return safeAction<ProductsApiResponse>(async () => {
    return serverRequest<ProductsApiResponse>(
      endpoints.PRODUCT.allProduct(page, limit),
      {
        method: "GET",
      },
    );
  });
}
export async function getTopProductsAction() {
  return safeAction<ProductsApiResponse>(async () => {
    return serverRequest<ProductsApiResponse>(endpoints.TOPCOUNT.product(), {
      method: "GET",
    });
  });
}
export async function getProductBySellerAction(params: ProductBySellerParams) {
  return safeAction<ProductsApiResponse>(async () => {
    const { id, page, limit } = params;
    return serverRequest<ProductsApiResponse>(
      endpoints.PRODUCT.getProductBySeller(id, page, limit),
      {
        method: "GET",
      },
    );
  });
}
export async function getOneProductAction(id: string) {
  return safeAction<ProductApiResponse>(async () => {
    return serverRequest<ProductApiResponse>(
      endpoints.PRODUCT.getOneProduct(id),
      {
        method: "GET",
      },
    );
  });
}
export async function deleteProductAction(id: string) {
  return safeAction<ProductDeleteResponse>(async () => {
    return serverRequest<ProductDeleteResponse>(
      endpoints.PRODUCT.deleteOneProduct(id),
      {
        method: "DELETE",
      },
    );
  });
}
export async function updateProductAction({
  id,
  params,
}: {
  id: string;
  params: UpdateProductCredentials;
}) {
  return safeAction<ApiResponse<unknown>>(async () => {
    return serverRequest<ApiResponse<unknown>>(
      endpoints.PRODUCT.updateProduct(id),
      {
        method: "PUT",
        body: JSON.stringify(params),
      },
    );
  });
}
export async function blockedProductAction(id: string) {
  return safeAction<ApiResponse<unknown>>(async () => {
    return serverRequest<ApiResponse<unknown>>(
      endpoints.PRODUCT.blockedProduct(id),
      {
        method: "PUT",
      },
    );
  });
}
export async function breakProductAction(id: string) {
  return safeAction<ApiResponse<unknown>>(async () => {
    return serverRequest<ApiResponse<unknown>>(
      endpoints.PRODUCT.breakProduct(id),
      {
        method: "PUT",
      },
    );
  });
}
