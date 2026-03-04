"use client";

import { Button } from "@/components/ui/button";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";

interface PageHeaderProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any; // HugeIcons icon type
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
  emoji?: string;
}

export function PageHeader({
  icon: Icon,
  title,
  description,
  buttonText,
  onButtonClick,
  emoji,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`grid items-center gap-6 ${buttonText && onButtonClick ? "grid-cols-[1fr_auto]" : "grid-cols-1"}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-vif/10 dark:bg-violet-vif/5">
          <HugeiconsIcon icon={Icon} className="h-6 w-6 text-violet-vif" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">
            {title} {emoji}
          </h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
      {buttonText && onButtonClick && (
        <Button
          onClick={onButtonClick}
          className="bg-violet-vif hover:bg-violet-vif/90 whitespace-nowrap"
        >
          <HugeiconsIcon icon={Add01Icon} className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
      )}
    </motion.div>
  );
}
