"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

import { OrderStatsCard } from "@/components/atoms/OrderStatsCard";
import { OrdersDataTable } from "@/components/molecules/OrdersDataTable";
import TablePagination from "@/components/molecules/TablePagination";
import type { Order } from "@/lib/types/orders.type";
import {
  deleteOrderMutationOptions,
  fetchOrdersQueryOptions,
} from "@/services/queries/orders.queries";
import { Search01Icon, ShoppingCart01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";

export default function OrdersTemplate() {
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const router = useRouter();

  // Queries
  const { data: ordersData, isLoading } = useQuery(
    fetchOrdersQueryOptions(
      page,
      limit,
      activeTab === "all" ? undefined : activeTab,
    ),
  );

  // Mutations
  const deleteOrderMutation = useMutation({
    ...deleteOrderMutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Commande supprimée avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la suppression");
    },
  });

  const handleViewOrder = (orderId: string) => {
    router.push(`/orders/${orderId}`);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) {
      deleteOrderMutation.mutate(orderId);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    setPage(1); // Reset to first page when changing tab
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1); // Reset to first page when searching
  };

  // Type guard to safely extract orders array and pagination info
  const orders: Order[] = (() => {
    if (!ordersData) return [];
    if (Array.isArray(ordersData)) return ordersData;
    if ("data" in ordersData && Array.isArray(ordersData.data)) {
      return ordersData.data;
    }
    return [];
  })();

  // Get total items for pagination
  const totalItems = (() => {
    if (!ordersData) return 0;
    if (
      "totalItems" in ordersData &&
      typeof ordersData.totalItems === "number"
    ) {
      return ordersData.totalItems;
    }
    return orders.length;
  })();

  console.log("Pagination info:", {
    page,
    limit,
    totalItems,
    ordersCount: orders.length,
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o: Order) => o.statut === "pending").length,
    confirmed: orders.filter((o: Order) => o.statut === "confirmed").length,
    progress: orders.filter((o: Order) => o.statut === "progress").length,
    courier_contacted: orders.filter(
      (o: Order) => o.statut === "courier_contacted",
    ).length,
    packing: orders.filter((o: Order) => o.statut === "packing").length,
    delivered: orders.filter((o: Order) => o.statut === "delivered").length,
    cancel: orders.filter((o: Order) => o.statut === "cancel").length,
    revenue: orders.reduce(
      (sum: number, o: Order) => sum + (o.totalAmount || 0),
      0,
    ),
  };

  console.log("Order statistics:", stats);

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
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-vif/10 dark:bg-violet-vif/5">
              <HugeiconsIcon
                icon={ShoppingCart01Icon}
                className="h-6 w-6 text-violet-vif"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Commandes 🛒</h1>
              <p className="text-muted-foreground">
                Gérer et suivre toutes les commandes
              </p>
            </div>
          </div>
        </motion.div>
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <OrderStatsCard
              title="Total commandes"
              value={stats.total}
              subtitle="Toutes les commandes"
              trend="+20%"
              variant="new"
            />
            <OrderStatsCard
              title="En attente"
              value={stats.pending + stats.confirmed}
              subtitle="À traiter"
              trend="+11%"
              variant="pending"
            />
            <OrderStatsCard
              title="En cours"
              value={stats.progress + stats.courier_contacted + stats.packing}
              subtitle="En traitement"
              trend="+18%"
              variant="delivered"
            />
            {/* <OrderStatsCard
              title="Chiffre d'affaires"
              value={`${stats.revenue.toLocaleString()} FCFA`}
              subtitle="Ce mois"
              trend="+8%"
            /> */}
          </div>
        </motion.div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Liste des commandes</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <HugeiconsIcon
                      icon={Search01Icon}
                      className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      placeholder="Rechercher une commande..."
                      className="pl-9 w-64"
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-8">
                  <TabsTrigger value="all">Toutes</TabsTrigger>
                  <TabsTrigger value="pending">En attente</TabsTrigger>
                  <TabsTrigger value="progress">En cours</TabsTrigger>
                  <TabsTrigger value="confirmed">Confirmées</TabsTrigger>
                  <TabsTrigger value="courier_contacted">
                    Coursier Contactee
                  </TabsTrigger>
                  <TabsTrigger value="packing">Livraison</TabsTrigger>
                  <TabsTrigger value="delivered">Livrées</TabsTrigger>
                  <TabsTrigger value="cancel">Annulées</TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab} className="mt-6 space-y-4">
                  {isLoading ? (
                    <div className="flex h-32 items-center justify-center">
                      <div className="text-muted-foreground">Chargement...</div>
                    </div>
                  ) : (
                    <>
                      <OrdersDataTable
                        data={orders}
                        onViewOrder={handleViewOrder}
                        onDeleteOrder={handleDeleteOrder}
                        searchQuery={searchQuery}
                      />
                      <TablePagination
                        page={page}
                        limit={limit}
                        totalItems={totalItems}
                        onPageChange={handlePageChange}
                        onLimitChange={handleLimitChange}
                      />
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
