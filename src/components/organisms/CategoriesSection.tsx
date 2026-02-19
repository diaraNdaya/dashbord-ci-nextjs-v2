"use client";

import { EmptyState } from "@/components/atoms/EmptyState";
import { LoadingSkeleton } from "@/components/atoms/LoadingSkeleton";
import { ChartCardHeader } from "@/components/molecules/ChartCardHeader";
import { MiniTable } from "@/components/molecules/MiniTable";
import { toArrayFromPayload } from "@/components/organisms/dashboard-data.utils";
import { Card, CardContent } from "@/components/ui/card";
import { getTopCategoryQueryOptions } from "@/services/queries/dashboard.queries";
import { useQuery } from "@tanstack/react-query";

interface CategoriesSectionProps {
  year: number;
  month: number;
}

type CategoryItem = {
  id: string;
  name: string;
  sales: number;
  products: number;
};

const normalizeCategories = (raw: unknown): CategoryItem[] =>
  toArrayFromPayload<CategoryItem>(raw);

export function CategoriesSection({ year, month }: CategoriesSectionProps) {
  const { data, isLoading } = useQuery(
    getTopCategoryQueryOptions({ year, month }),
  );

  const items = normalizeCategories(data);
  const total = items.reduce((acc, item) => acc + Number(item.sales || 0), 0);

  return (
    <Card>
      <CardContent className="p-5">
        <ChartCardHeader
          title="Categories"
          subtitle="Repartition des ventes par categorie"
        />

        {isLoading ? <LoadingSkeleton rows={6} /> : null}
        {!isLoading && items.length === 0 ? (
          <EmptyState
            title="Aucune categorie disponible"
            description="Aucune donnee retournee pour ce mois."
          />
        ) : null}

        {!isLoading && items.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="flex items-center justify-center">
              <div className="relative h-44 w-44 rounded-full border-[16px] border-violet-vif/20">
                <div className="absolute inset-0 flex items-center justify-center text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Total ventes
                    </p>
                    <p className="text-xl font-semibold">{total}</p>
                  </div>
                </div>
              </div>
            </div>
            <MiniTable
              headers={["Categorie", "Ventes", "Produits"]}
              rows={items
                .slice(0, 6)
                .map((item) => [
                  item.name,
                  Number(item.sales || 0),
                  Number(item.products || 0),
                ])}
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
