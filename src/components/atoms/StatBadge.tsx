"use client";

import { Badge } from "@/components/ui/badge";

interface StatBadgeProps {
  label: string;
  tone?: "default" | "success" | "warning" | "danger";
}

const toneClasses: Record<NonNullable<StatBadgeProps["tone"]>, string> = {
  default: "",
  success: "bg-vert-menthe/10 text-vert-menthe border-vert-menthe/30",
  warning: "bg-jaune-orange/10 text-jaune-orange border-jaune-orange/30",
  danger: "bg-rouge-vif/10 text-rouge-vif border-rouge-vif/30",
};

export function StatBadge({ label, tone = "default" }: StatBadgeProps) {
  return (
    <Badge variant="outline" className={toneClasses[tone]}>
      {label}
    </Badge>
  );
}
