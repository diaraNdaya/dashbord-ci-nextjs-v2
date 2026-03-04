import type {
  CreateDeliveryCredential,
  createDeliveryResponse,
  DeliveryApiResponse,
  DeliveryUser,
} from "@/lib/types/delivery.types";
import { isApiError } from "@/lib/utils/type-guards";
import type { DeliverySearchParams } from "@/services/actions/delivery.actions";
import {
  createDeliveryUserAction,
  deleteDeliveryUserAction,
  getAllDeliveriesAction,
  getDeliveryAvailableAction,
  getOrderDeliveryAction,
  updateDeliveryUserAction,
} from "@/services/actions/delivery.actions";

export const getAllDeliveriesQueryOptions = (
  page: number,
  limit: number,
  searchParams?: DeliverySearchParams,
) => ({
  queryKey: ["deliveries", page, limit, searchParams] as const,
  queryFn: async (): Promise<DeliveryApiResponse> => {
    const result = await getAllDeliveriesAction(page, limit, searchParams);
    if (isApiError(result)) {
      throw new Error(
        result.message || "Erreur lors de la récupération des livreurs",
      );
    }

    return result;
  },
});

export const getDeliveryAvailableQueryOptions = () => ({
  queryKey: ["deliveries", "available"] as const,
  queryFn: async (): Promise<DeliveryUser[]> => {
    const result = await getDeliveryAvailableAction();

    if (isApiError(result)) {
      throw new Error(
        result.message ||
          "Erreur lors de la récupération des livreurs disponibles",
      );
    }

    return result;
  },
});

export const getOrderDeliveryQueryOptions = (id: string) => ({
  queryKey: ["deliveries", "order", id] as const,
  queryFn: async (): Promise<DeliveryUser> => {
    const result = await getOrderDeliveryAction(id);

    if (isApiError(result)) {
      throw new Error(
        result.message ||
          "Erreur lors de la récupération du livreur de la commande",
      );
    }

    return result;
  },
});

export const createDeliveryUserMutationOptions = () => ({
  mutationFn: async (
    data: CreateDeliveryCredential,
  ): Promise<createDeliveryResponse> => {
    const result = await createDeliveryUserAction(data);

    if (isApiError(result)) {
      throw new Error(
        result.message || "Erreur lors de la création du livreur",
      );
    }

    return result;
  },
});
export const updateDeliveryUserMutationOptions = () => ({
  mutationFn: async ({
    id,
    data,
  }: {
    id: string;
    data: Partial<CreateDeliveryCredential>;
  }): Promise<DeliveryUser> => {
    const result = await updateDeliveryUserAction(id, data);

    if (isApiError(result)) {
      throw new Error(
        result.message || "Erreur lors de la mise à jour du livreur",
      );
    }

    return result;
  },
});

export const deleteDeliveryUserMutationOptions = () => ({
  mutationFn: async ({
    id,
  }: {
    id: string;
  }): Promise<{ success: boolean; message: string }> => {
    const result = await deleteDeliveryUserAction(id);

    if (isApiError(result)) {
      throw new Error(
        result.message || "Erreur lors de la suppression du livreur",
      );
    }

    return result;
  },
});
