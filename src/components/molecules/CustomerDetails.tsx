"use client";

import { CustomerDetailRow } from "@/components/atoms/CustomerDetailRow";
import type { Order } from "@/lib/types/orders.type";
import {
  CreditCardIcon,
  Mail01Icon,
  User02Icon,
} from "@hugeicons/core-free-icons";

interface CustomerDetailsProps {
  order: Order;
}

export function CustomerDetails({ order }: CustomerDetailsProps) {
  // Utiliser les données de paiement de l'API
  const paymentMethodLabel =
    order.payment?.payment_method || "Méthode non spécifiée";
  const paymentProvider = order.payment?.provider;
  const paymentOperator = order.payment?.operator;

  // Construire le label de paiement avec les informations disponibles
  const paymentLabel = paymentProvider
    ? `${paymentMethodLabel} (${paymentProvider})`
    : paymentOperator
      ? `${paymentMethodLabel} - ${paymentOperator}`
      : paymentMethodLabel;

  return (
    <div>
      <h4 className="font-medium mb-3">Détails du client</h4>
      <div className="grid gap-3 text-sm">
        <CustomerDetailRow
          icon={User02Icon}
          label={order.customer?.name || "N/A"}
        />
        <CustomerDetailRow icon={Mail01Icon} label={order.email || "N/A"} />
        <CustomerDetailRow icon={CreditCardIcon} label={paymentLabel} />
        {order.payment?.payment_status && (
          <div className="text-xs text-muted-foreground mt-1">
            Statut:{" "}
            {order.payment.payment_status === "paid"
              ? "Payé"
              : order.payment.payment_status === "pending"
                ? "En attente"
                : "Échoué"}
          </div>
        )}
      </div>
    </div>
  );
}
