"use client";

import { HugeiconsIcon } from "@hugeicons/react";

interface IconBoxProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
}

export function IconBox({ icon }: IconBoxProps) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-vif/10">
      <HugeiconsIcon icon={icon} className="h-5 w-5 text-violet-vif" />
    </div>
  );
}
