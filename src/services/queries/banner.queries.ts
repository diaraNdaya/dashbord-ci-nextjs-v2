import type {
  Banner,
  BannerResponse,
  CreateBannerCredential,
  UploadFileResponse,
} from "@/lib/types/banner.types";
import { isApiError } from "@/lib/utils/type-guards";
import type { BannerSearchParams } from "@/services/actions/banner.actions";
import {
  createBannerAction,
  deleteBannerAction,
  getAllBannersAction,
  getBannerByIdAction,
  updateBannerAction,
  uploadFileAction,
} from "@/services/actions/banner.actions";

export const getAllBannersQueryOptions = (
  page: number,
  limit: number,
  searchParams?: BannerSearchParams,
) => ({
  queryKey: ["banners", page, limit, searchParams] as const,
  queryFn: async (): Promise<BannerResponse> => {
    const result = await getAllBannersAction(page, limit, searchParams);

    if (isApiError(result)) {
      throw new Error(
        result.message || "Erreur lors de la récupération des banners",
      );
    }

    // result est maintenant directement BannerResponse
    return result;
  },
});

export const getBannerByIdQueryOptions = (id: string) => ({
  queryKey: ["banners", id] as const,
  queryFn: async (): Promise<Banner> => {
    const result = await getBannerByIdAction(id);

    if (isApiError(result)) {
      throw new Error(
        result.message || "Erreur lors de la récupération du banner",
      );
    }

    return result;
  },
});

export const createBannerMutationOptions = () => ({
  mutationFn: async (data: CreateBannerCredential): Promise<Banner> => {
    const result = await createBannerAction(data);

    if (isApiError(result)) {
      throw new Error(result.message || "Erreur lors de la création du banner");
    }

    return result;
  },
});

export const updateBannerMutationOptions = () => ({
  mutationFn: async ({
    id,
    data,
  }: {
    id: string;
    data: Partial<CreateBannerCredential>;
  }): Promise<Banner> => {
    const result = await updateBannerAction(id, data);

    if (isApiError(result)) {
      throw new Error(
        result.message || "Erreur lors de la mise à jour du banner",
      );
    }

    return result;
  },
});

export const deleteBannerMutationOptions = () => ({
  mutationFn: async ({
    id,
  }: {
    id: string;
  }): Promise<{ success: boolean; message: string }> => {
    const result = await deleteBannerAction(id);

    if (isApiError(result)) {
      throw new Error(
        result.message || "Erreur lors de la suppression du banner",
      );
    }

    return result;
  },
});

export const uploadFileMutationOptions = () => ({
  mutationFn: async ({ file }: { file: File }): Promise<UploadFileResponse> => {
    const result = await uploadFileAction(file);

    if (isApiError(result)) {
      throw new Error(result.message || "Erreur lors de l'upload du fichier");
    }

    return result;
  },
});
