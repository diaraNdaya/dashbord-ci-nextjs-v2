"use client";

import { HugeiconsIcon } from "@hugeicons/react";

interface CustomerDetailRowProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any; // Icône Hugeicons
  label: string;
}

export function CustomerDetailRow({ icon, label }: CustomerDetailRowProps) {
  return (
    <div className="flex items-center gap-2">
      <HugeiconsIcon icon={icon} className="h-4 w-4 text-muted-foreground" />
      <span>{label}</span>
    </div>
  );
}
