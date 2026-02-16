// "use server";

// import { LoginResponse, User } from "@/lib/types/user.type";
// import { serverRequest } from "@/services/server/axios-server.server";
// import { safeAction } from "@/services/server/safe-action.server";
// import { cookies } from "next/headers";
// import { LoginCredentials } from "../api.type";

// const API = process.env.API_BASE_URL!;

// export async function loginAction(input: LoginCredentials) {
//   return safeAction(async () => {
//     const res = await serverRequest<LoginResponse>(`${API}/auth/login`, {
//       method: "POST",
//       body: JSON.stringify(input),
//     });
//     const cookiesStore = await cookies();
//     cookiesStore.set("accessToken", res.data.accessToken, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "lax",
//       path: "/",
//     });

//     return {
//       data: { user: res.data.user },
//       status: res.status,
//       success: true,
//       message: "Connexion réussie",
//     };
//   });
// }

// export async function meAction() {
//   return safeAction(async () => {
//     const res = await serverRequest<{ user: User }>(`${API}/auth/me`, {
//       method: "GET",
//     });
//     return res;
//   });
// }

// export async function logoutAction() {
//   return safeAction(async () => {
//     const cookiesStore = await cookies();
//     cookiesStore.delete("accessToken");
//     return {
//       data: { ok: true },
//       status: 200,
//       success: true,
//       message: "Déconnexion réussie",
//     };
//   });
// }

"use server";
import { LoginResponse, Profile } from "@/lib/types/user.type";
import { serverRequest } from "@/services/server/axios-server.server";
import { safeAction } from "@/services/server/safe-action.server";
import { cookies } from "next/headers";
import { LoginCredentials } from "../api.type";

const API = process.env.API_BASE_URL!;

type MeData = { user: Profile };

export async function loginAction(input: LoginCredentials) {
  return safeAction<LoginResponse>(async () => {
    const res = await serverRequest<LoginResponse>(`${API}/auth/login`, {
      method: "POST",
      body: JSON.stringify(input),
    });
    const cookiesStore = await cookies();

    console.log("response", res.data.user.role);

    // Vérifier si l'utilisateur a le rôle ADMIN
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

    console.log("response", res.data.user.role);
    return res;
  });
}

export async function meAction() {
  return safeAction<MeData>(() =>
    serverRequest<MeData>(`${API}/auth/profile`, {
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
