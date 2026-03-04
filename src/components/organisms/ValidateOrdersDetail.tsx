"use client";

import {
  ArrowLeft01Icon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  Package01Icon,
  Settings02Icon,
  TruckIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { LoadingSpinner } from "@/components/atoms/LoadingSpinner";
import { SafeImage } from "@/components/atoms/SafeImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  OrderItem,
  Purchase,
  StatusOrder,
} from "@/lib/types/purchase.types";
import { formatPrice } from "@/lib/utils";
import { updatePurchaseStatusMutationOptions } from "@/services/queries/purchase.queries";
import { toastErr } from "../molecules";

interface ValidateOrdersDetailProps {
  purchase: Purchase;
  orderItem: OrderItem;
  onBack: () => void;
}

export function ValidateOrdersDetail({
  purchase,
  orderItem,
  onBack,
}: ValidateOrdersDetailProps) {
  const [selectedStatus, setSelectedStatus] = useState<StatusOrder>(
    purchase.statut,
  );

  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    ...updatePurchaseStatusMutationOptions(),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["purchases"] });
        onBack();
      } else {
        toastErr(response.message);
      }
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour du statut:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      // Vous pouvez ajouter une notification toast ici
    },
  });

  const getStatusBadge = (status: StatusOrder) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">En attente</Badge>;
      case "confirmed":
        return (
          <Badge variant="default" className="bg-blue-500">
            Confirmée
          </Badge>
        );
      case "progress":
        return (
          <Badge variant="default" className="bg-orange-500">
            En cours
          </Badge>
        );
      case "packing":
        return (
          <Badge variant="default" className="bg-purple-500">
            Emballage
          </Badge>
        );
      case "delivered":
        return (
          <Badge variant="default" className="bg-green-500">
            Livrée
          </Badge>
        );
      case "cancel":
        return <Badge variant="destructive">Annulée</Badge>;
      case "courier_contacted":
        return (
          <Badge variant="default" className="bg-yellow-500">
            Coursier contacté
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: StatusOrder) => {
    switch (status) {
      case "pending":
        return Clock01Icon;
      case "confirmed":
        return CheckmarkCircle01Icon;
      case "progress":
        return Settings02Icon;
      case "packing":
        return Package01Icon;
      case "delivered":
        return TruckIcon;
      case "cancel":
        return Cancel01Icon;
      case "courier_contacted":
        return UserIcon;
      default:
        return Clock01Icon;
    }
  };

  const handleStatusUpdate = () => {
    if (selectedStatus !== purchase.statut) {
      updateStatusMutation.mutate({
        purchaseId: purchase.id,
        payload: { statut: selectedStatus },
      });
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Header amélioré */}
      <Card className="border-violet-500/10">
        <CardContent className="p-4 md:p-5">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
            {/* LEFT */}
            <div className="min-w-0 space-y-2">
              {/* back + title */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="default"
                  className="h-8 w-8 shrink-0"
                  onClick={onBack}
                  aria-label="Retour"
                >
                  <HugeiconsIcon
                    icon={ArrowLeft01Icon}
                    strokeWidth={2}
                    className="h-4 w-4"
                  />
                </Button>

                <HugeiconsIcon
                  icon={Package01Icon}
                  className="h-5 w-5 shrink-0 text-violet-600"
                />
                <h1 className="truncate text-xl font-bold md:text-2xl">
                  {orderItem.product?.name || "Produit sans nom"}
                </h1>
              </div>

              {/* badges et informations */}
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={getStatusIcon(purchase.statut)}
                    strokeWidth={2}
                    className="h-4 w-4"
                  />
                  {getStatusBadge(purchase.statut)}
                </div>

                <Badge variant="outline" className="rounded-full">
                  Qté: {orderItem.quantity}
                </Badge>

                <Badge variant="outline" className="rounded-full">
                  {formatPrice(orderItem.price)} {purchase.currency}
                </Badge>

                {orderItem.color && (
                  <Badge
                    variant="outline"
                    className="rounded-full flex items-center gap-1"
                  >
                    <div
                      className="w-3 h-3 rounded border"
                      style={{ backgroundColor: orderItem.color }}
                    />
                    {orderItem.color}
                  </Badge>
                )}

                {orderItem.size && (
                  <Badge variant="outline" className="rounded-full">
                    Taille: {orderItem.size}
                  </Badge>
                )}
              </div>

              {/* Informations de la commande */}
              <div className="text-sm text-muted-foreground">
                <p>
                  Commande #{purchase.id.slice(-8)} • Article #
                  {orderItem.id.slice(-8)}
                </p>
                <p>
                  Client: {purchase.customer?.name} •{" "}
                  {new Date(purchase.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>

            {/* RIGHT (actions) */}
            <div className="flex w-full flex-col gap-2 md:w-[280px]">
              <div className="flex gap-2">
                <Select
                  value={selectedStatus}
                  onValueChange={(value) =>
                    setSelectedStatus(value as StatusOrder)
                  }
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Changer le statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="confirmed">Confirmée</SelectItem>
                    <SelectItem value="progress">En cours</SelectItem>
                    <SelectItem value="packing">Emballage</SelectItem>
                    <SelectItem value="courier_contacted">
                      Coursier contacté
                    </SelectItem>
                    <SelectItem value="delivered">Livrée</SelectItem>
                    <SelectItem value="cancel">Annulée</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleStatusUpdate}
                disabled={
                  selectedStatus === purchase.statut ||
                  updateStatusMutation.isPending
                }
                className="w-full bg-violet-600 text-white hover:bg-violet-700"
              >
                {updateStatusMutation.isPending ? (
                  <LoadingSpinner />
                ) : (
                  "Mettre à jour le statut"
                )}
              </Button>

              {selectedStatus !== purchase.statut && (
                <p className="text-xs text-muted-foreground text-center">
                  Le statut sera changé de &quot;{purchase.statut}&quot; vers
                  &quot;{selectedStatus}&quot;
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Informations du produit */}
        <Card>
          <CardHeader>
            <CardTitle>Informations du produit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              {orderItem.product?.ProductImage?.[0] ? (
                <SafeImage
                  src={orderItem.product.ProductImage[0].imageUrl}
                  alt={orderItem.product.name || "Produit"}
                  width={120}
                  height={120}
                  className="rounded-lg object-cover"
                />
              ) : (
                <div className="w-30 h-30 bg-muted rounded-lg flex items-center justify-center">
                  <HugeiconsIcon
                    icon={Package01Icon}
                    strokeWidth={2}
                    className="h-8 w-8 text-muted-foreground"
                  />
                </div>
              )}
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-lg">
                  {orderItem.product?.name || "Produit sans nom"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {orderItem.product?.description}
                </p>
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={getStatusIcon(purchase.statut)}
                    strokeWidth={2}
                    className="h-4 w-4"
                  />
                  {getStatusBadge(purchase.statut)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm font-medium">Quantité</p>
                <p className="text-lg">{orderItem.quantity}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Prix unitaire</p>
                <p className="text-lg">
                  {formatPrice(orderItem.price)} {purchase.currency}
                </p>
              </div>
              {orderItem.color && (
                <div>
                  <p className="text-sm font-medium">Couleur</p>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: orderItem.color }}
                    />
                    <span>{orderItem.color}</span>
                  </div>
                </div>
              )}
              {orderItem.size && (
                <div>
                  <p className="text-sm font-medium">Taille</p>
                  <p>{orderItem.size}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Informations de la commande */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de la commande</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">ID Commande</p>
                <p className="font-mono text-sm">{purchase.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Date de création</p>
                <p>
                  {new Date(purchase.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Montant total</p>
                <p className="text-lg font-semibold">
                  {formatPrice(purchase.totalPrice)} {purchase.currency}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Méthode de paiement</p>
                <p>{purchase.payment?.payment_method || purchase.method}</p>
              </div>
            </div>

            {/* Informations du client */}
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Client</h4>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Nom:</span>{" "}
                  {purchase.customer?.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {purchase.customer?.user?.email}
                </p>
                <p>
                  <span className="font-medium">Téléphone:</span>{" "}
                  {purchase.customer?.user?.phone_number}
                </p>
                <p>
                  <span className="font-medium">Adresse:</span>{" "}
                  {purchase.customer?.address}
                </p>
              </div>
            </div>

            {/* Informations de livraison */}
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Livraison</h4>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Méthode:</span>{" "}
                  {purchase.shippingMethods?.name || purchase.shippingMethod}
                </p>
                <p>
                  <span className="font-medium">Prix:</span>{" "}
                  {formatPrice(purchase.shippingMethods?.price || 0)}{" "}
                  {purchase.currency}
                </p>
                <p>
                  <span className="font-medium">Description:</span>{" "}
                  {purchase.shippingMethods?.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
