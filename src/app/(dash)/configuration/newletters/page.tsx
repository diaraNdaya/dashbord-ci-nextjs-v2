import ConfigNewslettersTemplate from "@/components/templates/config-newsletters.template";
import { metaObject } from "@/lib/config/site.config";
import { meQueryOptions } from "@/services/queries/auth.queries";
import { getQueryClient } from "@/services/queries/getQueryClient";
import { getAllNewslettersQueryOptions } from "@/services/queries/newsletter.queries";
import { RQProvider } from "@/services/queries/RQProvider";
import { dehydrate } from "@tanstack/react-query";

export const metadata = metaObject("Newsletters");

export default async function NewslettersPage() {
  const qc = getQueryClient();

  await qc.prefetchQuery(meQueryOptions());
  await qc.prefetchQuery(getAllNewslettersQueryOptions(1, 10));

  return (
    <RQProvider state={dehydrate(qc)}>
      <ConfigNewslettersTemplate />
    </RQProvider>
  );
}
