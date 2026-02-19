"use client";

import { EmptyState } from "@/components/atoms/EmptyState";
import { LoadingSkeleton } from "@/components/atoms/LoadingSkeleton";
import { ChartCardHeader } from "@/components/molecules/ChartCardHeader";
import { MiniTable } from "@/components/molecules/MiniTable";
import { toArrayFromPayload } from "@/components/organisms/dashboard-data.utils";
import { Card, CardContent } from "@/components/ui/card";
import { getTopSellerByPeriodQueryOptions } from "@/services/queries/dashboard.queries";
import { useQuery } from "@tanstack/react-query";

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

const normalizeSellers = (raw: unknown): SellerItem[] =>
  toArrayFromPayload<SellerItem>(raw);

export function TopSellersSection({ period, date }: TopSellersSectionProps) {
  const { data, isLoading } = useQuery(
    getTopSellerByPeriodQueryOptions({ period, date }),
  );
  const items = normalizeSellers(data);
  const max = Math.max(1, ...items.map((i) => Number(i.revenue || 0)));

  return (
    <Card>
      <CardContent className="p-5">
        <ChartCardHeader
          title="Top vendeurs"
          subtitle="Classement par chiffre d'affaires"
        />
        {isLoading ? <LoadingSkeleton rows={5} /> : null}
        {!isLoading && items.length === 0 ? (
          <EmptyState title="Aucun vendeur disponible" />
        ) : null}
        {!isLoading && items.length > 0 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              {items.slice(0, 5).map((item) => (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{item.name}</span>
                    <span>
                      {Number(item.revenue || 0).toLocaleString("fr-FR")} FCFA
                    </span>
                  </div>
                  <div className="h-2 rounded bg-muted">
                    <div
                      className="h-2 rounded bg-violet-vif"
                      style={{
                        width: `${Math.max(8, Math.round((Number(item.revenue || 0) / max) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <MiniTable
              headers={["Vendeur", "Ventes", "Revenu"]}
              rows={items
                .slice(0, 6)
                .map((item) => [
                  item.name,
                  Number(item.sales || 0),
                  `${Number(item.revenue || 0).toLocaleString("fr-FR")} FCFA`,
                ])}
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
