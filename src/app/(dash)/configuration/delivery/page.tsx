import ConfigDeliveryTemplate from "@/components/templates/config-delivery.template";
import { metaObject } from "@/lib/config/site.config";
import { meQueryOptions } from "@/services/queries/auth.queries";
import { getAllDeliveriesQueryOptions } from "@/services/queries/delivery.queries";
import { getQueryClient } from "@/services/queries/getQueryClient";
import { RQProvider } from "@/services/queries/RQProvider";
import { dehydrate } from "@tanstack/react-query";

export const metadata = metaObject("Gestion des Livreurs");

export default async function DeliveryPage() {
  const qc = getQueryClient();

  await qc.prefetchQuery(meQueryOptions());
  await qc.prefetchQuery(getAllDeliveriesQueryOptions(1, 10));

  return (
    <RQProvider state={dehydrate(qc)}>
      <ConfigDeliveryTemplate />
    </RQProvider>
  );
}
