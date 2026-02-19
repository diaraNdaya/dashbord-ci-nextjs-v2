"use client";

import { ReactNode } from "react";

interface ChartCardHeaderProps {
  title: string;
  subtitle?: string;
  rightSlot?: ReactNode;
}

export function ChartCardHeader({
  title,
  subtitle,
  rightSlot,
}: ChartCardHeaderProps) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        {subtitle ? (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {rightSlot}
    </div>
  );
}
