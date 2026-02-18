"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface OrderStatusBadgeProps {
  status:
    | "pending"
    | "confirmed"
    | "progress"
    | "courier_contacted"
    | "packing"
    | "delivered"
    | "cancel";
  className?: string;
}

const statusConfig = {
  pending: {
    label: "En attente",
    icon: "⏳",
    className:
      "bg-orange-50/20 text-orange-50 border-orange-50/30 dark:bg-orange-50/10 dark:text-orange-50",
  },
  confirmed: {
    label: "Confirmée",
    icon: "✓",
    className:
      "bg-bleu-doux/20 text-bleu-doux border-bleu-doux/30 dark:bg-bleu-doux/10 dark:text-bleu-doux",
  },
  progress: {
    label: "En cours",
    icon: "⚙️",
    className:
      "bg-violet-vif/20 text-violet-vif border-violet-vif/30 dark:bg-violet-vif/10 dark:text-violet-vif",
  },
  courier_contacted: {
    label: "Coursier contacté",
    icon: "📞",
    className:
      "bg-indigo-50/20 text-indigo-50 border-indigo-50/30 dark:bg-indigo-50/10 dark:text-indigo-50",
  },
  packing: {
    label: "En livraison",
    icon: "📦",
    className:
      "bg-jaune-orange/20 text-jaune-orange border-jaune-orange/30 dark:bg-jaune-orange/10 dark:text-jaune-orange",
  },
  delivered: {
    label: "Livrée",
    icon: "✅",
    className:
      "bg-vert-menthe/20 text-vert-menthe border-vert-menthe/30 dark:bg-vert-menthe/10 dark:text-vert-menthe",
  },
  cancel: {
    label: "Annulée",
    icon: "❌",
    className:
      "bg-rouge-vif/20 text-rouge-vif border-rouge-vif/30 dark:bg-rouge-vif/10 dark:text-rouge-vif",
  },
};

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Badge
        variant="outline"
        className={cn(
          "font-medium transition-all duration-200 flex items-center gap-1.5",
          config.className,
          className,
        )}
      >
        <span className="text-sm">{config.icon}</span>
        {config.label}
      </Badge>
    </motion.div>
  );
}
