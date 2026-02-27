"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CategoryStatsCardsProps {
  totalCategories: number;
  totalProducts: number;
  averagePerCategory: number;
}

export function CategoryStatsCards({
  totalCategories,
  totalProducts,
  averagePerCategory,
}: CategoryStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total catégories</CardDescription>
          <CardTitle className="text-2xl">{totalCategories}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total produits</CardDescription>
          <CardTitle className="text-2xl">{totalProducts}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Moyenne par catégorie</CardDescription>
          <CardTitle className="text-2xl">{averagePerCategory}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
