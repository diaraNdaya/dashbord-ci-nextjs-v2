import { toastErr } from "@/components/molecules/ToastCard";
import axios, { AxiosResponse } from "axios";
import nookies from "nookies";

const url = process.env.API_BASE_URL;

export const request = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 0,
});

const getAccessToken = () => {
  if (typeof window !== "undefined") {
    return nookies.get(null, "accessToken")?.accessToken;
  }
  return null;
};

request.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    toastErr("Erreur");
    return Promise.reject(error);
  },
);

request.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.config.responseType === "blob") {
      return response;
    }
    return response.data;
  },
  (error) => {
    if (error?.response?.status === 401) {
      toastErr("Vous n'êtes plus connecté(e)");

      window.location.replace("/");
    } else if (error?.response?.status === 403) {
      toastErr("Vous n'êtes pas autorisé à effectuer l'action.");
    } else if (error?.response?.status === 422) {
      toastErr(error?.response.data.message);
    } else {
      console.error("Erreur API:", error);
      toastErr(error?.response?.data?.message || "Une erreur s'est produite.");
    }
    return Promise.reject(new Error(JSON.stringify(error.response)));
  },
);

export type { AxiosResponse };
