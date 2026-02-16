import { meQueryOptions } from "@/services/queries/auth.queries";
import { useQuery } from "@tanstack/react-query";

export function useCurrentUser() {
  const query = useQuery(meQueryOptions());

  return {
    user: query.data,
    isLoading: query.isLoading,
    error: query.error,
    isError: query.isError,
  };
}
