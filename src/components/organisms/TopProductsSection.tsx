"use client";

import { EmptyState } from "@/components/atoms/EmptyState";
import { LoadingSkeleton } from "@/components/atoms/LoadingSkeleton";
import { ChartCardHeader } from "@/components/molecules/ChartCardHeader";
import { MiniTable } from "@/components/molecules/MiniTable";
import { toArrayFromPayload } from "@/components/organisms/dashboard-data.utils";
import { Card, CardContent } from "@/components/ui/card";
import { getTopProductsByPeriodQueryOptions } from "@/services/queries/dashboard.queries";
import { useQuery } from "@tanstack/react-query";

interface TopProductsSectionProps {
  period: string;
  date: string;
}

type ProductItem = {
  produit: string;
  ventes: number;
  revenus: number;
};

const normalizeProducts = (raw: unknown): ProductItem[] =>
  toArrayFromPayload<ProductItem>(raw);

export function TopProductsSection({ period, date }: TopProductsSectionProps) {
  const { data, isLoading } = useQuery(
    getTopProductsByPeriodQueryOptions({ period, date }),
  );
  const items = normalizeProducts(data);
  const max = Math.max(1, ...items.map((i) => Number(i.revenus || 0)));

  return (
    <Card>
      <CardContent className="p-5">
        <ChartCardHeader
          title="Top produits"
          subtitle="Produits les plus performants"
        />

        {isLoading ? <LoadingSkeleton rows={5} /> : null}
        {!isLoading && items.length === 0 ? (
          <EmptyState title="Aucun produit disponible" />
        ) : null}

        {!isLoading && items.length > 0 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              {items.slice(0, 5).map((item, idx) => (
                <div key={`${item.produit}-${idx}`} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate pr-2">{item.produit}</span>
                    <span>
                      {Number(item.revenus || 0).toLocaleString("fr-FR")} FCFA
                    </span>
                  </div>
                  <div className="h-2 rounded bg-muted">
                    <div
                      className="h-2 rounded bg-bleu-doux"
                      style={{
                        width: `${Math.max(8, Math.round((Number(item.revenus || 0) / max) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <MiniTable
              headers={["Produit", "Ventes", "Revenus"]}
              rows={items
                .slice(0, 6)
                .map((item) => [
                  item.produit,
                  Number(item.ventes || 0),
                  `${Number(item.revenus || 0).toLocaleString("fr-FR")} FCFA`,
                ])}
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
