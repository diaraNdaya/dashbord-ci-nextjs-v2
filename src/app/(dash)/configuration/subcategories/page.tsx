import SubcategoriesTemplate from "@/components/templates/subcategories.template";
import { metaObject } from "@/lib/config/site.config";
import { meQueryOptions } from "@/services/queries/auth.queries";
import { getQueryClient } from "@/services/queries/getQueryClient";
export const metadata = metaObject("Sous-catégories");

export default async function SubcategoriesPage() {
  const qc = getQueryClient();
  await qc.prefetchQuery(meQueryOptions());

  return <SubcategoriesTemplate />;
}
