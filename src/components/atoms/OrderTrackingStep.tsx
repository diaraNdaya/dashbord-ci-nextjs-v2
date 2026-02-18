"use client";

import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";

interface OrderTrackingStepProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any; // Icône Hugeicons - type complexe, utilisation d'any temporaire
  label: string;
  completed: boolean;
  date?: string | null;
  isLast?: boolean;
}

export function OrderTrackingStep({
  icon,
  label,
  completed,
  date,
  isLast = false,
}: OrderTrackingStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-4"
    >
      {/* Icon */}
      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
            completed
              ? "bg-vert-menthe/20 border-vert-menthe text-vert-menthe dark:bg-vert-menthe/10"
              : "bg-gray-10/20 border-gray-30 text-gray-50 dark:bg-gray-90/20 dark:border-gray-50",
          )}
        >
          <HugeiconsIcon icon={icon} className="h-5 w-5" />
        </motion.div>

        {/* Connecting line */}
        {!isLast && (
          <div
            className={cn(
              "mt-2 h-8 w-0.5 transition-all duration-500",
              completed
                ? "bg-vert-menthe/40 dark:bg-vert-menthe/30"
                : "bg-gray-30/40 dark:bg-gray-50/30",
            )}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">
        <div className="flex items-center justify-between">
          <h4
            className={cn(
              "font-medium transition-colors duration-300",
              completed ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {label}
          </h4>
          {completed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="h-2 w-2 rounded-full bg-vert-menthe"
            />
          )}
        </div>
        {date && (
          <p className="text-sm text-muted-foreground mt-1">
            {new Date(date).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>
        )}
      </div>
    </motion.div>
  );
}
