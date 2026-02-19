"use client";

import { motion } from "motion/react";
import Image from "next/image";

import type { OrderItem } from "@/lib/types/orders.type";
import { formatPrice } from "@/lib/utils";
import { Package01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface OrderItemCardProps {
  item: OrderItem;
  index: number;
  currency?: string;
}

export function OrderItemCard({
  item,
  index,
  currency = "FCFA",
}: OrderItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 dark:bg-muted/20"
    >
      <div className="h-16 w-16 rounded-lg bg-gray-10 dark:bg-gray-90 flex items-center justify-center">
        {item.product?.ProductImage?.[0]?.imageUrl ? (
          <Image
            src={item.product.ProductImage[0].imageUrl}
            alt={item.product.name}
            width={64}
            height={64}
            className="rounded-lg object-cover"
          />
        ) : (
          <HugeiconsIcon
            icon={Package01Icon}
            className="h-8 w-8 text-muted-foreground"
          />
        )}
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{item.product?.name}</h4>
        <p className="text-sm text-muted-foreground">
          SKU: {item.product?.id?.slice(-8)}
        </p>
        {item.color && (
          <p className="text-sm text-muted-foreground">Couleur: {item.color}</p>
        )}
      </div>
      <div className="text-right">
        <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
        <p className="text-lg font-bold">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>
    </motion.div>
  );
}
