"use client";

import { EmptyState } from "@/components/atoms/EmptyState";
import { LoadingSkeleton } from "@/components/atoms/LoadingSkeleton";
import { StatBadge } from "@/components/atoms/StatBadge";
import { ChartCardHeader } from "@/components/molecules/ChartCardHeader";
import { toArrayFromPayload } from "@/components/organisms/dashboard-data.utils";
import { Card, CardContent } from "@/components/ui/card";
import { getUserReportQueryOptions } from "@/services/queries/dashboard.queries";
import { useQuery } from "@tanstack/react-query";

interface UsersEvolutionSectionProps {
  year: number;
  month: number;
}

type UserPoint = {
  day: string;
  nouveaux: number;
  total: number;
};

const normalizeUsers = (raw: unknown): UserPoint[] => {
  console.log("Raw users data:", raw);

  if (raw && typeof raw === "object" && "data" in raw) {
    const apiResponse = raw as { data?: unknown };

    if (Array.isArray(apiResponse.data)) {
      console.log("Found users array in data:", apiResponse.data);
      console.log("First item structure:", apiResponse.data[0]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mappedData = apiResponse.data.map((item: any) => ({
        day: item.day || item.date || item.jour || String(item.day || ""),
        nouveaux: Number(
          item.nouveaux || item.new || item.nouveaux_utilisateurs || 0,
        ),
        total: Number(item.total || item.total_users || item.cumul || 0),
      }));

      console.log("Mapped data:", mappedData);
      console.log("First mapped item:", mappedData[0]);

      return mappedData as UserPoint[];
    }

    if (
      apiResponse.data &&
      typeof apiResponse.data === "object" &&
      "data" in apiResponse.data
    ) {
      const nestedData = (apiResponse.data as { data?: unknown }).data;
      if (Array.isArray(nestedData)) {
        console.log("Found nested users array:", nestedData);
        console.log("First nested item structure:", nestedData[0]);

        // Map the nested data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedData = nestedData.map((item: any) => ({
          day: item.day || item.date || item.jour || String(item.day || ""),
          nouveaux: Number(
            item.nouveaux || item.new || item.nouveaux_utilisateurs || 0,
          ),
          total: Number(item.total || item.total_users || item.cumul || 0),
        }));

        console.log("Mapped nested data:", mappedData);
        return mappedData as UserPoint[];
      }
    }
  }

  // Fallback to original logic
  const result = toArrayFromPayload<UserPoint>(raw);
  console.log("Users fallback result:", result);

  if (Array.isArray(result)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedFallback = result.map((item: any) => ({
      day: item.day || item.date || item.jour || String(item.day || ""),
      nouveaux: Number(
        item.nouveaux || item.new || item.nouveaux_utilisateurs || 0,
      ),
      total: Number(item.total || item.total_users || item.cumul || 0),
    }));
    console.log("Mapped fallback result:", mappedFallback);
    return mappedFallback;
  }

  return result;
};

export function UsersEvolutionSection({
  year,
  month,
}: UsersEvolutionSectionProps) {
  const { data, isLoading } = useQuery(
    getUserReportQueryOptions({ year, month }),
  );
  console.log("dataUsers", data?.data);
  const points = normalizeUsers(data);
  console.log("Points", points);
  console.log("Points length:", points.length);
  if (points.length > 0) {
    console.log("First point:", points[0]);
    console.log("Point keys:", Object.keys(points[0]));
    console.log("Point.total:", points[0].total);
    console.log("Point.nouveaux:", points[0].nouveaux);
    console.log("Point.day:", points[0].day);
  }

  const max = Math.max(1, ...points.map((p) => Number(p.total || 0)));
  console.log("Max value:", max);
  console.log(
    "All totals:",
    points.map((p) => Number(p.total || 0)),
  );

  const latest = points[points.length - 1];
  console.log("Latest point:", latest);

  return (
    <Card>
      <CardContent className="p-5">
        <ChartCardHeader
          title="Evolution utilisateurs"
          subtitle="Nouveaux utilisateurs et cumul"
          rightSlot={
            <div className="flex gap-2">
              <StatBadge label={`Mois ${month}`} />
              <StatBadge label={`${year}`} tone="success" />
            </div>
          }
        />

        {isLoading ? <LoadingSkeleton rows={5} /> : null}
        {!isLoading && points.length === 0 ? (
          <EmptyState title="Aucune donnee utilisateur" />
        ) : null}

        {!isLoading && points.length > 0 ? (
          <div className="space-y-4">
            <div className="flex h-44 items-end gap-1 rounded-md border p-2">
              {points.map((point, i) => {
                const total = Number(point.total || 0);
                const height = Math.max(5, Math.round((total / max) * 100));

                if (i < 5) {
                  // Log only first 5 for readability
                  console.log(
                    `Bar ${i}: total=${total}, max=${max}, height=${height}%`,
                  );
                }

                return (
                  <div key={`${point.day}-${i}`} className="flex-1">
                    <div
                      className="w-full rounded-t bg-bleu-doux"
                      style={{
                        height: `${height}%`,
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-md border p-3">
                <p className="text-muted-foreground">Nouveaux</p>
                <p className="text-xl font-semibold">
                  {Number(latest?.nouveaux || 0)}
                </p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-muted-foreground">Total</p>
                <p className="text-xl font-semibold">
                  {Number(latest?.total || 0)}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
