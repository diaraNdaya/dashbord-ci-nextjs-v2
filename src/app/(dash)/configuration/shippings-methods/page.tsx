import ConfigShippingMethodsTemplate from "@/components/templates/config-shipping-methods.template";
import { metaObject } from "@/lib/config/site.config";
import { meQueryOptions } from "@/services/queries/auth.queries";
import { getQueryClient } from "@/services/queries/getQueryClient";
import { RQProvider } from "@/services/queries/RQProvider";
import { getAllShippingMethodsQueryOptions } from "@/services/queries/shipping.queries";
import { dehydrate } from "@tanstack/react-query";

export const metadata = metaObject("Méthodes de Livraison");

export default async function ShippingsMethodPage() {
  const qc = getQueryClient();
  await qc.prefetchQuery(meQueryOptions());
  await qc.prefetchQuery(getAllShippingMethodsQueryOptions(1, 100));

  return (
    <RQProvider state={dehydrate(qc)}>
      <ConfigShippingMethodsTemplate />
    </RQProvider>
  );
}
