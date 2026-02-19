import SellerDetailsTemplate from "@/components/templates/seller-details.template";
import { metaObject } from "@/lib/config/site.config";
import { meQueryOptions } from "@/services/queries/auth.queries";
import { getQueryClient } from "@/services/queries/getQueryClient";
import { RQProvider } from "@/services/queries/RQProvider";
import { dehydrate } from "@tanstack/react-query";

export const metadata = metaObject("Détails vendeur");

interface SellerDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function SellerDetailsPage({
  params,
}: SellerDetailsPageProps) {
  const { id } = await params;
  const qc = getQueryClient();

  await qc.prefetchQuery(meQueryOptions());

  return (
    <RQProvider state={dehydrate(qc)}>
      <SellerDetailsTemplate sellerId={id} />
    </RQProvider>
  );
}
