import type { ApiError, ApiResponse } from "@/services/api.type";
import { APIError } from "@/services/server/axios-server.server";

export type ActionResult<T> =
  | {
      success: true;
      data: ApiResponse<T>;
    }
  | { success: false; error: ApiError };

export async function safeAction<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: () => Promise<any>,
): Promise<ActionResult<T>> {
  try {
    const response = await fn();
    return { success: true, data: response };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err instanceof APIError) {
      return { success: false, error: err.payload };
    }
    const fallback: ApiError = {
      message: err?.message || "Erreur inattendue",
      status: 500,
      errors: err,
    };

    return { success: false, error: fallback };
  }
}
