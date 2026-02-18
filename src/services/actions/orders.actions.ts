"use server";
import { Order, OrdersApiResponse } from "@/lib/types/orders.type";
import { serverRequest } from "../axios-server";
import { endpoints } from "../endpoints";
import { safeAction } from "../server/safe-action.server";

export async function fetchOrdersAction(
  page: number,
  limit: number,
  statut?: string,
) {
  return safeAction<OrdersApiResponse>(async () => {
    return serverRequest<OrdersApiResponse>(
      endpoints.ORDERS.allOrders(page, limit, statut),
      {
        method: "GET",
      },
    );
  });
}

export async function getOneOrderAction(id: string) {
  return safeAction<{ data: Order }>(async () => {
    return serverRequest<{ data: Order }>(endpoints.ORDERS.getOneOrder(id), {
      method: "GET",
    });
  });
}

export async function deleteOrderAction(id: string) {
  return safeAction<{ success: boolean; message: string }>(async () => {
    return serverRequest<{ success: boolean; message: string }>(
      endpoints.ORDERS.deleteOneOrder(id),
      {
        method: "DELETE",
      },
    );
  });
}
