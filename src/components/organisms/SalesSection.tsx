"use client";

import { EmptyState } from "@/components/atoms/EmptyState";
import { LoadingSkeleton } from "@/components/atoms/LoadingSkeleton";
import { ChartCardHeader } from "@/components/molecules/ChartCardHeader";
import { FilterPeriodSelect } from "@/components/molecules/FilterPeriodSelect";
import { MiniTable } from "@/components/molecules/MiniTable";
import { toArrayFromPayload } from "@/components/organisms/dashboard-data.utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getSalesReportQueryOptions } from "@/services/queries/dashboard.queries";
import { useQuery } from "@tanstack/react-query";

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

const normalizeSales = (raw: unknown): SalesItem[] =>
  toArrayFromPayload<SalesItem>(raw);

export function SalesSection({
  period,
  date,
  onPeriodChange,
  onDateChange,
}: SalesSectionProps) {
  const { data, isLoading } = useQuery(
    getSalesReportQueryOptions({ period, date }),
  );

  const items = normalizeSales(data);
  const max = Math.max(1, ...items.map((i) => Number(i.ventes || 0)));

  return (
    <Card>
      <CardContent className="p-5">
        <ChartCardHeader
          title="Ventes"
          subtitle="Evolution des ventes sur la periode"
          rightSlot={
            <div className="flex items-center gap-2">
              <FilterPeriodSelect value={period} onChange={onPeriodChange} />
              <Input
                type="date"
                value={date}
                onChange={(e) => onDateChange(e.target.value)}
                className="w-40"
              />
            </div>
          }
        />

        {isLoading ? <LoadingSkeleton rows={6} /> : null}

        {!isLoading && items.length === 0 ? (
          <EmptyState
            title="Aucune vente disponible"
            description="Ajustez la periode ou la date."
          />
        ) : null}

        {!isLoading && items.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-md border p-3">
              <div className="flex h-52 items-end gap-2">
                {items.map((item, idx) => {
                  const height = Math.max(
                    6,
                    Math.round((Number(item.ventes || 0) / max) * 100),
                  );
                  return (
                    <div key={`${item.date}-${idx}`} className="flex-1">
                      <div
                        className="w-full rounded-t bg-violet-vif/80"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <MiniTable
              headers={["Date", "Ventes", "Commandes"]}
              rows={items
                .slice(0, 7)
                .map((item) => [
                  item.date,
                  Number(item.ventes || 0),
                  Number(item.commandes || 0),
                ])}
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
