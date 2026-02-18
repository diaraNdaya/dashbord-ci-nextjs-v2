"use client";

import { CustomerDetails } from "@/components/molecules/CustomerDetails";
import { OrderItemsList } from "@/components/molecules/OrderItemsList";
import { OrderSummary } from "@/components/molecules/OrderSummary";
import { OrderTrackingTimeline } from "@/components/molecules/OrderTrackingTimeline";
import { ShippingDetails } from "@/components/molecules/ShippingDetails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Order, OrderItem } from "@/lib/types/orders.type";
import { Package01Icon, TruckIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";

interface OrderDetailsContentProps {
  order: Order;
  orderId: string;
}

export function OrderDetailsContent({
  order,
  orderId,
}: OrderDetailsContentProps) {
  // Calculer le sous-total à partir des articles
  const subtotal =
    order.orderItem?.reduce(
      (sum: number, item: OrderItem) => sum + item.price * item.quantity,
      0,
    ) || 0;

  // Utiliser les données de l'API pour les frais de livraison
  const shipping = order.shippingMethods?.price || 0;

  // Calculer la taxe si elle existe dans les données de paiement ou utiliser 0
  const tax = 0; // TODO: Ajouter la propriété tax dans l'API si nécessaire

  // Utiliser le montant total de l'API (priorité au payment.amount, puis totalAmount)
  const total =
    order.payment?.amount || order.totalAmount || subtotal + shipping + tax;

  console.log("Order financial data:", {
    subtotal,
    shipping: order.shippingMethods?.price,
    shippingMethodName: order.shippingMethods?.name,
    totalFromAPI: order.totalAmount,
    paymentAmount: order.payment?.amount,
    calculatedTotal: subtotal + shipping + tax,
    finalTotal: total,
    paymentStatus: order.payment?.payment_status,
    currency: order.currency,
  });

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Ordered Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="lg:col-span-2"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HugeiconsIcon
                icon={Package01Icon}
                className="h-5 w-5 text-violet-vif"
              />
              Articles commandés ({order.orderItem?.length || 0} articles
              expédiés)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.orderItem && (
              <OrderItemsList
                items={order.orderItem}
                currency={order.currency}
              />
            )}

            <Separator />

            <OrderSummary
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
              currency={order.currency}
            />

            <Separator />

            <CustomerDetails order={order} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Order History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HugeiconsIcon
                icon={TruckIcon}
                className="h-5 w-5 text-bleu-doux"
              />
              Historique de la commande
            </CardTitle>
          </CardHeader>
          <CardContent>
            <OrderTrackingTimeline order={order} />
          </CardContent>
        </Card>

        <ShippingDetails order={order} orderId={orderId} />
      </motion.div>
    </div>
  );
}
