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
    const result = await getCommissionGlobaleAction();

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
        : "Erreur lors de la récupération de la commission globale";
    throw new Error(errorMessage);
  },
});

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
    const result = await getTransactionsAction(
      period,
      date,
      page,
      limit,
      search,
    );

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
        : "Erreur lors de la récupération des transactions";
    throw new Error(errorMessage);
  },
});

export const getCommissionEvolutionQueryOptions = (
  period: string,
  date: string,
) => ({
  queryKey: ["finances", "commission", "evolution", period, date] as const,
  queryFn: async () => {
    const result = await getCommissionEvolutionAction(period, date);

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
        : "Erreur lors de la récupération de l'évolution des commissions";
    throw new Error(errorMessage);
  },
});

// Query pour les commissions des vendeurs
export const getCommissionSellersQueryOptions = (
  page: number,
  limit: number,
) => ({
  queryKey: ["finances", "commission", "sellers", page, limit] as const,
  queryFn: async () => {
    const result = await getCommissionSellersAction(page, limit);

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
        : "Erreur lors de la récupération des commissions des vendeurs";
    throw new Error(errorMessage);
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
    const result = await getCommissionSellerByIdAction(id, page, limit);

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
        : "Erreur lors de la récupération des commissions du vendeur";
    throw new Error(errorMessage);
  },
});
