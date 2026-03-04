import PushTemplate from "@/components/templates/push.template";
import { metaObject } from "@/lib/config/site.config";
import { meQueryOptions } from "@/services/queries/auth.queries";
import { getQueryClient } from "@/services/queries/getQueryClient";
import { RQProvider } from "@/services/queries/RQProvider";
import { dehydrate } from "@tanstack/react-query";

export const metadata = metaObject("Notifications Push");

export default async function PushPage() {
  const qc = getQueryClient();

  await qc.prefetchQuery(meQueryOptions());

  return (
    <RQProvider state={dehydrate(qc)}>
      <PushTemplate />
    </RQProvider>
  );
}
