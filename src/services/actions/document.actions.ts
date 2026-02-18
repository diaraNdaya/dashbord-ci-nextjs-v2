"use server";
import { DocumentsResponse, ValidationResponse } from "@/lib/types/user.type";
import { serverRequest } from "../axios-server";
import { endpoints } from "../endpoints";
import { safeAction } from "../server/safe-action.server";

// Actions pour les documents
export async function getAllDocumentsAction(page: number, limit: number) {
  return safeAction<DocumentsResponse>(async () => {
    return serverRequest<DocumentsResponse>(
      endpoints.DASHBOARD.getAllDocument(page, limit),
      {
        method: "GET",
      },
    );
  });
}

export async function getAllVerifiedSellersAction(
  page: number,
  limit: number,
  statut: string,
) {
  return safeAction<DocumentsResponse>(async () => {
    return serverRequest<DocumentsResponse>(
      endpoints.DASHBOARD.sellersVerified(page, limit, statut),
      {
        method: "GET",
      },
    );
  });
}

export async function getAllVerifiedCustomersAction(
  page: number,
  limit: number,
  statut: string,
) {
  return safeAction<DocumentsResponse>(async () => {
    return serverRequest<DocumentsResponse>(
      endpoints.DASHBOARD.customersVerified(page, limit, statut),
      {
        method: "GET",
      },
    );
  });
}

export async function validateDocumentAction(id: string, statut: string) {
  return safeAction<ValidationResponse>(async () => {
    return serverRequest<ValidationResponse>(
      endpoints.DASHBOARD.validateDocument(id),
      {
        method: "PUT",
        body: JSON.stringify({ statut }),
      },
    );
  });
}
