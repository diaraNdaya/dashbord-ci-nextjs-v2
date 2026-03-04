"use client";

import { EmptyState } from "@/components/atoms/EmptyState";
import { ErrorMessage } from "@/components/atoms/ErrorMessage";
import { LoadingSpinner } from "@/components/atoms/LoadingSpinner";
import { SafeImage } from "@/components/atoms/SafeImage";
import { ValidateOrdersDetail } from "@/components/organisms/ValidateOrdersDetail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderItem, Purchase, StatusOrder } from "@/lib/types/purchase.types";
import { formatPrice } from "@/lib/utils";
import { getAllPurchasesQueryOptions } from "@/services/queries/purchase.queries";
import {
  Cancel01Icon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  EyeIcon,
  Package01Icon,
  Search01Icon,
  Settings02Icon,
  TruckIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function ValidateOrdersTemplate() {
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null,
  );
  const [selectedOrderItem, setSelectedOrderItem] = useState<OrderItem | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data, isLoading, error } = useQuery({
    ...getAllPurchasesQueryOptions(),
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

  const handleViewDetails = (purchase: Purchase, orderItem: OrderItem) => {
    setSelectedPurchase(purchase);
    setSelectedOrderItem(orderItem);
  };

  const handleBackToList = () => {
    setSelectedPurchase(null);
    setSelectedOrderItem(null);
  };

  const purchases = (data as { data?: Purchase[] })?.data || [];

  const filteredPurchases = purchases.filter((purchase: Purchase) => {
    const orderItems = purchase.orderItem || purchase.Orders?.orderItem || [];

    const matchesSearch =
      searchTerm === "" ||
      purchase.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.customer?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      orderItems.some((item: OrderItem) =>
        item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    const matchesStatus =
      statusFilter === "all" || purchase.statut === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (selectedPurchase && selectedOrderItem) {
    return (
      <ValidateOrdersDetail
        purchase={selectedPurchase}
        orderItem={selectedOrderItem}
        onBack={handleBackToList}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    console.error("Error loading purchases:", error);
    return (
      <ErrorMessage
        title="Erreur lors du chargement des commandes"
        buttonText="Réessayer"
        onButtonClick={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Validation des Commandes</h1>
          <p className="text-muted-foreground">
            Gérer et valider les articles des commandes
          </p>
        </div>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HugeiconsIcon
              icon={Settings02Icon}
              strokeWidth={2}
              className="h-5 w-5"
            />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <HugeiconsIcon
                  icon={Search01Icon}
                  strokeWidth={2}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                />
                <Input
                  placeholder="Rechercher par ID, client ou produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="confirmed">Confirmée</SelectItem>
                <SelectItem value="progress">En cours</SelectItem>
                <SelectItem value="packing">Emballage</SelectItem>
                <SelectItem value="delivered">Livrée</SelectItem>
                <SelectItem value="cancel">Annulée</SelectItem>
                <SelectItem value="courier_contacted">
                  Coursier contacté
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des commandes */}
      {filteredPurchases.length === 0 ? (
        <EmptyState
          title="Aucune commande trouvée"
          description="Aucune commande ne correspond à vos critères de recherche."
        />
      ) : (
        <div className="space-y-4">
          {filteredPurchases.map((purchase: Purchase) => (
            <Card key={purchase.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Commande #{purchase.id.slice(-8)}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Client: {purchase.customer?.name} •{" "}
                      {new Date(purchase.createdAt).toLocaleDateString("fr-FR")}{" "}
                      • {formatPrice(purchase.totalPrice)} {purchase.currency}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {
                      (purchase.orderItem || purchase.Orders?.orderItem || [])
                        .length
                    }{" "}
                    article(s)
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(purchase.orderItem || purchase.Orders?.orderItem || []).map(
                    (orderItem: OrderItem) => (
                      <div
                        key={orderItem.id}
                        className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        {/* Image du produit */}
                        <div className="shrink-0">
                          {orderItem.product?.ProductImage?.[0] ? (
                            <SafeImage
                              src={orderItem.product.ProductImage[0].imageUrl}
                              alt={orderItem.product.name || "Produit"}
                              width={60}
                              height={60}
                              className="rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-15 h-15 bg-muted rounded-lg flex items-center justify-center">
                              <HugeiconsIcon
                                icon={Package01Icon}
                                strokeWidth={2}
                                className="h-6 w-6 text-muted-foreground"
                              />
                            </div>
                          )}
                        </div>

                        {/* Informations du produit */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">
                            {orderItem.product?.name || "Produit sans nom"}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Qté: {orderItem.quantity}</span>
                            <span>
                              {formatPrice(orderItem.price)} {purchase.currency}
                            </span>
                            {orderItem.color && (
                              <div className="flex items-center gap-1">
                                <div
                                  className="w-3 h-3 rounded border"
                                  style={{ backgroundColor: orderItem.color }}
                                />
                                <span>{orderItem.color}</span>
                              </div>
                            )}
                            {orderItem.size && (
                              <span>Taille: {orderItem.size}</span>
                            )}
                          </div>
                        </div>

                        {/* Statut */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <HugeiconsIcon
                              icon={getStatusIcon(purchase.statut)}
                              strokeWidth={2}
                              className="h-4 w-4"
                            />
                            {getStatusBadge(purchase.statut)}
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleViewDetails(purchase, orderItem)
                            }
                            className="flex items-center gap-2"
                          >
                            <HugeiconsIcon
                              icon={EyeIcon}
                              strokeWidth={2}
                              className="h-4 w-4"
                            />
                            Détails
                          </Button>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
