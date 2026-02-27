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

    if (result.success) {
      return result;
    }
    throw new Error(
      result.message || "Erreur lors de la récupération des commandes",
    );
  },
});

export const getOneOrderQueryOptions = (id: string) => ({
  queryKey: ["orders", id] as const,
  queryFn: async () => {
    const result = await getOneOrderAction(id);

    if (result.success) {
      return result.order;
    }
    throw new Error(
      result.message || "Erreur lors de la récupération de la commande",
    );
  },
  enabled: !!id,
});

// Mutations
export const deleteOrderMutationOptions = () => ({
  mutationFn: deleteOrderAction,
});
