"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "motion/react";
import { memo } from "react";

interface OrderStatsCardsProps {
  stats: {
    total: number;
    pending: number;
    progress: number;
    delivered: number;
  };
}

export const OrderStatsCards = memo(({ stats }: OrderStatsCardsProps) => {
  const cards = [
    {
      title: "Total Articles",
      value: stats.total,
      className: "",
      delay: 0.1,
    },
    {
      title: "En Attente",
      value: stats.pending,
      className: "text-yellow-600",
      delay: 0.2,
    },
    {
      title: "En Cours",
      value: stats.progress,
      className: "text-orange-600",
      delay: 0.3,
    },
    {
      title: "Livrées",
      value: stats.delivered,
      className: "text-green-600",
      delay: 0.4,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: card.delay }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{card.title}</CardDescription>
              <CardTitle className={`text-2xl ${card.className}`}>
                {card.value}
              </CardTitle>
            </CardHeader>
          </Card>
        </motion.div>
      ))}
    </div>
  );
});

OrderStatsCards.displayName = "OrderStatsCards";
