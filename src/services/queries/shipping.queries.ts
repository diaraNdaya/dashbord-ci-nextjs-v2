import type {
  ShippingMethod,
  ShippingMethodCredentials,
  ShippingMethodsApiResponse,
} from "@/lib/types/shipping.types";
import { isApiError } from "@/lib/utils/type-guards";
import type { ShippingSearchParams } from "@/services/actions/shipping.actions";
import {
  createShippingMethodAction,
  deleteShippingMethodAction,
  getAllShippingMethodsAction,
  getShippingMethodByIdAction,
  updateShippingMethodAction,
} from "@/services/actions/shipping.actions";

export const getAllShippingMethodsQueryOptions = (
  page: number,
  limit: number,
  searchParams?: ShippingSearchParams,
) => ({
  queryKey: ["shipping-methods", page, limit, searchParams] as const,
  queryFn: async (): Promise<ShippingMethodsApiResponse> => {
    const result = await getAllShippingMethodsAction(page, limit, searchParams);

    if (isApiError(result)) {
      throw new Error(
        result.message ||
          "Erreur lors de la récupération des méthodes de livraison",
      );
    }

    return result;
  },
});

export const getShippingMethodByIdQueryOptions = (id: string) => ({
  queryKey: ["shipping-methods", id] as const,
  queryFn: async (): Promise<ShippingMethod> => {
    const result = await getShippingMethodByIdAction(id);

    if (isApiError(result)) {
      throw new Error(
        result.message ||
          "Erreur lors de la récupération de la méthode de livraison",
      );
    }

    return result;
  },
});

export const createShippingMethodMutationOptions = () => ({
  mutationFn: async (
    data: ShippingMethodCredentials,
  ): Promise<ShippingMethod> => {
    const result = await createShippingMethodAction(data);

    if (isApiError(result)) {
      throw new Error(
        result.message ||
          "Erreur lors de la création de la méthode de livraison",
      );
    }

    return result;
  },
});

export const updateShippingMethodMutationOptions = () => ({
  mutationFn: async ({
    id,
    data,
  }: {
    id: string;
    data: Partial<ShippingMethodCredentials>;
  }): Promise<ShippingMethod> => {
    const result = await updateShippingMethodAction(id, data);

    if (isApiError(result)) {
      throw new Error(
        result.message ||
          "Erreur lors de la mise à jour de la méthode de livraison",
      );
    }

    return result;
  },
});

export const deleteShippingMethodMutationOptions = () => ({
  mutationFn: async ({
    id,
  }: {
    id: string;
  }): Promise<{ success: boolean; message: string }> => {
    const result = await deleteShippingMethodAction(id);

    if (isApiError(result)) {
      throw new Error(
        result.message ||
          "Erreur lors de la suppression de la méthode de livraison",
      );
    }

    return result;
  },
});
