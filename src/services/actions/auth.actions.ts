"use server";
import { LoginResponse, Profile } from "@/lib/types/user.type";
import { serverRequest } from "@/services/server/axios-server.server";
import { safeAction } from "@/services/server/safe-action.server";
import { cookies } from "next/headers";
import { LoginCredentials } from "../api.type";
import { endpoints } from "../endpoints";

type MeData = { user: Profile };

export async function loginAction(input: LoginCredentials) {
  return safeAction<LoginResponse>(async () => {
    const res = await serverRequest<LoginResponse>(`${endpoints.AUTH.login}`, {
      method: "POST",
      body: JSON.stringify(input),
    });
    const cookiesStore = await cookies();

    if (res.data.user.role.name !== "ADMIN") {
      throw new Error(
        "Accès refusé : Vous n'êtes pas autorisé à accéder à cette application. Seuls les administrateurs peuvent se connecter.",
      );
    }
    const token = res.data.accessToken;
    if (token) {
      cookiesStore.set("accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
      });
    }
    return res;
  });
}

export async function meAction() {
  return safeAction<MeData>(() =>
    serverRequest<MeData>(`${endpoints.AUTH.me}`, {
      method: "GET",
    }),
  );
}

export async function logoutAction() {
  return safeAction(async () => {
    const cookiesStore = await cookies();
    cookiesStore.delete("accessToken");
    return {
      data: { ok: true },
      status: 200,
      success: true,
      message: "Déconnexion réussie",
    };
  });
}
