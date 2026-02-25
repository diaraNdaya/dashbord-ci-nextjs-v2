import {
  getCommissionEvolutionAction,
  getCommissionGlobaleAction,
  getCommissionSellerByIdAction,
  getCommissionSellersAction,
  getTransactionsAction,
} from "@/services/actions/finances.actions";

// Query pour la commission globale
export const getCommissionGlobaleQueryOptions = () => ({
  queryKey: ["finances", "commission", "globale"] as const,
  queryFn: async () => {
    console.log("[finances][commission][globale] query start");
    const result = await getCommissionGlobaleAction();
    if (result.success) {
      console.log(
        "[finances][commission][globale] query success:",
        result.data,
      );
      return result.data;
    }
    throw new Error(
      result.error.message ||
        "Erreur lors de la récupération de la commission globale",
    );
  },
});

// Query pour les transactions
export const getTransactionsQueryOptions = (
  period: string,
  date: string,
  page: number,
  limit: number,
  search?: string,
) => ({
  queryKey: [
    "finances",
    "transactions",
    period,
    date,
    page,
    limit,
    search,
  ] as const,
  queryFn: async () => {
    console.log("[finances][transactions] query start:", {
      period,
      date,
      page,
      limit,
      search,
    });
    const result = await getTransactionsAction(
      period,
      date,
      page,
      limit,
      search,
    );
    if (result.success) {
      console.log("[finances][transactions] query success:", result.data);
      return result.data;
    }
    throw new Error(
      result.error.message || "Erreur lors de la récupération des transactions",
    );
  },
});

// Query pour l'évolution des commissions
export const getCommissionEvolutionQueryOptions = (
  period: string,
  date: string,
) => ({
  queryKey: ["finances", "commission", "evolution", period, date] as const,
  queryFn: async () => {
    console.log("[finances][commission][evolution] query start:", {
      period,
      date,
    });
    const result = await getCommissionEvolutionAction(period, date);
    if (result.success) {
      console.log(
        "[finances][commission][evolution] query success:",
        result.data,
      );
      return result.data;
    }
    throw new Error(
      result.error.message ||
        "Erreur lors de la récupération de l'évolution des commissions",
    );
  },
});

// Query pour les commissions des vendeurs
export const getCommissionSellersQueryOptions = (
  page: number,
  limit: number,
) => ({
  queryKey: ["finances", "commission", "sellers", page, limit] as const,
  queryFn: async () => {
    console.log("[finances][commission][sellers] query start:", {
      page,
      limit,
    });
    const result = await getCommissionSellersAction(page, limit);
    if (result.success) {
      console.log(
        "[finances][commission][sellers] query success:",
        result.data,
      );
      return result.data;
    }
    throw new Error(
      result.error.message ||
        "Erreur lors de la récupération des commissions des vendeurs",
    );
  },
});

// Query pour les commissions d'un vendeur spécifique
export const getCommissionSellerByIdQueryOptions = (
  id: string,
  page: number,
  limit: number,
) => ({
  queryKey: ["finances", "commission", "seller", id, page, limit] as const,
  queryFn: async () => {
    console.log("[finances][commission][seller] query start:", {
      id,
      page,
      limit,
    });
    const result = await getCommissionSellerByIdAction(id, page, limit);
    if (result.success) {
      console.log("[finances][commission][seller] query success:", result.data);
      return result.data;
    }
    throw new Error(
      result.error.message ||
        "Erreur lors de la récupération des commissions du vendeur",
    );
  },
});
