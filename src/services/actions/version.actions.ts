"use server";

import type {
  CreateVersionPayload,
  Version,
  VersionResponse,
  VersionSingleResponse,
} from "@/lib/types/version.types";
import { serverRequest } from "@/services/server/axios-server.server";
import { safeAction } from "@/services/server/safe-action.server";
import { endpoints } from "../endpoints";

export interface VersionSearchParams {
  minVersion?: string;
  latestVersion?: string;
}

export async function getAllVersionsAction() {
  return safeAction<VersionResponse>(async () => {
    return serverRequest<VersionResponse>(endpoints.VERSING.getAll, {
      method: "GET",
    });
  });
}

export async function createVersionAction(data: CreateVersionPayload) {
  return safeAction<Version>(async () => {
    return serverRequest<Version>(endpoints.VERSING.create, {
      method: "POST",
      body: JSON.stringify(data),
    });
  });
}

export async function updateVersionAction(
  id: string,
  data: Partial<CreateVersionPayload>,
) {
  return safeAction<Version>(async () => {
    return serverRequest<Version>(endpoints.VERSING.getBYId(id), {
      method: "PUT",
      body: JSON.stringify(data),
    });
  });
}

export async function deleteVersionAction(id: string) {
  return safeAction<{ success: boolean; message: string }>(async () => {
    return serverRequest<{ success: boolean; message: string }>(
      endpoints.VERSING.getBYId(id),
      {
        method: "DELETE",
      },
    );
  });
}

export async function getVersionByIdAction(id: string) {
  return safeAction<Version>(async () => {
    return serverRequest<Version>(endpoints.VERSING.getBYId(id), {
      method: "GET",
    });
  });
}

export async function getLatestVersionAction() {
  return safeAction<VersionSingleResponse>(async () => {
    return serverRequest<VersionSingleResponse>(endpoints.VERSING.last, {
      method: "GET",
    });
  });
}
