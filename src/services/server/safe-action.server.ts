import type { ApiError } from "@/services/api.type";
import { APIError } from "@/services/server/axios-server.server";

export type ActionResult<T> = T | ApiError;

export async function safeAction<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: () => Promise<any>,
): Promise<ActionResult<T>> {
  try {
    const response = await fn();

    // Return the response directly as the specified type T
    // No automatic extraction - use exactly what you specify
    return response as T;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err instanceof APIError) {
      return err.payload;
    }
    const fallback: ApiError = {
      message: err?.message || "Erreur inattendue",
      status: 500,
      errors: err,
    };

    return fallback;
  }
}
