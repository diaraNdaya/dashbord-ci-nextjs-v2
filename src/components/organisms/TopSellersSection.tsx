"use client";

import { EmptyState } from "@/components/atoms/EmptyState";
import { LoadingSkeleton } from "@/components/atoms/LoadingSkeleton";
import { ChartCardHeader } from "@/components/molecules/ChartCardHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatPrice } from "@/lib/utils";
import { getTopSellerByPeriodQueryOptions } from "@/services/queries/dashboard.queries";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface TopSellersSectionProps {
  period: string;
  date: string;
}

type SellerItem = {
  id: string;
  name: string;
  sales: number;
  revenue: number;
};

const normalizeSellers = (raw: unknown): SellerItem[] => {
  // Handle the actual API response structure
  if (raw && typeof raw === "object" && "data" in raw) {
    const apiResponse = raw as { data?: unknown };

    if (Array.isArray(apiResponse.data)) {
      return apiResponse.data as SellerItem[];
    }

    // If data is nested deeper
    if (
      apiResponse.data &&
      typeof apiResponse.data === "object" &&
      "data" in apiResponse.data
    ) {
      const nestedData = (apiResponse.data as { data?: unknown }).data;
      if (Array.isArray(nestedData)) {
        return nestedData as SellerItem[];
      }
    }
  }

  // Fallback: return empty array if no valid data
  return [];
};

const chartConfig = {
  revenue: {
    label: "Chiffre d'affaires",
    color: "hsl(var(--chart-1))",
  },
  sales: {
    label: "Nombre de ventes",
    color: "hsl(var(--chart-2))",
  },
};

export function TopSellersSection({ period, date }: TopSellersSectionProps) {
  const { data, isLoading } = useQuery(
    getTopSellerByPeriodQueryOptions({ period, date }),
  );

  // Properly handle ActionResult type
  const responseData =
    data && typeof data === "object" && "data" in data ? data.data : data;
  const items = normalizeSellers(responseData);
  const totalSellers = items.length;
  const totalRevenue = items.reduce(
    (sum, item) => sum + (item.revenue || 0),
    0,
  );

  const chartData = items.slice(0, 5).map((item, index) => ({
    name:
      item.name.length > 15 ? `${item.name.substring(0, 15)}...` : item.name,
    fullName: item.name,
    revenue: item.revenue || 0,
    sales: item.sales || 0,
    rank: index + 1,
  }));

  return (
    <Card>
      <CardContent className="p-6">
        <ChartCardHeader
          title="Top Vendeurs"
          subtitle="Classement des meilleurs vendeurs par performance"
        />

        {isLoading ? <LoadingSkeleton rows={5} /> : null}

        {!isLoading && items.length === 0 ? (
          <EmptyState
            title="Aucun vendeur disponible"
            description="Aucune donnée de vente pour cette période."
          />
        ) : null}

        {!isLoading && items.length > 0 ? (
          <div className="space-y-6">
            {/* KPI Summary */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg border bg-gradient-to-br from-pink-50 to-pink-100 p-4 dark:from-pink-950/20 dark:to-pink-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-pink-600 dark:text-pink-400">
                      Vendeurs Actifs
                    </p>
                    <p className="text-2xl font-bold text-pink-900 dark:text-pink-100">
                      {totalSellers}
                    </p>
                  </div>
                  <div className="rounded-full bg-pink-200 p-2 dark:bg-pink-800">
                    <svg
                      className="h-6 w-6 text-pink-600 dark:text-pink-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-gradient-to-br from-blue-50 to-blue-100 p-4 dark:from-blue-950/20 dark:to-blue-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      CA Total
                    </p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {formatPrice(totalRevenue)}
                    </p>
                  </div>
                  <div className="rounded-full bg-blue-200 p-2 dark:bg-blue-800">
                    <svg
                      className="h-6 w-6 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Sellers Chart */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Top 5 Vendeurs</h3>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <BarChart
                  data={chartData}
                  layout="horizontal"
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    width={100}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => [
                          name === "revenue"
                            ? formatPrice(value as number)
                            : value,
                          name === "revenue" ? "Chiffre d'affaires" : "Ventes",
                        ]}
                        labelFormatter={(label, payload) => {
                          const item = payload?.[0]?.payload;
                          return item
                            ? `${item.fullName} (#${item.rank})`
                            : label;
                        }}
                      />
                    }
                  />
                  <Bar
                    dataKey="revenue"
                    fill="var(--color-revenue)"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>

            {/* Detailed Rankings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Classement Détaillé</h3>
              <div className="space-y-3">
                {items.slice(0, 8).map((item, index) => (
                  <div
                    key={item.id || `seller-${index}`}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={index < 3 ? "default" : "secondary"}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index === 0
                            ? "bg-yellow-500 text-yellow-900"
                            : index === 1
                              ? "bg-gray-400 text-gray-900"
                              : index === 2
                                ? "bg-orange-500 text-orange-900"
                                : ""
                        }`}
                      >
                        {index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.sales || 0} ventes
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatPrice(item.revenue || 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {totalRevenue > 0
                          ? `${(((item.revenue || 0) / totalRevenue) * 100).toFixed(1)}%`
                          : "0%"}{" "}
                        du total
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
