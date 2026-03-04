import { PurchaseDetailWrapper } from "@/components/organisms/PurchaseDetailWrapper";
import { metaObject } from "@/lib/config/site.config";
import type { OrderItem, Purchase } from "@/lib/types/purchase.types";
import { fetchPurchasesAction } from "@/services/actions/purchase.actions";
import { meQueryOptions } from "@/services/queries/auth.queries";
import { getQueryClient } from "@/services/queries/getQueryClient";
import { RQProvider } from "@/services/queries/RQProvider";
import { dehydrate } from "@tanstack/react-query";
import { notFound } from "next/navigation";

interface PurchaseDetailPageProps {
  params: {
    id: string;
  };
  searchParams: {
    itemId?: string;
  };
}

export const metadata = metaObject("Détails du Purchase");

export default async function PurchaseDetailPage({
  params,
  searchParams,
}: PurchaseDetailPageProps) {
  const qc = getQueryClient();
  await qc.prefetchQuery(meQueryOptions());
  const purchasesResponse = await fetchPurchasesAction();
  if (
    !purchasesResponse ||
    typeof purchasesResponse !== "object" ||
    !("success" in purchasesResponse) ||
    !purchasesResponse.success ||
    !("data" in purchasesResponse) ||
    !purchasesResponse.data
  ) {
    notFound();
  }

  const purchase = purchasesResponse.data.find(
    (p: Purchase) => p.id === params.id,
  );

  if (!purchase) {
    notFound();
  }

  const orderItem = searchParams.itemId
    ? purchase.orderItem.find(
        (item: OrderItem) => item.id === searchParams.itemId,
      )
    : purchase.orderItem[0];

  if (!orderItem) {
    notFound();
  }

  return (
    <RQProvider state={dehydrate(qc)}>
      <PurchaseDetailWrapper purchase={purchase} orderItem={orderItem} />
    </RQProvider>
  );
}
