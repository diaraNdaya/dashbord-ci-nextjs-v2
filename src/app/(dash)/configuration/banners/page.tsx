import BannersTemplate from "@/components/templates/banners.template";
import { metaObject } from "@/lib/config/site.config";
import { meQueryOptions } from "@/services/queries/auth.queries";
import { getAllBannersQueryOptions } from "@/services/queries/banner.queries";
import { getQueryClient } from "@/services/queries/getQueryClient";
import { RQProvider } from "@/services/queries/RQProvider";
import { dehydrate } from "@tanstack/react-query";

export const metadata = metaObject("Bannières");

export default async function BannersPage() {
  const qc = getQueryClient();

  await qc.prefetchQuery(meQueryOptions());
  await qc.prefetchQuery(getAllBannersQueryOptions(1, 10));

  return (
    <RQProvider state={dehydrate(qc)}>
      <BannersTemplate />
    </RQProvider>
  );
}
