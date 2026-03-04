"use client";

import { LoadingSkeleton } from "@/components/atoms/LoadingSkeleton";
import { KPIStatCard } from "@/components/molecules/KPIStatCard";
import { unwrapData } from "@/components/organisms/dashboard-data.utils";
import { formatPrice } from "@/lib/utils";
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
  if (raw && typeof raw === "object" && "data" in raw) {
    const apiResponse = raw as {
      data?: { statistics?: Array<Record<string, unknown>> };
    };

    if (
      apiResponse.data?.statistics &&
      Array.isArray(apiResponse.data.statistics)
    ) {
      const stats = emptyStats();

      apiResponse.data.statistics.forEach(
        (item: Record<string, unknown>, index: number) => {
          const title = String(
            item.title ?? item.label ?? item.name ?? "",
          ).toLowerCase();
          const value = Number(item.value ?? item.total ?? item.count ?? 0);

          if (
            title.includes("chiffre") ||
            title.includes("affaires") ||
            title.includes("revenue")
          ) {
            stats.totalRevenue = value;
          } else if (
            title.includes("client") ||
            title.includes("user") ||
            title.includes("utilisateur")
          ) {
            stats.totalUsers = value;
          } else if (title.includes("vendeur") || title.includes("seller")) {
            // For now, we'll use this as products count since we don't have a separate sellers stat
            stats.totalProducts = value;
          } else if (title.includes("commande") || title.includes("order")) {
            stats.totalOrders = value;
          }
        },
      );

      return stats;
    }
  }

  // Fallback to original logic
  const source = unwrapData(raw) as
    | DashboardStats
    | { statistics?: Array<Record<string, unknown>> };

  if (
    source &&
    typeof source === "object" &&
    "statistics" in source &&
    Array.isArray(source.statistics)
  ) {
    const stats = emptyStats();

    source.statistics.forEach(
      (item: Record<string, unknown>, index: number) => {
        const name = String(
          item.label ?? item.name ?? item.key ?? item.title ?? "",
        ).toLowerCase();
        const value = Number(item.value ?? item.total ?? item.count ?? 0);

        if (
          name.includes("user") ||
          name.includes("utilisateur") ||
          name.includes("client")
        ) {
          stats.totalUsers = value;
        } else if (name.includes("order") || name.includes("commande")) {
          stats.totalOrders = value;
        } else if (
          name.includes("revenue") ||
          name.includes("chiffre") ||
          name.includes("amount")
        ) {
          stats.totalRevenue = value;
        } else if (
          name.includes("product") ||
          name.includes("produit") ||
          name.includes("vendeur")
        ) {
          stats.totalProducts = value;
        } else {
          // Fallback to index-based mapping
          if (index === 0) stats.totalRevenue = value;
          if (index === 1) stats.totalUsers = value;
          if (index === 2) stats.totalProducts = value;
          if (index === 3) stats.totalOrders = value;
        }
      },
    );

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
  if (raw && typeof raw === "object" && "data" in raw) {
    const apiResponse = raw as { data?: { metrics?: Record<string, unknown> } };

    if (apiResponse.data?.metrics) {
      return apiResponse.data.metrics as MetricsData;
    }
  }

  // Fallback to original logic
  const source = unwrapData(raw) as {
    metrics?: MetricsData;
  } & MetricsData;

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
        value={formatPrice(stats.totalRevenue)}
        trend={trend}
        icon={CreditCardIcon}
      />
      <KPIStatCard
        title="Utilisateurs"
        value={Number(stats.totalUsers).toLocaleString()}
        trend={trend}
        icon={UserMultiple02Icon}
      />
      <KPIStatCard
        title="Commandes"
        value={Number(stats.totalOrders).toLocaleString()}
        trend={trend}
        icon={ShoppingCart01Icon}
      />
      <KPIStatCard
        title="Vendeurs"
        value={Number(stats.totalProducts).toLocaleString()}
        trend={trend}
        icon={Package01Icon}
      />
    </div>
  );
}
