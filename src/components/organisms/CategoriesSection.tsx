"use client";

import { EmptyState } from "@/components/atoms/EmptyState";
import { LoadingSkeleton } from "@/components/atoms/LoadingSkeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatPrice } from "@/lib/utils";
import { getTopCategoryQueryOptions } from "@/services/queries/dashboard.queries";
import {
  Loading03Icon,
  PieChartIcon,
  TableIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Cell, Pie, PieChart } from "recharts";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface CategoriesSectionProps {
  year: number;
  month: number;
}

type CategoryItem = {
  category: string;
  ventes: number;
  fill?: string;
};

const normalizeCategories = (raw: unknown): CategoryItem[] => {
  if (raw && typeof raw === "object") {
    // Check if it's the API response format {success, message, data}
    if ("success" in raw && "data" in raw) {
      const apiResponse = raw as { success: boolean; data?: unknown };
      if (apiResponse.success && Array.isArray(apiResponse.data)) {
        return apiResponse.data as CategoryItem[];
      }
    }

    // Check for direct data array
    if ("data" in raw) {
      const apiResponse = raw as { data?: unknown };
      if (Array.isArray(apiResponse.data)) {
        return apiResponse.data as CategoryItem[];
      }
    }

    // Check if raw is already an array
    if (Array.isArray(raw)) {
      return raw as CategoryItem[];
    }
  }

  // Fallback: return empty array if no valid data
  console.log("No valid categories data found, returning empty array");
  return [];
};

// Couleurs pour le graphique en secteurs - style violet
const COLORS = [
  "#EC4899", // Rose (Artisanat & Arts)
  "#10B981", // Vert menthe (Produits moderne)
  "#F59E0B", // Orange (Chaussures)
  "#8B5CF6", // Violet (Maroquinerie artisanale)
  "#F97316", // Orange clair (Tricot & crochet)
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#EF4444", // Rouge
];

const chartConfig = {
  ventes: {
    label: "Ventes (FCFA)",
  },
};

export function CategoriesSection({ year, month }: CategoriesSectionProps) {
  const [selectedMonth, setSelectedMonth] = useState(month.toString());
  const [selectedYear, setSelectedYear] = useState(year.toString());
  const [viewMode, setViewMode] = useState("chart");

  const { data, isLoading, refetch } = useQuery(
    getTopCategoryQueryOptions({
      year: parseInt(selectedYear),
      month: selectedMonth === "all" ? month : parseInt(selectedMonth),
    }),
  );

  const items = normalizeCategories(data);

  const totalSales = items.reduce(
    (acc, item) => acc + Number(item.ventes || 0),
    0,
  );

  const totalCategories = items.length;

  // Format data for pie chart
  const chartData = items.map((item, index) => ({
    name: item.category,
    value: item.ventes || 0,
    percentage:
      totalSales > 0
        ? (((item.ventes || 0) / totalSales) * 100).toFixed(1)
        : "0",
    fill: item.fill || COLORS[index % COLORS.length],
  }));

  const topCategory = items.length > 0 ? items[0] : null;

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const years = [
    { value: "2022", label: "2022" },
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
    { value: "2026", label: "2026" },
    { value: "2027", label: "2027" },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-vif/10 flex items-center justify-center">
              <HugeiconsIcon
                icon={PieChartIcon}
                className="h-4 w-4 text-violet-vif"
              />
            </div>
            <div>
              <CardTitle className="text-xl">Category Distribution</CardTitle>
              <p className="text-sm text-muted-foreground">
                Distribution of sales by product category
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-violet-vif">
                {totalCategories} catégories
              </div>
              {topCategory && (
                <Badge className="bg-violet-vif text-white mt-1">
                  {topCategory.category} fait main{" "}
                  {totalSales > 0
                    ? (((topCategory.ventes || 0) / totalSales) * 100).toFixed(
                        0,
                      )
                    : 0}
                  % du total
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year.value} value={year.value}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            title="Aucune catégorie disponible"
            description="Aucune donnée retournée pour cette période."
          />
        ) : null}

        {!isLoading && items.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left side - Pie Chart */}
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-2">
                  Total sales
                </div>
                <div className="text-3xl font-bold">
                  {formatPrice(totalSales)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Distribution by category
                </div>
              </div>

              <ChartContainer config={chartConfig} className="h-[400px]">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={160}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name, props) => [
                          `${formatPrice(value as number)} (${props.payload?.percentage}%)`,
                          props.payload?.name,
                        ]}
                        labelFormatter={() => ""}
                      />
                    }
                  />
                </PieChart>
              </ChartContainer>
            </div>

            {/* Right side - Category breakdown */}
            <div className="space-y-4">
              <div className="space-y-3">
                {chartData.map((item, index) => (
                  <div
                    key={`category-${item.name}-${index}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.fill }}
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(item.value)} • {item.percentage}%
                        </p>
                      </div>
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
