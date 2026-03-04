import type {
  Newsletter,
  NewsletterApiResponse,
} from "@/lib/types/newsletter.types";
import { isApiError } from "@/lib/utils/type-guards";
import type { NewsletterSearchParams } from "@/services/actions/newsletter.actions";
import {
  deleteNewsletterAction,
  getAllNewslettersAction,
  getNewsletterByIdAction,
} from "@/services/actions/newsletter.actions";

export const getAllNewslettersQueryOptions = (
  page: number,
  limit: number,
  searchParams?: NewsletterSearchParams,
) => ({
  queryKey: ["newsletters", page, limit, searchParams] as const,
  queryFn: async (): Promise<NewsletterApiResponse> => {
    const result = await getAllNewslettersAction(page, limit, searchParams);

    if (isApiError(result)) {
      throw new Error(
        result.message || "Erreur lors de la récupération des newsletters",
      );
    }

    return result;
  },
});

export const getNewsletterByIdQueryOptions = (id: string) => ({
  queryKey: ["newsletters", id] as const,
  queryFn: async (): Promise<Newsletter> => {
    const result = await getNewsletterByIdAction(id);

    if (isApiError(result)) {
      throw new Error(
        result.message || "Erreur lors de la récupération du newsletter",
      );
    }

    return result;
  },
});

export const deleteNewsletterMutationOptions = () => ({
  mutationFn: async ({
    id,
  }: {
    id: string;
  }): Promise<{ success: boolean; message: string }> => {
    const result = await deleteNewsletterAction(id);

    if (isApiError(result)) {
      throw new Error(
        result.message || "Erreur lors de la suppression du newsletter",
      );
    }

    return result;
  },
});
