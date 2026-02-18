"use client";

import { OrderTrackingStep } from "@/components/atoms/OrderTrackingStep";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Order } from "@/lib/types/orders.type";
import {
  CheckmarkCircle02Icon,
  CreditCardIcon,
  Mail01Icon,
  Package01Icon,
  TruckIcon,
  User02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";
import Image from "next/image";

interface OrderDetailsCardProps {
  order: Order;
}

export function OrderDetailsCard({ order }: OrderDetailsCardProps) {
  const trackingSteps = [
    {
      key: "confirmed",
      label: "Commande confirmée",
      icon: CheckmarkCircle02Icon,
      completed: true,
      date: order.orderDate,
    },
    {
      key: "processing",
      label: "En préparation",
      icon: Package01Icon,
      completed: order.statut === "packing" || order.statut === "delivered",
      date: null,
    },
    {
      key: "shipped",
      label: "Expédiée",
      icon: TruckIcon,
      completed: order.statut === "delivered",
      date: null,
    },
    {
      key: "delivered",
      label: "Livrée",
      icon: Package01Icon,
      completed: order.statut === "delivered",
      date: null,
    },
  ];

  const subtotal =
    order.orderItem?.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    ) || 0;
  const shipping = 3500; // Frais de livraison fixes
  const tax = 0; // Pas de taxe
  const total = subtotal + shipping + tax;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Ordered Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
            {order.orderItem?.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/30"
              >
                <div className="h-16 w-16 rounded-lg bg-gray-10 flex items-center justify-center">
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
                    <p className="text-sm text-muted-foreground">
                      Couleur: {item.color}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {item.price?.toLocaleString()} FCFA x {item.quantity}
                  </p>
                  <p className="text-lg font-bold">
                    {(item.price * item.quantity)?.toLocaleString()} FCFA
                  </p>
                </div>
              </motion.div>
            ))}

            <Separator />

            {/* Order Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sous-total</span>
                <span>{subtotal.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Livraison</span>
                <span>{shipping.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Taxe</span>
                <span>{tax.toLocaleString()} FCFA</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{total.toLocaleString()} FCFA</span>
              </div>
            </div>

            {/* Customer Details */}
            <Separator />
            <div>
              <h4 className="font-medium mb-3">Détails du client</h4>
              <div className="grid gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={User02Icon}
                    className="h-4 w-4 text-muted-foreground"
                  />
                  <span>{order.customer?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Mail01Icon}
                    className="h-4 w-4 text-muted-foreground"
                  />
                  <span>{order.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={CreditCardIcon}
                    className="h-4 w-4 text-muted-foreground"
                  />
                  <span>Carte de crédit</span>
                </div>
              </div>
            </div>
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
            <div className="space-y-4">
              {trackingSteps.map((step, index) => (
                <OrderTrackingStep
                  key={step.key}
                  icon={step.icon}
                  label={step.label}
                  completed={step.completed}
                  date={step.date}
                  isLast={index === trackingSteps.length - 1}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shipping Details */}
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
                  <span>Livraison à domicile</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Suivi disponible en temps réel
                </p>
                <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">
                      Code de suivi
                    </div>
                    <div className="font-mono text-sm font-medium">
                      #TRK{order.id.slice(-8).toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
