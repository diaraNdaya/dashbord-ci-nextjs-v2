"use server";

import type {
  ShippingMethod,
  ShippingMethodCredentials,
  ShippingMethodsApiResponse,
} from "@/lib/types/shipping.types";
import { serverRequest } from "@/services/server/axios-server.server";
import { safeAction } from "@/services/server/safe-action.server";
import { endpoints } from "../endpoints";

export interface ShippingSearchParams {
  name?: string;
  active?: boolean;
}

export async function getAllShippingMethodsAction(
  page: number,
  limit: number,
  searchParams?: ShippingSearchParams,
) {
  return safeAction<ShippingMethodsApiResponse>(async () => {
    let url = endpoints.SHIPPING.all(page, limit);

    if (searchParams) {
      const params = new URLSearchParams();
      if (searchParams.name && searchParams.name.trim() !== "") {
        params.append("name", searchParams.name.trim());
      }
      if (searchParams.active !== undefined) {
        params.append("active", searchParams.active.toString());
      }
      const paramString = params.toString();
      if (paramString) {
        url += `&${paramString}`;
      }
    }

    return serverRequest<ShippingMethodsApiResponse>(url, {
      method: "GET",
    });
  });
}

export async function createShippingMethodAction(
  data: ShippingMethodCredentials,
) {
  return safeAction<ShippingMethod>(async () => {
    return serverRequest<ShippingMethod>(endpoints.SHIPPING.create, {
      method: "POST",
      body: JSON.stringify(data),
    });
  });
}

export async function updateShippingMethodAction(
  id: string,
  data: Partial<ShippingMethodCredentials>,
) {
  return safeAction<ShippingMethod>(async () => {
    return serverRequest<ShippingMethod>(endpoints.SHIPPING.updateOne(id), {
      method: "PUT",
      body: JSON.stringify(data),
    });
  });
}

export async function deleteShippingMethodAction(id: string) {
  return safeAction<{ success: boolean; message: string }>(async () => {
    return serverRequest<{ success: boolean; message: string }>(
      endpoints.SHIPPING.deleteOne(id),
      {
        method: "DELETE",
      },
    );
  });
}

export async function getShippingMethodByIdAction(id: string) {
  return safeAction<ShippingMethod>(async () => {
    return serverRequest<ShippingMethod>(endpoints.SHIPPING.getOne(id), {
      method: "GET",
    });
  });
}
