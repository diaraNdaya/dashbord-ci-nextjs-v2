import CommissionsTemplate from "@/components/templates/commissions.template";
import { metaObject } from "@/lib/config/site.config";
import { meQueryOptions } from "@/services/queries/auth.queries";
import { getQueryClient } from "@/services/queries/getQueryClient";
import { RQProvider } from "@/services/queries/RQProvider";
import { dehydrate } from "@tanstack/react-query";

export const metadata = metaObject("Gestion des commissions");

export default async function CommissionsPage() {
  const qc = getQueryClient();
  await qc.prefetchQuery(meQueryOptions());
  return (
    <RQProvider state={dehydrate(qc)}>
      <CommissionsTemplate />
    </RQProvider>
  );
}
