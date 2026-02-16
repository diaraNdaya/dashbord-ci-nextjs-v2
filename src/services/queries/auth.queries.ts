import { logoutAction, meAction } from "@/services/server/auth.actions";

export const meQueryOptions = () => ({
  queryKey: ["me"] as const,
  queryFn: async () => {
    const result = await meAction();
    if (result.success) {
      return result.data.data.user;
    }
    throw new Error(
      result.error.message || "Erreur lors de la récupération du profil",
    );
  },
});

export const logoutMutationOptions = () => ({
  mutationFn: logoutAction,
});
