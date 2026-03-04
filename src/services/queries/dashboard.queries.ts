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

    if (
      result &&
      typeof result === "object" &&
      "statistics" in result &&
      result.statistics
    ) {
      return result;
    }

    const errorMessage =
      result && typeof result === "object" && "message" in result
        ? result.message
        : "Erreur lors de la récupération des statistiques";
    throw new Error(errorMessage);
  },
});

export const getMetricsDataQueryOptions = () => ({
  queryKey: ["dashboard", "metrics"] as const,
  queryFn: async () => {
    const result = await getMetricsData();

    if (
      result &&
      typeof result === "object" &&
      "success" in result &&
      result.success
    ) {
      return result && typeof result === "object" && "metrics" in result
        ? result.metrics
        : result;
    }

    const errorMessage =
      result && typeof result === "object" && "message" in result
        ? result.message
        : "Erreur lors de la récupération des métriques";
    throw new Error(errorMessage);
  },
});

export const getProductReportQueryOptions = (credentials: {
  year: number;
  month: number;
}) => ({
  queryKey: ["dashboard", "products", "report", credentials] as const,
  queryFn: async () => {
    const result = await getProductReport(credentials);

    if (
      result &&
      typeof result === "object" &&
      "success" in result &&
      result.success
    ) {
      return result;
    }

    const errorMessage =
      result && typeof result === "object" && "message" in result
        ? result.message
        : "Erreur lors de la récupération du rapport produits";
    throw new Error(errorMessage);
  },
});

export const getSalesReportQueryOptions = (credentials: {
  period: string;
  date: string;
}) => ({
  queryKey: ["dashboard", "sales", "report", credentials] as const,
  queryFn: async () => {
    const result = await getSalesReport(credentials);

    if (
      result &&
      typeof result === "object" &&
      "success" in result &&
      result.success
    ) {
      return result;
    }

    const errorMessage =
      result && typeof result === "object" && "message" in result
        ? result.message
        : "Erreur lors de la récupération des ventes";
    throw new Error(errorMessage);
  },
});

export const getUserReportQueryOptions = (credentials: {
  year: number;
  month: number;
}) => ({
  queryKey: ["dashboard", "users", "report", credentials] as const,
  queryFn: async () => {
    const result = await getUserReport(credentials);

    if (
      result &&
      typeof result === "object" &&
      "success" in result &&
      result.success
    ) {
      return result;
    }

    const errorMessage =
      result && typeof result === "object" && "message" in result
        ? result.message
        : "Erreur lors de la récupération du rapport utilisateurs";
    throw new Error(errorMessage);
  },
});

export const getTopProductsByPeriodQueryOptions = (credentials: {
  period: string;
  date: string;
}) => ({
  queryKey: ["dashboard", "products", "top", "period", credentials] as const,
  queryFn: async () => {
    const result = await getTopProductsByPeriod(credentials);

    if (
      result &&
      typeof result === "object" &&
      "success" in result &&
      result.success
    ) {
      return result;
    }

    const errorMessage =
      result && typeof result === "object" && "message" in result
        ? result.message
        : "Erreur lors de la récupération des top produits";
    throw new Error(errorMessage);
  },
});

export const getTopSellerQueryOptions = (credentials: {
  year: number;
  month: number;
}) => ({
  queryKey: ["dashboard", "sellers", "top", credentials] as const,
  queryFn: async () => {
    const result = await getTopSeller(credentials);

    if (
      result &&
      typeof result === "object" &&
      "success" in result &&
      result.success
    ) {
      return result;
    }

    const errorMessage =
      result && typeof result === "object" && "message" in result
        ? result.message
        : "Erreur lors de la récupération des top vendeurs";
    throw new Error(errorMessage);
  },
});

export const getTopSellerByPeriodQueryOptions = (credentials: {
  period: string;
  date: string;
}) => ({
  queryKey: ["dashboard", "sellers", "top", "period", credentials] as const,
  queryFn: async () => {
    const result = await getTopSellerByPeriod(credentials);

    if (
      result &&
      typeof result === "object" &&
      "success" in result &&
      result.success
    ) {
      return result;
    }

    const errorMessage =
      result && typeof result === "object" && "message" in result
        ? result.message
        : "Erreur lors de la récupération des top vendeurs par période";
    throw new Error(errorMessage);
  },
});

export const getTopCategoryQueryOptions = (credentials: {
  year: number;
  month: number;
}) => ({
  queryKey: ["dashboard", "categories", "top", credentials] as const,
  queryFn: async () => {
    const result = await getTopCategory(credentials);

    if (
      result &&
      typeof result === "object" &&
      "success" in result &&
      result.success
    ) {
      return result;
    }

    const errorMessage =
      result && typeof result === "object" && "message" in result
        ? result.message
        : "Erreur lors de la récupération des top catégories";
    throw new Error(errorMessage);
  },
});
