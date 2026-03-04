import ValidateOrdersTemplate from "@/components/templates/validate-orders.template";
import { metaObject } from "@/lib/config/site.config";
export const metadata = metaObject("Validations des commandes");

export default function ValidateOrdersPage() {
  return <ValidateOrdersTemplate />;
}
