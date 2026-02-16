import SubcategoriesTemplate from "@/components/templates/subcategories.template";
import { metaObject } from "@/lib/config/site.config";
import { meQueryOptions } from "@/services/queries/auth.queries";
import { getQueryClient } from "@/services/queries/getQueryClient";
import { RQProvider } from "@/services/queries/RQProvider";
import { dehydrate } from "@tanstack/react-query";

export const metadata = metaObject("Sous-catégories");

export default async function SubcategoriesPage() {
  const qc = getQueryClient();

  await qc.prefetchQuery(meQueryOptions());

  return (
    <RQProvider state={dehydrate(qc)}>
      <SubcategoriesTemplate />
    </RQProvider>
  );
}
