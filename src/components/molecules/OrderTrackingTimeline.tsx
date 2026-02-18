"use client";

import { OrderTrackingStep } from "@/components/atoms/OrderTrackingStep";
import type { Order } from "@/lib/types/orders.type";
import {
  Call02Icon,
  CheckmarkCircle02Icon,
  Package01Icon,
  TruckIcon,
} from "@hugeicons/core-free-icons";

interface OrderTrackingTimelineProps {
  order: Order;
}

export function OrderTrackingTimeline({ order }: OrderTrackingTimelineProps) {
  const steps = [
    { key: "confirmed", label: "Confirmé", icon: CheckmarkCircle02Icon },
    { key: "progress", label: "Emballage", icon: Package01Icon },
    { key: "courier_contacted", label: "Coursier contacté", icon: Call02Icon },
    { key: "packing", label: "En livraison", icon: TruckIcon },
    { key: "delivered", label: "Livré", icon: CheckmarkCircle02Icon },
  ];

  const statusIndex: Record<string, number> = {
    confirmed: 0,
    progress: 1,
    courier_contacted: 2,
    packing: 3,
    delivered: 4,
    cancel: -1,
  };

  const currentStatusIndex = statusIndex[order.statut] || -1;

  const trackingSteps = steps.map((step, index) => ({
    key: step.key,
    label: step.label,
    icon: step.icon,
    completed: currentStatusIndex >= index && currentStatusIndex !== -1,
    date: index === 0 ? order.orderDate : null,
  }));

  return (
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
  );
}
