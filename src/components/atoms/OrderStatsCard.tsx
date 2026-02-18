"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface OrderStatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  variant?: "default" | "new" | "pending" | "delivered";
  className?: string;
}

const variantStyles = {
  default: "bg-card border-border",
  new: "bg-bleu-doux/5 border-bleu-doux/20 dark:bg-bleu-doux/5",
  pending: "bg-violet-vif/5 border-violet-vif/20 dark:bg-violet-vif/5",
  delivered: "bg-rose-pastel/5 border-rose-pastel/20 dark:bg-rose-pastel/5",
};

export function OrderStatsCard({
  title,
  value,
  subtitle,
  trend,
  variant = "default",
  className,
}: OrderStatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2 }}
    >
      <Card className={cn(variantStyles[variant], className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold text-foreground">{value}</div>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
          {trend && (
            <p className="text-xs text-vert-menthe mt-1 font-medium">{trend}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
