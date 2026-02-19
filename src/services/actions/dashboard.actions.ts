"use server";

import { SalesData, TopProductsData, UsersData } from "@/lib/types";
import { endpoints } from "@/services/endpoints";
import { serverRequest } from "@/services/server/axios-server.server";
import { safeAction } from "@/services/server/safe-action.server";

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
}

interface MetricsData {
  dailyVisits: number;
  monthlyGrowth: number;
  conversionRate: number;
}

interface TopSeller {
  id: string;
  name: string;
  sales: number;
  revenue: number;
}

interface TopCategory {
  id: string;
  name: string;
  sales: number;
  products: number;
}

export async function getProductReport(credentials: {
  year: number;
  month: number;
}) {
  return safeAction<TopProductsData[]>(async () => {
    return serverRequest<TopProductsData[]>(
      endpoints.DASHBOARD.getProductReport(credentials.year, credentials.month),
      {
        method: "GET",
      },
    );
  });
}

export async function getSalesReport(credentials: {
  period: string;
  date: string;
}) {
  return safeAction<SalesData[]>(async () => {
    return serverRequest<SalesData[]>(
      endpoints.DASHBOARD.getSalesData(credentials.period, credentials.date),
      {
        method: "GET",
      },
    );
  });
}

export async function getUserReport(credentials: {
  year: number;
  month: number;
}) {
  return safeAction<UsersData[]>(async () => {
    return serverRequest<UsersData[]>(
      endpoints.DASHBOARD.getUserData(credentials.month, credentials.year),
      {
        method: "GET",
      },
    );
  });
}

export async function getDashboardData() {
  return safeAction<DashboardStats>(async () => {
    return serverRequest<DashboardStats>(
      endpoints.DASHBOARD.getDashboardData(),
      {
        method: "GET",
      },
    );
  });
}

export async function getMetricsData() {
  return safeAction<MetricsData>(async () => {
    return serverRequest<MetricsData>(
      endpoints.DASHBOARD.getMetricsData(),
      {
        method: "GET",
      },
    );
  });
}

export async function getTopProductsByPeriod(credentials: {
  period: string;
  date: string;
}) {
  return safeAction<TopProductsData[]>(async () => {
    return serverRequest<TopProductsData[]>(
      endpoints.DASHBOARD.getTopProductsByPeriod(
        credentials.period,
        credentials.date,
      ),
      {
        method: "GET",
      },
    );
  });
}

export async function getTopSeller(credentials: {
  year: number;
  month: number;
}) {
  return safeAction<TopSeller[]>(async () => {
    return serverRequest<TopSeller[]>(
      endpoints.DASHBOARD.getTopSeller(credentials.year, credentials.month),
      {
        method: "GET",
      },
    );
  });
}

export async function getTopSellerByPeriod(credentials: {
  period: string;
  date: string;
}) {
  return safeAction<TopSeller[]>(async () => {
    return serverRequest<TopSeller[]>(
      endpoints.DASHBOARD.getTopSellerByPeriod(
        credentials.period,
        credentials.date,
      ),
      {
        method: "GET",
      },
    );
  });
}

export async function getTopCategory(credentials: {
  year: number;
  month: number;
}) {
  return safeAction<TopCategory[]>(async () => {
    return serverRequest<TopCategory[]>(
      endpoints.DASHBOARD.getTopCategory(credentials.year, credentials.month),
      {
        method: "GET",
      },
    );
  });
}
