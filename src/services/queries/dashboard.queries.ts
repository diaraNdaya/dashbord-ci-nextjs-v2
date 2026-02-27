import {
  getDashboardData,
  getMetricsData,
  getProductReport,
  getSalesReport,
  getTopCategory,
  getTopProductsByPeriod,
  getTopSeller,
  getTopSellerByPeriod,
  getUserReport,
} from "@/services/actions/dashboard.actions";

export const getDashboardDataQueryOptions = () => ({
  queryKey: ["dashboard", "stats"] as const,
  queryFn: async () => {
    const result = await getDashboardData();

    if (result?.statistics) {
      return result;
    }
    throw new Error(
      result.message || "Erreur lors de la r�cup�ration des statistiques",
    );
  },
});

export const getMetricsDataQueryOptions = () => ({
  queryKey: ["dashboard", "metrics"] as const,
  queryFn: async () => {
    const result = await getMetricsData();
    if (result.success) {
      return result;
    }

    throw new Error(
      result.message || "Erreur lors de la r�cup�ration des m�triques",
    );
  },
});

export const getProductReportQueryOptions = (credentials: {
  year: number;
  month: number;
}) => ({
  queryKey: ["dashboard", "products", "report", credentials] as const,
  queryFn: async () => {
    const result = await getProductReport(credentials);
    if (result.success) {
      return result;
    }

    throw new Error(
      result.message || "Erreur lors de la r�cup�ration du rapport produits",
    );
  },
});

export const getSalesReportQueryOptions = (credentials: {
  period: string;
  date: string;
}) => ({
  queryKey: ["dashboard", "sales", "report", credentials] as const,
  queryFn: async () => {
    const result = await getSalesReport(credentials);
    if (result.success) {
      return result;
    }

    throw new Error(
      result.message || "Erreur lors de la r�cup�ration des ventes",
    );
  },
});

export const getUserReportQueryOptions = (credentials: {
  year: number;
  month: number;
}) => ({
  queryKey: ["dashboard", "users", "report", credentials] as const,
  queryFn: async () => {
    const result = await getUserReport(credentials);
    if (result.success) {
      return result;
    }

    throw new Error(
      result.message ||
        "Erreur lors de la récupération du rapport utilisateurs",
    );
  },
});

export const getTopProductsByPeriodQueryOptions = (credentials: {
  period: string;
  date: string;
}) => ({
  queryKey: ["dashboard", "products", "top", "period", credentials] as const,
  queryFn: async () => {
    const result = await getTopProductsByPeriod(credentials);
    if (result.success) {
      return result;
    }

    throw new Error(
      result.message || "Erreur lors de la récupération des top produits",
    );
  },
});

export const getTopSellerQueryOptions = (credentials: {
  year: number;
  month: number;
}) => ({
  queryKey: ["dashboard", "sellers", "top", credentials] as const,
  queryFn: async () => {
    const result = await getTopSeller(credentials);
    if (result.success) {
      return result;
    }

    throw new Error(
      result.message || "Erreur lors de la r�cup�ration des top vendeurs",
    );
  },
});

export const getTopSellerByPeriodQueryOptions = (credentials: {
  period: string;
  date: string;
}) => ({
  queryKey: ["dashboard", "sellers", "top", "period", credentials] as const,
  queryFn: async () => {
    const result = await getTopSellerByPeriod(credentials);
    if (result.success) {
      return result;
    }

    throw new Error(
      result.message ||
        "Erreur lors de la r�cup�ration des top vendeurs par p�riode",
    );
  },
});

export const getTopCategoryQueryOptions = (credentials: {
  year: number;
  month: number;
}) => ({
  queryKey: ["dashboard", "categories", "top", credentials] as const,
  queryFn: async () => {
    const result = await getTopCategory(credentials);
    if (result.success) {
      return result;
    }

    throw new Error(
      result.message || "Erreur lors de la r�cup�ration des top cat�gories",
    );
  },
});
