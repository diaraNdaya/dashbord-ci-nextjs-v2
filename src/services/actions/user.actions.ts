"use server";

import type {
  CustomersApiResponse,
  SellersApiResponse,
} from "@/lib/types/index";
import type {
  CustomerSearchParams,
  SellerSearchParams,
  ValidationResponse,
} from "@/lib/types/user.type";
import { serverRequest } from "@/services/server/axios-server.server";
import { safeAction } from "@/services/server/safe-action.server";
import { endpoints } from "../endpoints";

export async function fetchUsersAction(
  page: number,
  limit: number,
  searchParams?: CustomerSearchParams,
) {
  return safeAction<CustomersApiResponse>(async () => {
    let url = endpoints.CUSTOMER.allCustomer(page, limit);

    if (searchParams) {
      const params = new URLSearchParams();
      if (searchParams.name?.trim()) {
        params.append("name", searchParams.name.trim());
      }
      if (searchParams.city?.trim()) {
        params.append("city", searchParams.city.trim());
      }

      const paramString = params.toString();
      if (paramString) {
        const separator = url.includes("?") ? "&" : "?";
        url += separator + paramString;
      }
    }

    return serverRequest<CustomersApiResponse>(url, {
      method: "GET",
    });
  });
}

// Actions pour les vendeurs
export async function fetchSellersAction(
  page: number,
  limit: number,
  searchParams?: SellerSearchParams,
) {
  return safeAction<SellersApiResponse>(async () => {
    const url = endpoints.SELLER.allSeller(
      page,
      limit,
      searchParams?.business_address,
      searchParams?.store_name,
    );

    return serverRequest<SellersApiResponse>(url, {
      method: "GET",
    });
  });
}

export async function fetchTopSellersAction() {
  return safeAction<SellersApiResponse>(async () => {
    return serverRequest<SellersApiResponse>(endpoints.TOPCOUNT.seller(), {
      method: "GET",
    });
  });
}

export async function fetchUsersBlockedAction(page: number, limit: number) {
  return safeAction<CustomersApiResponse>(async () => {
    return serverRequest<CustomersApiResponse>(
      endpoints.CUSTOMER.allCustomerBloqued(page, limit),
      {
        method: "GET",
      },
    );
  });
}

export async function blockUserAction(id: string) {
  return safeAction<ValidationResponse>(async () => {
    return serverRequest<ValidationResponse>(
      endpoints.CUSTOMER.blockedUser(id),
      {
        method: "PUT",
      },
    );
  });
}
