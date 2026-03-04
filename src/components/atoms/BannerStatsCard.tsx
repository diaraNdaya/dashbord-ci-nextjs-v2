import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "motion/react";

interface BannerStatsCardProps {
  title: string;
  value: number;
  className?: string;
  delay?: number;
}

export function BannerStatsCard({
  title,
  value,
  className = "",
  delay = 0,
}: BannerStatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>{title}</CardDescription>
          <CardTitle className={`text-2xl ${className}`}>{value}</CardTitle>
        </CardHeader>
      </Card>
    </motion.div>
  );
}
