"use client";

import { SafeImage } from "@/components/atoms/SafeImage";
import { Button } from "@/components/ui/button";
import type {
  OrderItem,
  Purchase,
  StatusOrder,
} from "@/lib/types/purchase.types";
import { formatPrice } from "@/lib/utils";
import {
  Clock01Icon,
  EyeIcon,
  Settings02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";
import type { JSX } from "react";
import { memo, useCallback } from "react";

interface OrderItemRowProps {
  orderItem: OrderItem;
  purchase: Purchase;
  index: number;
  onViewDetails: (orderItem: OrderItem, purchase: Purchase) => void;
  getStatusBadge: (status: StatusOrder) => JSX.Element;
}

export const OrderItemRow = memo(
  ({
    orderItem,
    purchase,
    index,
    onViewDetails,
    getStatusBadge,
  }: OrderItemRowProps) => {
    const handleClick = useCallback(() => {
      onViewDetails(orderItem, purchase);
    }, [orderItem, purchase, onViewDetails]);

    const handleButtonClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onViewDetails(orderItem, purchase);
      },
      [orderItem, purchase, onViewDetails],
    );

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.3,
          delay: 0.05 * 1,
        }}
        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex items-center gap-4">
          {orderItem.product?.ProductImage?.[0] && (
            <SafeImage
              src={orderItem.product.ProductImage[0].imageUrl}
              alt={orderItem.product.name || "Produit"}
              width={60}
              height={60}
              className="rounded-lg object-cover"
            />
          )}
          <div>
            <div className="font-medium">
              {orderItem.product?.name || "Produit inconnu"}
            </div>
            <div className="text-sm text-muted-foreground">
              Commande: {purchase.id.slice(-8)} • Quantité: {orderItem.quantity}
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span>Prix: {formatPrice(orderItem.price)}</span>
              <span>•</span>
              <span>Total commande: {formatPrice(purchase.totalAmount)}</span>
              <span>•</span>
              <HugeiconsIcon
                icon={Clock01Icon}
                strokeWidth={2}
                className="h-3 w-3"
              />
              <span>{new Date(purchase.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(orderItem.statut)}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleButtonClick}
            title="Voir les détails et gérer"
          >
            <HugeiconsIcon icon={EyeIcon} strokeWidth={2} className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleButtonClick}
            title="Gérer le statut"
          >
            <HugeiconsIcon
              icon={Settings02Icon}
              strokeWidth={2}
              className="h-4 w-4 text-blue-600"
            />
          </Button>
        </div>
      </motion.div>
    );
  },
);

OrderItemRow.displayName = "OrderItemRow";
