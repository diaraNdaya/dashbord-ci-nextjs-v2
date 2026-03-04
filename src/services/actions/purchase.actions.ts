"use server";

import type {
  PurchasesApiResponse,
  UpdatePurchaseStatusPayload,
} from "@/lib/types/purchase.types";
import { serverRequest } from "@/services/server/axios-server.server";
import { safeAction } from "@/services/server/safe-action.server";
import { endpoints } from "../endpoints";

export async function fetchPurchasesAction() {
  return safeAction<PurchasesApiResponse>(async () => {
    const response = await serverRequest<PurchasesApiResponse>(
      endpoints.PURCHASE.allPurchase(),
      {
        method: "GET",
      },
    );
    return response;
  });
}

export async function updatePurchaseStatusAction(
  purchaseId: string,
  payload: UpdatePurchaseStatusPayload,
) {
  return safeAction<{ success: boolean; message: string }>(async () => {
    const url = endpoints.PURCHASE.updateOrderBySeller(purchaseId);

    const response = await serverRequest<{ success: boolean; message: string }>(
      url,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
    );

    return response;
  });
}
