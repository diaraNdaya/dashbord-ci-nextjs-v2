"use client";

import { OrderItemCard } from "@/components/atoms/OrderItemCard";
import type { OrderItem } from "@/lib/types/orders.type";

interface OrderItemsListProps {
  items: OrderItem[];
  currency?: string;
}

export function OrderItemsList({ items, currency }: OrderItemsListProps) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <OrderItemCard
          key={item.id}
          item={item}
          index={index}
          currency={currency}
        />
      ))}
    </div>
  );
}
