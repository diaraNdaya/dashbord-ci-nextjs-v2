"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { UserStatsCard } from "@/components/atoms/UserStatsCard";
import TablePagination from "@/components/molecules/TablePagination";
import { UsersDataTable } from "@/components/molecules/UsersDataTable";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Search01Icon,
  ShoppingBag01Icon,
  UserBlock01Icon,
  UserCheck01Icon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { Customer, Seller } from "@/lib/types/index";
import {
  blockUserMutationOptions,
  fetchSellersQueryOptions,
  fetchUsersBlockedQueryOptions,
  fetchUsersQueryOptions,
} from "@/services/queries/user.queries";
import { toastErr, toastSuccess } from "../molecules/ToastCard";

type UserData = Customer | Seller;

export default function UsersTemplate() {
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"customers" | "sellers">(
    "customers",
  );
  const [cityFilter, setCityFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const queryClient = useQueryClient();
  const router = useRouter();

  // Queries
  const { data: customersData, isLoading: isLoadingCustomers } = useQuery(
    fetchUsersQueryOptions(page, limit, {
      name: nameFilter || undefined,
      city: cityFilter || undefined,
    }),
  );

  const { data: sellersData, isLoading: isLoadingSellers } = useQuery(
    fetchSellersQueryOptions(page, limit, {
      store_name: nameFilter || undefined,
      business_address: cityFilter || undefined,
    }),
  );

  const { data: blockedCustomersData } = useQuery(
    fetchUsersBlockedQueryOptions(page, limit),
  );

  // Mutations
  const blockUserMutation = useMutation({
    ...blockUserMutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["sellers"] });
      toastSuccess("Statut utilisateur modifié avec succès");
    },
    onError: (error: Error) => {
      toastErr(error.message || "Erreur lors de la modification");
    },
  });

  const handleViewUser = (userId: string) => {
    router.push(`/users/${userId}`);
  };

  const handleBlockUser = (userId: string) => {
    if (
      confirm(
        "Êtes-vous sûr de vouloir modifier le statut de cet utilisateur ?",
      )
    ) {
      blockUserMutation.mutate(userId);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleViewModeChange = (mode: "customers" | "sellers") => {
    setViewMode(mode);
    setPage(1);
    setActiveTab("all");
  };

  const handleCityFilterChange = (value: string) => {
    setCityFilter(value === "all" ? "" : value);
    setPage(1);
  };

  const handleNameFilterChange = (value: string) => {
    setNameFilter(value);
    setPage(1);
  };

  // Extract data based on current view mode and tab
  const getCurrentData = (): UserData[] => {
    let sourceData;

    if (activeTab === "blocked-customers") {
      sourceData = blockedCustomersData;
    } else if (viewMode === "customers") {
      sourceData = customersData;
    } else {
      sourceData = sellersData;
    }

    if (!sourceData) return [];
    if (Array.isArray(sourceData)) return sourceData;
    if ("data" in sourceData && Array.isArray(sourceData.data)) {
      return sourceData.data;
    }
    return [];
  };

  const getCurrentTotalItems = (): number => {
    let sourceData;

    if (activeTab === "blocked-customers") {
      sourceData = blockedCustomersData;
    } else if (viewMode === "customers") {
      sourceData = customersData;
    } else {
      sourceData = sellersData;
    }

    if (!sourceData) return 0;
    if (
      "totalItems" in sourceData &&
      typeof sourceData.totalItems === "number"
    ) {
      return sourceData.totalItems;
    }
    return getCurrentData().length;
  };

  const currentData = getCurrentData();
  const currentTotalItems = getCurrentTotalItems();

  // Filter data based on search and tab
  const filteredData = currentData.filter((user) => {
    const matchesSearch =
      searchQuery === "" ||
      (viewMode === "customers"
        ? (user as Customer).name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        : (user as Seller).store_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
      user.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.user?.city?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "verified" && (user as Customer | Seller).isVerified) ||
      (activeTab === "unverified" && !(user as Customer | Seller).isVerified) ||
      (activeTab === "blocked-customers" && user.user?.isBlocked) ||
      (activeTab === "blocked-sellers" && user.user?.isBlocked);

    return matchesSearch && matchesTab;
  });

  // Calculate stats
  const allCustomers = customersData?.data || [];
  const allSellers = sellersData?.data || [];
  const blockedUsers = blockedCustomersData?.data || [];

  const stats = {
    totalCustomers: Array.isArray(allCustomers) ? allCustomers.length : 0,
    totalSellers: Array.isArray(allSellers) ? allSellers.length : 0,
    verifiedCustomers: Array.isArray(allCustomers)
      ? allCustomers.filter((c: Customer) => c.isVerified).length
      : 0,
    verifiedSellers: Array.isArray(allSellers)
      ? allSellers.filter((s: Seller) => s.isVerified).length
      : 0,
    blockedUsers: Array.isArray(blockedUsers) ? blockedUsers.length : 0,
    totalUsers:
      (Array.isArray(allCustomers) ? allCustomers.length : 0) +
      (Array.isArray(allSellers) ? allSellers.length : 0),
  };

  const getCurrentUserType = ():
    | "customers"
    | "sellers"
    | "blocked-customers"
    | "blocked-sellers" => {
    if (activeTab === "blocked-customers") return "blocked-customers";
    if (activeTab === "blocked-sellers") return "blocked-sellers";
    return viewMode;
  };

  const isLoading =
    viewMode === "customers" ? isLoadingCustomers : isLoadingSellers;

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
                icon={UserMultiple02Icon}
                className="h-6 w-6 text-violet-vif"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Utilisateurs 👥</h1>
              <p className="text-muted-foreground">
                Gérer les comptes clients et vendeurs
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            <UserStatsCard
              title="Total utilisateurs"
              value={stats.totalUsers}
              subtitle="Clients + Vendeurs"
              trend="+12%"
              icon={UserMultiple02Icon}
              variant="default"
              index={0}
            />
            <UserStatsCard
              title="Clients"
              value={stats.totalCustomers}
              subtitle="Comptes clients"
              trend="+8%"
              icon={UserCheck01Icon}
              variant="success"
              index={1}
            />
            <UserStatsCard
              title="Vendeurs"
              value={stats.totalSellers}
              subtitle="Comptes vendeurs"
              trend="+15%"
              icon={ShoppingBag01Icon}
              variant="default"
              index={2}
            />
            <UserStatsCard
              title="Clients vérifiés"
              value={stats.verifiedCustomers}
              subtitle="Comptes validés"
              icon={UserCheck01Icon}
              variant="success"
              index={3}
            />
            <UserStatsCard
              title="Vendeurs vérifiés"
              value={stats.verifiedSellers}
              subtitle="Comptes validés"
              icon={ShoppingBag01Icon}
              variant="success"
              index={4}
            />
            <UserStatsCard
              title="Utilisateurs bloqués"
              value={stats.blockedUsers}
              subtitle="Comptes suspendus"
              icon={UserBlock01Icon}
              variant="danger"
              index={5}
            />
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CardTitle>Gestion des utilisateurs</CardTitle>
                  {/* View Mode Toggle Buttons */}
                  <div className="flex items-center gap-2 ml-6">
                    <Button
                      variant={viewMode === "customers" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleViewModeChange("customers")}
                    >
                      Clients
                    </Button>
                    <Button
                      variant={viewMode === "sellers" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleViewModeChange("sellers")}
                    >
                      Vendeurs
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={cityFilter === "" ? "all" : cityFilter}
                    onValueChange={handleCityFilterChange}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Ville" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les villes</SelectItem>
                      <SelectItem value="Abidjan">Abidjan</SelectItem>
                      <SelectItem value="Bouaké">Bouaké</SelectItem>
                      <SelectItem value="Yamoussoukro">Yamoussoukro</SelectItem>
                      <SelectItem value="San-Pédro">San-Pédro</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Filtrer par nom..."
                    className="w-40"
                    value={nameFilter}
                    onChange={(e) => handleNameFilterChange(e.target.value)}
                  />

                  <div className="relative">
                    <HugeiconsIcon
                      icon={Search01Icon}
                      className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      placeholder="Rechercher..."
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
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all">Tous</TabsTrigger>
                  <TabsTrigger value="verified">Vérifiés</TabsTrigger>
                  <TabsTrigger value="unverified">Non vérifiés</TabsTrigger>
                  <TabsTrigger value="blocked-customers">
                    Clients bloqués
                  </TabsTrigger>
                  <TabsTrigger value="blocked-sellers">
                    Vendeurs bloqués
                  </TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab} className="mt-6 space-y-4">
                  {isLoading ? (
                    <div className="flex h-32 items-center justify-center">
                      <div className="text-muted-foreground">Chargement...</div>
                    </div>
                  ) : (
                    <>
                      <UsersDataTable
                        data={filteredData}
                        onViewUser={handleViewUser}
                        onBlockUser={handleBlockUser}
                        searchQuery={searchQuery}
                        userType={getCurrentUserType()}
                      />
                      <TablePagination
                        page={page}
                        limit={limit}
                        totalItems={currentTotalItems}
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
