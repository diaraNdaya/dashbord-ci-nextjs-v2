"use client";

import { EmptyState } from "@/components/atoms/EmptyState";
import { LoadingSkeleton } from "@/components/atoms/LoadingSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUserReportQueryOptions } from "@/services/queries/dashboard.queries";
import { Loading03Icon, TableIcon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

interface UsersEvolutionSectionProps {
  year: number;
  month: number;
}

type UserPoint = {
  day: string;
  users: number;
};

const normalizeUsers = (raw: unknown): UserPoint[] => {
  if (raw && typeof raw === "object" && "data" in raw) {
    const apiResponse = raw as { data?: unknown };

    if (Array.isArray(apiResponse.data)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mappedData = apiResponse.data.map((item: any) => ({
        day: item.day || item.date || item.jour || String(item.day || ""),
        users: Number(item.users || item.nouveaux || item.new || 0),
      }));

      return mappedData as UserPoint[];
    }
  }

  // Fallback: return empty array if no valid data
  return [];
};

const chartConfig = {
  users: {
    label: "Utilisateurs",
    color: "#10B981", // Vert menthe
  },
};

export function UsersEvolutionSection({
  year,
  month,
}: UsersEvolutionSectionProps) {
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState(year.toString());
  const [viewMode, setViewMode] = useState("chart");

  const { data, isLoading, refetch } = useQuery(
    getUserReportQueryOptions({ year: parseInt(selectedYear), month }),
  );

  const points = normalizeUsers(data);

  // Calculate statistics
  const newUsersThisMonth = 40; // Comme dans votre image

  // Format data for chart
  const chartData = points.map((point) => ({
    day: `${point.day} mars`, // Format comme dans l'image
    dayNumber: parseInt(point.day),
    users: point.users || 0,
  }));

  const months = [
    { value: "all", label: "Tous les mois" },
    { value: "1", label: "Janvier" },
    { value: "2", label: "Février" },
    { value: "3", label: "Mars" },
    { value: "4", label: "Avril" },
    { value: "5", label: "Mai" },
    { value: "6", label: "Juin" },
    { value: "7", label: "Juillet" },
    { value: "8", label: "Août" },
    { value: "9", label: "Septembre" },
    { value: "10", label: "Octobre" },
    { value: "11", label: "Novembre" },
    { value: "12", label: "Décembre" },
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
            <div className="w-8 h-8 rounded-lg bg-vert-menthe/10 flex items-center justify-center">
              <HugeiconsIcon
                icon={UserIcon}
                className="h-4 w-4 text-vert-menthe"
              />
            </div>
            <div>
              <CardTitle className="text-xl">User Growth</CardTitle>
              <p className="text-sm text-muted-foreground">
                Evolution of registered users
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-vert-menthe">
                121 utilisateurs
              </div>
              <Badge className="bg-vert-menthe text-white mt-1">
                📈 +{newUsersThisMonth} nouveaux ce mois
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-40">
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
              Afficher tableau
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

        {/* Chart Title */}
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Évolution des Utilisateurs</h3>
          <p className="text-sm text-muted-foreground">
            Evolution mensuelle - {selectedYear}
          </p>
        </div>

        {isLoading ? <LoadingSkeleton rows={6} /> : null}

        {!isLoading && points.length === 0 ? (
          <EmptyState
            title="Aucune donnée utilisateur"
            description="Aucune donnée d'évolution pour cette période."
          />
        ) : null}

        {!isLoading && points.length > 0 ? (
          <div className="space-y-6">
            {/* Line Chart */}
            <div className="h-[300px] w-full">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12, fill: "#666" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[0, 4]}
                    ticks={[0, 1, 2, 3, 4]}
                    tick={{ fontSize: 12, fill: "#666" }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => [value, "Nouveaux utilisateurs"]}
                      />
                    }
                  />

                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke={chartConfig.users.color}
                    strokeWidth={3}
                    dot={{
                      fill: chartConfig.users.color,
                      strokeWidth: 2,
                      r: 4,
                    }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>

            {/* Bottom Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">
                  Total annuel
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">
                  Moyenne mensuelle
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">
                  Total fin d&apos;année
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
