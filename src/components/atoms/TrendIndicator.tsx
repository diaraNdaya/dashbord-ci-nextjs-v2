"use client";

import { Badge } from "@/components/ui/badge";
import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface TrendIndicatorProps {
  value?: number;
}

export function TrendIndicator({ value = 0 }: TrendIndicatorProps) {
  const isUp = value >= 0;
  return (
    <Badge variant="outline" className="gap-1">
      <HugeiconsIcon
        icon={isUp ? ArrowUp01Icon : ArrowDown01Icon}
        className={isUp ? "text-vert-menthe h-3.5 w-3.5" : "text-rouge-vif h-3.5 w-3.5"}
      />
      {isUp ? "+" : ""}
      {value}%
    </Badge>
  );
}
