"use server";

import type {
  Newsletter,
  NewsletterApiResponse,
} from "@/lib/types/newsletter.types";
import { serverRequest } from "@/services/server/axios-server.server";
import { safeAction } from "@/services/server/safe-action.server";
import { endpoints } from "../endpoints";

export interface NewsletterSearchParams {
  email?: string;
  company?: string;
  first_name?: string;
  last_name?: string;
}

export async function getAllNewslettersAction(
  page: number,
  limit: number,
  searchParams?: NewsletterSearchParams,
) {
  return safeAction<NewsletterApiResponse>(async () => {
    let url = endpoints.NEWLETTER.getAll(page, limit);

    if (searchParams) {
      const params = new URLSearchParams();
      if (searchParams.email && searchParams.email.trim() !== "") {
        params.append("email", searchParams.email.trim());
      }
      if (searchParams.company && searchParams.company.trim() !== "") {
        params.append("company", searchParams.company.trim());
      }
      if (searchParams.first_name && searchParams.first_name.trim() !== "") {
        params.append("first_name", searchParams.first_name.trim());
      }
      if (searchParams.last_name && searchParams.last_name.trim() !== "") {
        params.append("last_name", searchParams.last_name.trim());
      }
      const paramString = params.toString();
      if (paramString) {
        url += `&${paramString}`;
      }
    }

    return serverRequest<NewsletterApiResponse>(url, {
      method: "GET",
    });
  });
}

export async function deleteNewsletterAction(id: string) {
  return safeAction<{ success: boolean; message: string }>(async () => {
    return serverRequest<{ success: boolean; message: string }>(
      endpoints.NEWLETTER.deleteOne(id),
      {
        method: "DELETE",
      },
    );
  });
}

export async function getNewsletterByIdAction(id: string) {
  return safeAction<Newsletter>(async () => {
    return serverRequest<Newsletter>(endpoints.NEWLETTER.getOne(id), {
      method: "GET",
    });
  });
}
