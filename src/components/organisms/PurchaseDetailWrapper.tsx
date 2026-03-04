"use client";

import type { OrderItem, Purchase } from "@/lib/types/purchase.types";
import { useRouter } from "next/navigation";
import { ValidateOrdersDetail } from "./ValidateOrdersDetail";

interface PurchaseDetailWrapperProps {
  purchase: Purchase;
  orderItem: OrderItem;
}

export function PurchaseDetailWrapper({
  purchase,
  orderItem,
}: PurchaseDetailWrapperProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <ValidateOrdersDetail
      purchase={purchase}
      orderItem={orderItem}
      onBack={handleBack}
    />
  );
}
