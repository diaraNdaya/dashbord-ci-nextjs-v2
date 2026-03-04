import {
  loginAction,
  logoutAction,
  meAction,
} from "@/services/actions/auth.actions";

export const meQueryOptions = () => ({
  queryKey: ["me"] as const,
  queryFn: async () => {
    const result = await meAction();

    if (result.success) {
      return result;
    }
    throw new Error(
      result.message || "Erreur lors de la récupération du profil",
    );
  },
});

export const logoutMutationOptions = () => ({
  mutationFn: logoutAction,
});

export const loginMutationOptions = () => ({
  mutationFn: loginAction,
});
