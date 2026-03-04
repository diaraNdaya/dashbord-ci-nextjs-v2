import type {
  CreatePushNotificationCredential,
  PushNotificationApiResponse,
} from "@/lib/types/push.types";
import { isApiError } from "@/lib/utils/type-guards";
import { sendPushNotificationAction } from "@/services/actions/push.actions";

export const sendPushNotificationMutationOptions = () => ({
  mutationFn: async (
    data: CreatePushNotificationCredential,
  ): Promise<PushNotificationApiResponse> => {
    const result = await sendPushNotificationAction(data);

    if (isApiError(result)) {
      throw new Error(
        result.message || "Erreur lors de l'envoi de la notification push",
      );
    }

    return result;
  },
});
