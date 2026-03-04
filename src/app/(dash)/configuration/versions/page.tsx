import ConfigVersionsTemplate from "@/components/templates/config-versions.template";
import { metaObject } from "@/lib/config/site.config";
import { meQueryOptions } from "@/services/queries/auth.queries";
import { getQueryClient } from "@/services/queries/getQueryClient";
import { RQProvider } from "@/services/queries/RQProvider";
import { getAllVersionsQueryOptions } from "@/services/queries/version.queries";
import { dehydrate } from "@tanstack/react-query";

export const metadata = metaObject("Gestion des Versions");

export default async function VersionsPage() {
  const qc = getQueryClient();

  await qc.prefetchQuery(meQueryOptions());
  await qc.prefetchQuery(getAllVersionsQueryOptions());

  return (
    <RQProvider state={dehydrate(qc)}>
      <ConfigVersionsTemplate />
    </RQProvider>
  );
}
