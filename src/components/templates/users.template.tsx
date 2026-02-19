"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { UserStatsCard } from "@/components/atoms/UserStatsCard";
import TablePagination from "@/components/molecules/TablePagination";
import { UsersDataTable } from "@/components/molecules/UsersDataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  ShoppingBag01Icon,
  UserBlock01Icon,
  UserCheck01Icon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { Customer, Seller, userBlockedData } from "@/lib/types/index";
import type { UserTableCategory, UserTableRow } from "@/lib/types/user-table.type";
import {
  blockUserMutationOptions,
  fetchSellersQueryOptions,
  fetchUsersBlockedQueryOptions,
  fetchUsersQueryOptions,
} from "@/services/queries/user.queries";
import { toastErr, toastSuccess } from "../molecules/ToastCard";

type ActiveTab = "all" | "verified" | "unverified" | "blocked";

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
};

const mapCustomerToRow = (customer: Customer): UserTableRow => ({
  id: customer.id,
  profileId: customer.id,
  category: "customers",
  displayName: customer.name,
  email: customer.user?.email ?? "",
  phone: String(customer.user?.phone_number ?? ""),
  location: customer.address ?? "",
  city: customer.user?.city ?? "",
  createdAt: customer.createdAt,
  isVerified: customer.isVerified,
  isBlocked: Boolean(customer.user?.isBlocked),
  avatar: null,
});

const mapSellerToRow = (seller: Seller): UserTableRow => ({
  id: seller.id,
  profileId: seller.id,
  category: "sellers",
  displayName: seller.store_name,
  email: seller.user?.email ?? "",
  phone: String(seller.user?.phone_number ?? ""),
  location: seller.business_address ?? "",
  city: seller.user?.city ?? "",
  createdAt: seller.createdAt,
  isVerified: seller.isVerified,
  isBlocked: Boolean(seller.user?.isBlocked),
  avatar: seller.company_logo ?? null,
});

const mapBlockedUserToRow = (blockedUser: userBlockedData): UserTableRow => {
  const sellerProfile = blockedUser.Seller;
  const customerProfile = blockedUser.Customers;
  const isSeller =
    Boolean(blockedUser.isVendor) || Boolean(sellerProfile?.store_name);
  const category: UserTableCategory = isSeller ? "sellers" : "customers";

  return {
    id: blockedUser.id,
    profileId: sellerProfile?.id ?? customerProfile?.id ?? blockedUser.id,
    category,
    displayName:
      sellerProfile?.store_name ??
      customerProfile?.name ??
      blockedUser.username ??
      blockedUser.email,
    email: blockedUser.email ?? "",
    phone: String(blockedUser.phone_number ?? ""),
    location:
      sellerProfile?.business_address ??
      customerProfile?.address ??
      blockedUser.city ??
      "",
    city: blockedUser.city ?? "",
    createdAt: blockedUser.createdAt,
    isVerified: Boolean(sellerProfile?.isVerified ?? customerProfile?.isVerified),
    isBlocked: Boolean(blockedUser.isBlocked),
    avatar: sellerProfile?.company_logo ?? null,
  };
};

export default function UsersTemplate() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [viewMode, setViewMode] = useState<UserTableCategory>("customers");

  const [nameInput, setNameInput] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setNameFilter(nameInput.trim());
      setCityFilter(cityInput.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [nameInput, cityInput]);

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

  const { data: blockedCustomersData, isLoading: isLoadingBlocked } = useQuery(
    fetchUsersBlockedQueryOptions(page, limit),
  );

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

  const handleViewUser = (profileId: string) => {
    const basePath =
      viewMode === "customers" ? "/users/customers" : "/users/sellers";
    router.push(`${basePath}/${profileId}`);
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
    setActiveTab(newTab as ActiveTab);
    setPage(1);
  };

  const handleViewModeChange = (mode: UserTableCategory) => {
    setViewMode(mode);
    setPage(1);
    setActiveTab("all");
  };

  const handleCityFilterChange = (value: string) => {
    setCityInput(value);
  };

  const handleNameFilterChange = (value: string) => {
    setNameInput(value);
  };

  const allCustomers = customersData?.data?.data ?? [];
  const allSellers = sellersData?.data?.data ?? [];
  const blockedUsers = blockedCustomersData?.data?.data ?? [];

  const mappedCustomers = allCustomers.map(mapCustomerToRow);
  const mappedSellers = allSellers.map(mapSellerToRow);
  const mappedBlockedUsers = blockedUsers.map(mapBlockedUserToRow);

  const getCurrentData = (): UserTableRow[] => {
    if (activeTab === "blocked") {
      return mappedBlockedUsers.filter((user) => user.category === viewMode);
    }
    return viewMode === "customers" ? mappedCustomers : mappedSellers;
  };

  const currentData = getCurrentData();

  const filteredData = currentData.filter((user) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "verified" && user.isVerified) ||
      (activeTab === "unverified" && !user.isVerified) ||
      (activeTab === "blocked" && user.isBlocked && user.category === viewMode);

    return matchesTab;
  });

  const currentTotalItems =
    activeTab === "blocked"
      ? currentData.length
      : viewMode === "customers"
        ? toNumber(customersData?.data?.totalItems)
        : toNumber(sellersData?.data?.totalItems);

  const stats = {
    totalCustomers: toNumber(customersData?.data?.totalItems),
    totalSellers: toNumber(sellersData?.data?.totalItems),
    verifiedCustomers: mappedCustomers.filter((customer) => customer.isVerified)
      .length,
    verifiedSellers: mappedSellers.filter((seller) => seller.isVerified).length,
    blockedUsers: toNumber(
      blockedCustomersData?.data?.totalItems,
      mappedBlockedUsers.length,
    ),
    totalUsers:
      toNumber(customersData?.data?.totalItems) +
      toNumber(sellersData?.data?.totalItems),
  };

  const getCurrentUserType = ():
    | "customers"
    | "sellers"
    | "blocked-customers"
    | "blocked-sellers" => {
    if (activeTab === "blocked") {
      return viewMode === "customers" ? "blocked-customers" : "blocked-sellers";
    }
    return viewMode;
  };

  const isLoading =
    activeTab === "blocked"
      ? isLoadingBlocked
      : viewMode === "customers"
        ? isLoadingCustomers
        : isLoadingSellers;

  return (
    <motion.div
      className="flex flex-1 flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="@container/main flex flex-1 flex-col gap-6">
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
                  <div className="ml-6 flex items-center gap-2">
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
                  <Input
                    placeholder="Nom (API)..."
                    className="w-40"
                    value={nameInput}
                    onChange={(e) => handleNameFilterChange(e.target.value)}
                  />
                  <Input
                    placeholder="Ville (API)..."
                    className="w-40"
                    value={cityInput}
                    onChange={(e) => handleCityFilterChange(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">Tous</TabsTrigger>
                  <TabsTrigger value="verified">Vérifiés</TabsTrigger>
                  <TabsTrigger value="unverified">Non vérifiés</TabsTrigger>
                  <TabsTrigger value="blocked">
                    {viewMode === "customers" ? "Clients bloqués" : "Vendeurs bloqués"}
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
                        searchQuery=""
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
