"use client";

import { EmptyState } from "@/components/atoms/EmptyState";
import { LoadingSkeleton } from "@/components/atoms/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/utils";
import { getSalesReportQueryOptions } from "@/services/queries/dashboard.queries";
import { Loading03Icon, TableIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

interface SalesSectionProps {
  period: string;
  date: string;
  onPeriodChange: (value: string) => void;
  onDateChange: (value: string) => void;
}

type SalesItem = {
  date: string;
  ventes: number;
  commandes: number;
};

const normalizeSales = (raw: unknown): SalesItem[] => {
  if (raw && typeof raw === "object") {
    // Check if it's the API response format {success, message, data}
    if ("success" in raw && "data" in raw) {
      const apiResponse = raw as { success: boolean; data?: unknown };
      if (apiResponse.success && Array.isArray(apiResponse.data)) {
        return apiResponse.data as SalesItem[];
      }
    }

    // Check for direct data array
    if ("data" in raw) {
      const apiResponse = raw as { data?: unknown };
      if (Array.isArray(apiResponse.data)) {
        return apiResponse.data as SalesItem[];
      }
    }

    // Check if raw is already an array
    if (Array.isArray(raw)) {
      return raw as SalesItem[];
    }
  }

  // Fallback: return empty array if no valid data
  console.log("No valid sales data found, returning empty array");
  return [];
};

const chartConfig = {
  revenue: {
    label: "Revenue (XOF)",
    color: "#FFA500", // Orange comme dans l'image
  },
  orders: {
    label: "Number of Orders",
    color: "#8B5CF6", // Violet comme dans l'image
  },
};

export function SalesSection({
  period,
  date,
  onPeriodChange,
  onDateChange,
}: SalesSectionProps) {
  const [viewMode, setViewMode] = useState("chart");

  const { data, isLoading, refetch } = useQuery(
    getSalesReportQueryOptions({ period, date }),
  );

  const items = normalizeSales(data);

  const totalRevenue = items.reduce((sum, item) => sum + (item.ventes || 0), 0);
  const growthRate = 15.1;

  const chartData = items.map((item) => ({
    period: new Date(item.date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
    }),
    revenue: item.ventes || 0,
    orders: item.commandes || 0,
  }));

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-jaune-orange/10 flex items-center justify-center">
                <HugeiconsIcon
                  icon={Loading03Icon}
                  className="h-4 w-4 text-jaune-orange"
                />
              </div>
              <div>
                <CardTitle className="text-xl">Sales Evolution</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Analysis of revenue and orders over time
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold text-2xl text-jaune-orange">
              {formatPrice(totalRevenue)}
            </span>
            <div className="flex items-center gap-1 text-green-600">
              <span className="text-xs">📈</span>
              <span className="font-medium">+{growthRate}%</span>
              <span className="text-muted-foreground">vs mois dernier</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={onPeriodChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-40"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="flex items-center gap-2"
            >
              <HugeiconsIcon icon={TableIcon} className="h-4 w-4" />
              Table View
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="flex items-center gap-2"
            >
              <HugeiconsIcon icon={Loading03Icon} className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading ? <LoadingSkeleton rows={6} /> : null}

        {!isLoading && items.length === 0 ? (
          <EmptyState
            title="Aucune donnée disponible"
            description="Ajustez la période ou la date pour voir les données."
          />
        ) : null}

        {!isLoading && items.length > 0 ? (
          <div className="space-y-4">
            {/* Chart */}
            <div className="h-[400px] w-full">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ComposedChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="period"
                    tick={{ fontSize: 12, fill: "#666" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    yAxisId="revenue"
                    orientation="left"
                    tick={{ fontSize: 12, fill: "#666" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <YAxis
                    yAxisId="orders"
                    orientation="right"
                    tick={{ fontSize: 12, fill: "#666" }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => [
                          name === "revenue"
                            ? formatPrice(value as number)
                            : value,
                          name === "revenue"
                            ? "Revenue (XOF)"
                            : "Number of Orders",
                        ]}
                      />
                    }
                  />

                  <ChartLegend content={<ChartLegendContent />} />

                  <Bar
                    yAxisId="revenue"
                    dataKey="revenue"
                    fill={chartConfig.revenue.color}
                    radius={[4, 4, 0, 0]}
                    name="Revenue (XOF)"
                  />

                  <Line
                    yAxisId="orders"
                    type="monotone"
                    dataKey="orders"
                    stroke={chartConfig.orders.color}
                    strokeWidth={3}
                    dot={{
                      fill: chartConfig.orders.color,
                      strokeWidth: 2,
                      r: 4,
                    }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    name="Number of Orders"
                  />
                </ComposedChart>
              </ChartContainer>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: chartConfig.revenue.color }}
                />
                <span className="text-sm font-medium">Revenue (XOF)</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: chartConfig.orders.color }}
                />
                <span className="text-sm font-medium">Number of Orders</span>
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
