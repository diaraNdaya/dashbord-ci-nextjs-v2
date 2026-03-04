"use server";

import type {
  Banner,
  BannerResponse,
  CreateBannerCredential,
  UploadFileResponse,
} from "@/lib/types/banner.types";
import { serverRequest } from "@/services/server/axios-server.server";
import { safeAction } from "@/services/server/safe-action.server";
import { endpoints } from "../endpoints";

// Types pour les paramètres de recherche
export interface BannerSearchParams {
  description?: string;
  provider?: string;
}

export async function getAllBannersAction(
  page: number,
  limit: number,
  searchParams?: BannerSearchParams,
) {
  return safeAction<BannerResponse>(async () => {
    let url = endpoints.BANNER.getAll(page, limit);

    if (searchParams) {
      const params = new URLSearchParams();
      if (searchParams.description && searchParams.description.trim() !== "") {
        params.append("description", searchParams.description.trim());
      }
      if (searchParams.provider && searchParams.provider.trim() !== "") {
        params.append("provider", searchParams.provider.trim());
      }
      const paramString = params.toString();
      if (paramString) {
        url += `&${paramString}`;
      }
    }

    return serverRequest<BannerResponse>(url, {
      method: "GET",
    });
  });
}

// Action pour créer un banner
export async function createBannerAction(data: CreateBannerCredential) {
  return safeAction<Banner>(async () => {
    return serverRequest<Banner>(endpoints.BANNER.createBanner(), {
      method: "POST",
      body: JSON.stringify(data),
    });
  });
}

// Action pour mettre à jour un banner
export async function updateBannerAction(
  id: string,
  data: Partial<CreateBannerCredential>,
) {
  return safeAction<Banner>(async () => {
    return serverRequest<Banner>(endpoints.BANNER.updateBanner(id), {
      method: "PUT",
      body: JSON.stringify(data),
    });
  });
}

// Action pour supprimer un banner
export async function deleteBannerAction(id: string) {
  return safeAction<{ success: boolean; message: string }>(async () => {
    return serverRequest<{ success: boolean; message: string }>(
      endpoints.BANNER.deleteBanner(id),
      {
        method: "DELETE",
      },
    );
  });
}

// Action pour récupérer un banner par ID
export async function getBannerByIdAction(id: string) {
  return safeAction<Banner>(async () => {
    return serverRequest<Banner>(`${endpoints.BANNER.getAll(1, 1)}/${id}`, {
      method: "GET",
    });
  });
}

// Action pour uploader un fichier
export async function uploadFileAction(file: File) {
  return safeAction<UploadFileResponse>(async () => {
    const formData = new FormData();
    formData.append("file", file);

    return serverRequest<UploadFileResponse>(
      endpoints.DATARESSORCES.uploadFile(),
      {
        method: "POST",
        body: formData,
      },
      { tokenCookieName: "accessToken" },
    );
  });
}
