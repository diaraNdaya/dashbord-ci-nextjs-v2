"use client";

import { IconBox } from "@/components/atoms/IconBox";
import { TrendIndicator } from "@/components/atoms/TrendIndicator";
import { Card, CardContent } from "@/components/ui/card";

interface KPIStatCardProps {
  title: string;
  value: string | number;
  trend?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
}

export function KPIStatCard({ title, value, trend = 0, icon }: KPIStatCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-1 text-2xl font-semibold">{value}</p>
          </div>
          <IconBox icon={icon} />
        </div>
        <div className="mt-3">
          <TrendIndicator value={trend} />
        </div>
      </CardContent>
    </Card>
  );
}
