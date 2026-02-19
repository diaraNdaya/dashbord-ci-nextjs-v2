import DashBoardTemplate from "@/components/templates/dashboard.template";
import { metaObject } from "@/lib/config/site.config";
import { meQueryOptions } from "@/services/queries/auth.queries";
import {
  getDashboardDataQueryOptions,
  getMetricsDataQueryOptions,
  getSalesReportQueryOptions,
} from "@/services/queries/dashboard.queries";
import { getQueryClient } from "@/services/queries/getQueryClient";
import { fetchOrdersQueryOptions } from "@/services/queries/orders.queries";
import { RQProvider } from "@/services/queries/RQProvider";
import { dehydrate } from "@tanstack/react-query";

export const metadata = metaObject("Tableau de bord");

export default async function Page() {
  const qc = getQueryClient();
  const date = new Date().toISOString().slice(0, 10);

  await qc.prefetchQuery(meQueryOptions());
  await qc.prefetchQuery(getDashboardDataQueryOptions());
  await qc.prefetchQuery(getMetricsDataQueryOptions());
  await qc.prefetchQuery(getSalesReportQueryOptions({ period: "month", date }));
  await qc.prefetchQuery(fetchOrdersQueryOptions(1, 5));

  return (
    <RQProvider state={dehydrate(qc)}>
      <DashBoardTemplate />
    </RQProvider>
  );
}
