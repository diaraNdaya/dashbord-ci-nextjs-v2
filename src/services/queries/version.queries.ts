import type {
  CreateVersionPayload,
  Version,
  VersionResponse,
  VersionSingleResponse,
} from "@/lib/types/version.types";
import { isApiError } from "@/lib/utils/type-guards";
import {
  createVersionAction,
  deleteVersionAction,
  getAllVersionsAction,
  getLatestVersionAction,
  getVersionByIdAction,
  updateVersionAction,
} from "@/services/actions/version.actions";

export const getAllVersionsQueryOptions = () => ({
  queryKey: ["versions"] as const,
  queryFn: async (): Promise<VersionResponse> => {
    const result = await getAllVersionsAction();

    if (isApiError(result)) {
      throw new Error(
        result.message || "Erreur lors de la récupération des versions",
      );
    }

    return result;
  },
});

export const getLatestVersionQueryOptions = () => ({
  queryKey: ["versions", "latest"] as const,
  queryFn: async (): Promise<VersionSingleResponse> => {
    const result = await getLatestVersionAction();

    if (isApiError(result)) {
      throw new Error(
        result.message ||
          "Erreur lors de la récupération de la dernière version",
      );
    }

    return result;
  },
});

export const getVersionByIdQueryOptions = (id: string) => ({
  queryKey: ["versions", id] as const,
  queryFn: async (): Promise<Version> => {
    const result = await getVersionByIdAction(id);

    if (isApiError(result)) {
      throw new Error(
        result.message || "Erreur lors de la récupération de la version",
      );
    }

    return result;
  },
});

export const createVersionMutationOptions = () => ({
  mutationFn: async (data: CreateVersionPayload): Promise<Version> => {
    const result = await createVersionAction(data);

    if (isApiError(result)) {
      throw new Error(
        result.message || "Erreur lors de la création de la version",
      );
    }

    return result;
  },
});

export const updateVersionMutationOptions = () => ({
  mutationFn: async ({
    id,
    data,
  }: {
    id: string;
    data: Partial<CreateVersionPayload>;
  }): Promise<Version> => {
    const result = await updateVersionAction(id, data);

    if (isApiError(result)) {
      throw new Error(
        result.message || "Erreur lors de la mise à jour de la version",
      );
    }

    return result;
  },
});

export const deleteVersionMutationOptions = () => ({
  mutationFn: async ({
    id,
  }: {
    id: string;
  }): Promise<{ success: boolean; message: string }> => {
    const result = await deleteVersionAction(id);

    if (isApiError(result)) {
      throw new Error(
        result.message || "Erreur lors de la suppression de la version",
      );
    }

    return result;
  },
});
