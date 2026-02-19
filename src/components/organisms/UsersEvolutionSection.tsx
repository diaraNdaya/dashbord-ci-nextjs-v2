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

const normalizeUsers = (raw: unknown): UserPoint[] =>
  toArrayFromPayload<UserPoint>(raw);

export function UsersEvolutionSection({
  year,
  month,
}: UsersEvolutionSectionProps) {
  const { data, isLoading } = useQuery(
    getUserReportQueryOptions({ year, month }),
  );
  const points = normalizeUsers(data);
  const max = Math.max(1, ...points.map((p) => Number(p.total || 0)));
  const latest = points[points.length - 1];

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
              {points.map((point, i) => (
                <div key={`${point.day}-${i}`} className="flex-1">
                  <div
                    className="w-full rounded-t bg-bleu-doux"
                    style={{
                      height: `${Math.max(5, Math.round((Number(point.total || 0) / max) * 100))}%`,
                    }}
                  />
                </div>
              ))}
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
