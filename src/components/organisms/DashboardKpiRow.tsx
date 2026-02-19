"use client";

import { LoadingSkeleton } from "@/components/atoms/LoadingSkeleton";
import { KPIStatCard } from "@/components/molecules/KPIStatCard";
import { unwrapData } from "@/components/organisms/dashboard-data.utils";
import {
  getDashboardDataQueryOptions,
  getMetricsDataQueryOptions,
} from "@/services/queries/dashboard.queries";
import {
  CreditCardIcon,
  Package01Icon,
  ShoppingCart01Icon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons";
import { useQuery } from "@tanstack/react-query";

type DashboardStats = {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
};

type MetricsData = {
  monthlyGrowth?: number;
};

const emptyStats = (): DashboardStats => ({
  totalUsers: 0,
  totalOrders: 0,
  totalRevenue: 0,
  totalProducts: 0,
});

const toStats = (raw: unknown): DashboardStats => {
  const source = unwrapData(raw) as
    | DashboardStats
    | { statistics?: Array<Record<string, unknown>> };

  if (source && typeof source === "object" && Array.isArray(source.statistics)) {
    const stats = emptyStats();

    source.statistics.forEach((item, index) => {
      const name = String(
        item.label ?? item.name ?? item.key ?? item.title ?? "",
      ).toLowerCase();
      const value = Number(item.value ?? item.total ?? item.count ?? 0);

      if (name.includes("user") || name.includes("utilisateur")) {
        stats.totalUsers = value;
        return;
      }
      if (name.includes("order") || name.includes("commande")) {
        stats.totalOrders = value;
        return;
      }
      if (
        name.includes("revenue") ||
        name.includes("chiffre") ||
        name.includes("amount")
      ) {
        stats.totalRevenue = value;
        return;
      }
      if (name.includes("product") || name.includes("produit")) {
        stats.totalProducts = value;
        return;
      }

      if (index === 0) stats.totalUsers = value;
      if (index === 1) stats.totalOrders = value;
      if (index === 2) stats.totalRevenue = value;
      if (index === 3) stats.totalProducts = value;
    });

    return stats;
  }

  if (source && typeof source === "object") {
    const s = source as Partial<DashboardStats>;
    return {
      totalUsers: Number(s.totalUsers ?? 0),
      totalOrders: Number(s.totalOrders ?? 0),
      totalRevenue: Number(s.totalRevenue ?? 0),
      totalProducts: Number(s.totalProducts ?? 0),
    };
  }

  return emptyStats();
};

const toMetrics = (raw: unknown): MetricsData => {
  const source = unwrapData(raw) as { metrics?: MetricsData } & MetricsData;
  return (source?.metrics ?? source ?? {}) as MetricsData;
};

export function DashboardKpiRow() {
  const { data: statsRaw, isLoading: statsLoading } = useQuery(
    getDashboardDataQueryOptions(),
  );
  const { data: metricsRaw } = useQuery(getMetricsDataQueryOptions());

  if (statsLoading) {
    return <LoadingSkeleton rows={4} />;
  }

  const stats = toStats(statsRaw);
  const metrics = toMetrics(metricsRaw);
  const trend = Number(metrics.monthlyGrowth ?? 0);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <KPIStatCard
        title="Revenus totaux"
        value={`${Number(stats.totalRevenue || 0).toLocaleString("fr-FR")} FCFA`}
        trend={trend}
        icon={CreditCardIcon}
      />
      <KPIStatCard
        title="Utilisateurs"
        value={stats.totalUsers || 0}
        trend={trend}
        icon={UserMultiple02Icon}
      />
      <KPIStatCard
        title="Commandes"
        value={stats.totalOrders || 0}
        trend={trend}
        icon={ShoppingCart01Icon}
      />
      <KPIStatCard
        title="Produits"
        value={stats.totalProducts || 0}
        trend={trend}
        icon={Package01Icon}
      />
    </div>
  );
}
