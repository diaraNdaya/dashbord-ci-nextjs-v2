import DashBoardTemplate from "@/components/templates/dashboard.template";
import { metaObject } from "@/lib/config/site.config";
import { meQueryOptions } from "@/services/queries/auth.queries";
import { getQueryClient } from "@/services/queries/getQueryClient";
import { RQProvider } from "@/services/queries/RQProvider";
import { dehydrate } from "@tanstack/react-query";

export const metadata = metaObject("Tableau de bord");

export default async function Page() {
  const qc = getQueryClient();

  await qc.prefetchQuery(meQueryOptions());

  return (
    <RQProvider state={dehydrate(qc)}>
      <DashBoardTemplate />
    </RQProvider>
  );
}
