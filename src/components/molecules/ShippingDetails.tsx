"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Order } from "@/lib/types/orders.type";
import { getShippingMethodLabel } from "@/lib/types/orders.type";
import { TruckIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";

interface ShippingDetailsProps {
  order: Order;
  orderId: string;
}

export function ShippingDetails({ order, orderId }: ShippingDetailsProps) {
  // Utiliser les données de l'API pour la méthode de livraison
  const shippingMethodName =
    order.shippingMethods?.name ||
    getShippingMethodLabel(order.ShippingMethod) ||
    "Livraison standard";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Détails de livraison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-bleu-doux font-medium">
              <HugeiconsIcon icon={TruckIcon} className="h-4 w-4" />
              <span>{shippingMethodName}</span>
            </div>
            {order.shippingMethods?.price && (
              <p className="text-sm text-muted-foreground">
                Frais de livraison:{" "}
                {order.shippingMethods.price.toLocaleString()} {order.currency}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Suivi disponible en temps réel
            </p>
            <div className="mt-4 p-3 bg-muted/30 dark:bg-muted/20 rounded-lg">
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">
                  Code de suivi
                </div>
                <div className="font-mono text-sm font-medium">
                  #TRK{orderId.slice(-8).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
