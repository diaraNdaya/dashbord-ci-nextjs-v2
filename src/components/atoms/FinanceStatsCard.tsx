"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IconType } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";

interface FinanceStatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
  };
  icon: IconType;
  variant?: "default" | "success" | "warning" | "danger";
  index?: number;
}

const variantStyles = {
  default: "bg-violet-vif/10 text-violet-vif",
  success: "bg-vert-menthe/10 text-vert-menthe",
  warning: "bg-jaune-orange/10 text-jaune-orange",
  danger: "bg-rouge-vif/10 text-rouge-vif",
};

const trendStyles = {
  up: "text-vert-menthe",
  down: "text-rouge-vif",
  neutral: "text-muted-foreground",
};

export function FinanceStatsCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  variant = "default",
  index = 0,
}: FinanceStatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div
            className={`h-8 w-8 rounded-lg flex items-center justify-center ${variantStyles[variant]}`}
          >
            <HugeiconsIcon icon={icon} className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <div className="flex items-center justify-between mt-1">
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <p
                className={`text-xs font-medium ${trendStyles[trend.direction]}`}
              >
                {trend.value}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
