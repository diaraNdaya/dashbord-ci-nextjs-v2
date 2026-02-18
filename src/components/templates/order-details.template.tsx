"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

import { ErrorMessage } from "@/components/atoms/ErrorMessage";
import { LoadingSpinner } from "@/components/atoms/LoadingSpinner";
import { OrderDetailsContent } from "@/components/organisms/OrderDetailsContent";
import { Button } from "@/components/ui/button";
import { getOneOrderQueryOptions } from "@/services/queries/orders.queries";
import {
  ArrowLeft01Icon,
  ShoppingCart01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface OrderDetailsTemplateProps {
  orderId: string;
}

export default function OrderDetailsTemplate({
  orderId,
}: OrderDetailsTemplateProps) {
  const router = useRouter();

  const {
    data: orderResponse,
    isLoading,
    error,
  } = useQuery({
    ...getOneOrderQueryOptions(orderId),
    enabled: !!orderId,
  });

  if (isLoading) {
    return <LoadingSpinner message="Chargement des détails..." />;
  }

  if (error || !orderResponse) {
    console.log("Error or no response:", { error, orderResponse });
    return (
      <ErrorMessage
        title="Commande introuvable"
        buttonText="Retour aux commandes"
        onButtonClick={() => router.push("/orders")}
      />
    );
  }

  // Extract the order data from the nested response structure
  let orderData;
  if (orderResponse.data && orderResponse.data.data) {
    orderData = orderResponse.data.data;
  } else if (orderResponse.data) {
    orderData = orderResponse.data;
  } else {
    orderData = orderResponse;
  }

  console.log("Extracted order data:", orderData);

  if (!orderData) {
    return (
      <ErrorMessage
        title="Données de commande manquantes"
        buttonText="Retour aux commandes"
        onButtonClick={() => router.push("/orders")}
      />
    );
  }

  return (
    <motion.div
      className="flex flex-1 flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="@container/main flex flex-1 flex-col gap-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/orders")}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-vif/10 dark:bg-violet-vif/5">
              <HugeiconsIcon
                icon={ShoppingCart01Icon}
                className="h-6 w-6 text-violet-vif"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                Commande #{orderId.slice(-6)}
              </h1>
              <p className="text-muted-foreground">
                Détails et suivi de la commande
              </p>
            </div>
          </div>
        </motion.div>

        <OrderDetailsContent order={orderData} orderId={orderId} />
      </div>
    </motion.div>
  );
}
