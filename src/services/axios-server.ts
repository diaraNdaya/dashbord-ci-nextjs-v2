"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type ApiError = {
  message: string;
  status: number;
  code: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: any;
  success: false;
};

const buildApiError = (
  status: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  fallbackMessage = "Une erreur s'est produite."
): ApiError => ({
  message: data?.message || fallbackMessage,
  status,
  code: data?.code || "UNKNOWN_ERROR",
  errors: data?.errors || data?.error?.errors || data?.error || data.message,
  success: false,
});

const handleServerError = async (response: Response): Promise<never> => {
  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    redirect("/");
  }

  return Promise.reject(
    buildApiError(
      response.status,
      data,
      response.status === 403
        ? "Vous n'êtes pas autorisé à effectuer l'action."
        : response.status === 422
        ? "Erreur de validation."
        : "Une erreur serveur s'est produite."
    )
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const serverRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const jar = await cookies();
    const token = jar.get("accessToken")?.value;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers as Record<string, string>),
    };

    const response = await fetch(`${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      return handleServerError(response);
    }
    const text = await response.text();
    return (text ? JSON.parse(text) : ({} as T)) as T;
    
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log("❌ Error:", err);
    const apiErr: ApiError = {
      message: err?.message || "Une erreur réseau s'est produite.",
      status: err?.status || 0,
      code: err?.code || "NETWORK_ERROR",
      errors: err?.errors,
      success: false,
    };
    return Promise.reject(apiErr);
  }
};
