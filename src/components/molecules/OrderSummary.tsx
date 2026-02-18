"use client";

import { OrderSummaryRow } from "@/components/atoms/OrderSummaryRow";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency?: string;
}

export function OrderSummary({
  subtotal,
  shipping,
  tax,
  total,
  currency = "FCFA",
}: OrderSummaryProps) {
  return (
    <div className="space-y-2">
      <OrderSummaryRow
        label="Sous-total"
        value={`${subtotal.toLocaleString()} ${currency}`}
      />
      <OrderSummaryRow
        label="Livraison"
        value={`${shipping.toLocaleString()} ${currency}`}
      />
      <OrderSummaryRow
        label="Taxe"
        value={`${tax.toLocaleString()} ${currency}`}
      />
      <Separator />
      <OrderSummaryRow
        label="Total"
        value={`${total.toLocaleString()} ${currency}`}
        isTotal
      />
    </div>
  );
}
