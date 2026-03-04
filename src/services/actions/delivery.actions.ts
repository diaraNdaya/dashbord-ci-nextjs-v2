"use server";

import type {
  CreateDeliveryCredential,
  createDeliveryResponse,
  DeliveryApiResponse,
  DeliveryUser,
} from "@/lib/types/delivery.types";
import { serverRequest } from "@/services/server/axios-server.server";
import { safeAction } from "@/services/server/safe-action.server";
import { endpoints } from "../endpoints";

export interface DeliverySearchParams {
  fullName?: string;
  username?: string;
  phone?: string;
}

export async function getAllDeliveriesAction(
  page: number,
  limit: number,
  searchParams?: DeliverySearchParams,
) {
  return safeAction<DeliveryApiResponse>(async () => {
    let url = endpoints.DELIVERY.getAllDeliveries(page, limit);

    if (searchParams) {
      const params = new URLSearchParams();
      if (searchParams.fullName && searchParams.fullName.trim() !== "") {
        params.append("fullName", searchParams.fullName.trim());
      }
      if (searchParams.username && searchParams.username.trim() !== "") {
        params.append("username", searchParams.username.trim());
      }
      if (searchParams.phone && searchParams.phone.trim() !== "") {
        params.append("phone", searchParams.phone.trim());
      }
      const paramString = params.toString();
      if (paramString) {
        url += `&${paramString}`;
      }
    }

    return serverRequest<DeliveryApiResponse>(url, {
      method: "GET",
    });
  });
}

export async function createDeliveryUserAction(data: CreateDeliveryCredential) {
  return safeAction<createDeliveryResponse>(async () => {
    return serverRequest<createDeliveryResponse>(
      endpoints.DELIVERY.createUserDelivery,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  });
}

export async function updateDeliveryUserAction(
  id: string,
  data: Partial<CreateDeliveryCredential>,
) {
  return safeAction<DeliveryUser>(async () => {
    return serverRequest<DeliveryUser>(
      endpoints.DELIVERY.updateUserDelivery(id),
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
    );
  });
}

export async function deleteDeliveryUserAction(id: string) {
  return safeAction<{ success: boolean; message: string }>(async () => {
    return serverRequest<{ success: boolean; message: string }>(
      endpoints.DELIVERY.deleteUserDelivery(id),
      {
        method: "DELETE",
      },
    );
  });
}

export async function getDeliveryAvailableAction() {
  return safeAction<DeliveryUser[]>(async () => {
    return serverRequest<DeliveryUser[]>(
      endpoints.DELIVERY.deliveryAvailable(),
      {
        method: "GET",
      },
    );
  });
}

export async function getOrderDeliveryAction(id: string) {
  return safeAction<DeliveryUser>(async () => {
    return serverRequest<DeliveryUser>(endpoints.DELIVERY.orderDelivery(id), {
      method: "GET",
    });
  });
}
