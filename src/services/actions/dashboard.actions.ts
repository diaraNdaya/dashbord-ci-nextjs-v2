"use server";

import { SalesData, TopProductsData, UsersData } from "@/lib/types";
import { ApiResponse } from "@/services/api.type";
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
  return safeAction<ApiResponse<TopProductsData[]>>(async () => {
    const res = await serverRequest<ApiResponse<TopProductsData[]>>(
      endpoints.DASHBOARD.getProductReport(credentials.year, credentials.month),
      {
        method: "GET",
      },
    );
    return res;
  });
}

export async function getSalesReport(credentials: {
  period: string;
  date: string;
}) {
  return safeAction<ApiResponse<SalesData[]>>(async () => {
    const res = await serverRequest<ApiResponse<SalesData[]>>(
      endpoints.DASHBOARD.getSalesData(credentials.period, credentials.date),
      {
        method: "GET",
      },
    );
    return res;
  });
}

export async function getUserReport(credentials: {
  year: number;
  month: number;
}) {
  return safeAction<ApiResponse<UsersData[]>>(async () => {
    const res = await serverRequest<ApiResponse<UsersData[]>>(
      endpoints.DASHBOARD.getUserData(credentials.month, credentials.year),
      {
        method: "GET",
      },
    );
    return res;
  });
}

export async function getDashboardData() {
  return safeAction<ApiResponse<DashboardStats>>(async () => {
    const res = await serverRequest<ApiResponse<DashboardStats>>(
      endpoints.DASHBOARD.getDashboardData(),
      {
        method: "GET",
      },
    );
    return res;
  });
}

export async function getMetricsData() {
  return safeAction<ApiResponse<MetricsData>>(async () => {
    const res = await serverRequest<ApiResponse<MetricsData>>(
      endpoints.DASHBOARD.getMetricsData(),
      {
        method: "GET",
      },
    );
    return res;
  });
}

export async function getTopProductsByPeriod(credentials: {
  period: string;
  date: string;
}) {
  return safeAction<ApiResponse<TopProductsData[]>>(async () => {
    const res = await serverRequest<ApiResponse<TopProductsData[]>>(
      endpoints.DASHBOARD.getTopProductsByPeriod(
        credentials.period,
        credentials.date,
      ),
      {
        method: "GET",
      },
    );
    return res;
  });
}

export async function getTopSeller(credentials: {
  year: number;
  month: number;
}) {
  return safeAction<ApiResponse<TopSeller[]>>(async () => {
    const res = await serverRequest<ApiResponse<TopSeller[]>>(
      endpoints.DASHBOARD.getTopSeller(credentials.year, credentials.month),
      {
        method: "GET",
      },
    );
    return res;
  });
}

export async function getTopSellerByPeriod(credentials: {
  period: string;
  date: string;
}) {
  return safeAction<ApiResponse<TopSeller[]>>(async () => {
    const res = await serverRequest<ApiResponse<TopSeller[]>>(
      endpoints.DASHBOARD.getTopSellerByPeriod(
        credentials.period,
        credentials.date,
      ),
      {
        method: "GET",
      },
    );
    return res;
  });
}

export async function getTopCategory(credentials: {
  year: number;
  month: number;
}) {
  return safeAction<ApiResponse<TopCategory[]>>(async () => {
    const res = await serverRequest<ApiResponse<TopCategory[]>>(
      endpoints.DASHBOARD.getTopCategory(credentials.year, credentials.month),
      {
        method: "GET",
      },
    );
    return res;
  });
}
