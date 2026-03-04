import {
  deleteOrderAction,
  fetchOrdersAction,
  getOneOrderAction,
} from "@/services/actions/orders.actions";

// Queries pour les commandes
export const fetchOrdersQueryOptions = (
  page: number,
  limit: number,
  statut?: string,
) => ({
  queryKey: ["orders", page, limit, statut] as const,
  queryFn: async () => {
    const result = await fetchOrdersAction(page, limit, statut);

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
        : "Erreur lors de la récupération des commandes";
    throw new Error(errorMessage);
  },
});

export const getOneOrderQueryOptions = (id: string) => ({
  queryKey: ["orders", id] as const,
  queryFn: async () => {
    const result = await getOneOrderAction(id);

    if (
      result &&
      typeof result === "object" &&
      "success" in result &&
      result.success
    ) {
      return result && typeof result === "object" && "order" in result
        ? result.order
        : result;
    }

    const errorMessage =
      result && typeof result === "object" && "message" in result
        ? result.message
        : "Erreur lors de la récupération de la commande";
    throw new Error(errorMessage);
  },
  enabled: !!id,
});

// Mutations
export const deleteOrderMutationOptions = () => ({
  mutationFn: deleteOrderAction,
});
