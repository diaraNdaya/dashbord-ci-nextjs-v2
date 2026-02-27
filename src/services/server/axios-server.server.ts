import { cookies } from "next/headers";
import "server-only";
import { ApiError, ApiResponse } from "./../api.type";

export class APIError extends Error {
  status: number;
  payload: ApiError;

  constructor(status: number, payload: ApiError) {
    super(payload?.message || "Erreur API");
    this.status = status;
    this.payload = payload;
  }
}

type ServerRequestConfig = {
  tokenCookieName?: string; // default: accessToken
};

function normalizeApiError(status: number, body: unknown): ApiError {
  if (body && typeof body === "object" && "message" in body) {
    const b = body as Partial<ApiError>;
    return {
      message: b.message || "Erreur API",

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      status: (b.status ?? status) as any,
      success: b.success,
      code: b.code,
      errors: b.errors,
    };
  }

  return {
    message: typeof body === "string" && body.trim() ? body : "Erreur API",
    status,
  };
}

export async function serverRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  config: ServerRequestConfig = {},
): Promise<ApiResponse<T>> {
  const cookiesStore = await cookies();
  const tokenCookieName = config.tokenCookieName ?? "accessToken";
  const accessToken = cookiesStore.get(tokenCookieName)?.value;

  const headers = new Headers(options.headers);

  // Ne pas forcer Content-Type si c'est FormData ou si c'est explicitement undefined
  const isFormData = options.body instanceof FormData;
  const hasExplicitContentType =
    options.headers && "Content-Type" in options.headers;

  if (!isFormData && !hasExplicitContentType && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Si Content-Type est explicitement undefined, le supprimer
  if (
    hasExplicitContentType &&
    (options.headers as any)["Content-Type"] === undefined
  ) {
    headers.delete("Content-Type");
  }

  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const res = await fetch(endpoint, {
    cache: "no-store",
    ...options,
    headers,
  });

  const contentType = res.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) {
    throw new APIError(res.status, normalizeApiError(res.status, body));
  }

  // Encapsuler la réponse dans le format ApiResponse
  return body;
}
