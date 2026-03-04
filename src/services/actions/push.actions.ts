"use server";

import type {
  CreatePushNotificationCredential,
  PushNotificationApiResponse,
} from "@/lib/types/push.types";
import { endpoints } from "@/services/endpoints";
import { serverRequest } from "@/services/server/axios-server.server";
import { safeAction } from "@/services/server/safe-action.server";

export async function sendPushNotificationAction(
  data: CreatePushNotificationCredential,
) {
  return safeAction<PushNotificationApiResponse>(async () => {
    return serverRequest<PushNotificationApiResponse>(endpoints.PUSH.create, {
      method: "POST",
      body: JSON.stringify(data),
    });
  });
}
