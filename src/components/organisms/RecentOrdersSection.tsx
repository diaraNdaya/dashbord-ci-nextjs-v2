"use client";

import { EmptyState } from "@/components/atoms/EmptyState";
import { LoadingSkeleton } from "@/components/atoms/LoadingSkeleton";
import { OrderStatusBadge } from "@/components/atoms/OrderStatusBadge";
import { ChartCardHeader } from "@/components/molecules/ChartCardHeader";
import { toArrayFromPayload } from "@/components/organisms/dashboard-data.utils";
import { Card, CardContent } from "@/components/ui/card";
import type { Order } from "@/lib/types/orders.type";
import { fetchOrdersQueryOptions } from "@/services/queries/orders.queries";
import { useQuery } from "@tanstack/react-query";

const normalizeOrders = (raw: unknown): Order[] =>
  toArrayFromPayload<Order>(raw);

export function RecentOrdersSection() {
  const { data, isLoading } = useQuery(fetchOrdersQueryOptions(1, 5));
  const orders = normalizeOrders(data);

  return (
    <Card>
      <CardContent className="p-5">
        <ChartCardHeader
          title="Commandes recentes"
          subtitle="Les 5 dernieres commandes"
        />

        {isLoading ? <LoadingSkeleton rows={5} /> : null}
        {!isLoading && orders.length === 0 ? (
          <EmptyState title="Aucune commande recente" />
        ) : null}

        {!isLoading && orders.length > 0 ? (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div>
                  <p className="font-medium">{order.id.slice(0, 10)}...</p>
                  <p className="text-xs text-muted-foreground">
                    {order.email || "Sans email"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {Number(order.totalAmount || 0).toLocaleString("fr-FR")}{" "}
                    {order.currency || "FCFA"}
                  </p>
                  <OrderStatusBadge status={order.statut} className="mt-1" />
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
