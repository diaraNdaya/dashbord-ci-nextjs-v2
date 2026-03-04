import type { UpdatePurchaseStatusPayload } from "@/lib/types/purchase.types";
import { queryOptions } from "@tanstack/react-query";
import {
  fetchPurchasesAction,
  updatePurchaseStatusAction,
} from "../actions/purchase.actions";

export const getAllPurchasesQueryOptions = () =>
  queryOptions({
    queryKey: ["purchases", "all"],
    queryFn: () => fetchPurchasesAction(),
  });

export const updatePurchaseStatusMutationOptions = () => ({
  mutationFn: async ({
    purchaseId,
    payload,
  }: {
    purchaseId: string;
    payload: UpdatePurchaseStatusPayload;
  }) => {
    return await updatePurchaseStatusAction(purchaseId, payload);
  },
});
