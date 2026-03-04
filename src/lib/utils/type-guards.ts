import type { ApiError } from "@/services/api.type";
import type { ActionResult } from "@/services/server/safe-action.server";

// Type guard pour vérifier si c'est une erreur
export function isApiError<T>(result: ActionResult<T>): result is ApiError {
  return (
    result !== null &&
    typeof result === "object" &&
    "message" in result &&
    "status" in result &&
    typeof (result as ApiError).message === "string"
  );
}

// Type guard pour vérifier si c'est des données valides
export function isValidData<T>(result: ActionResult<T>): result is T {
  return !isApiError(result);
}
