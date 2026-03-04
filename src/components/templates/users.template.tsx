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
import { Download, ShoppingBag, UserCheck, Users, UserX } from "lucide-react";

import { useConfirm } from "@/hooks/useConfirm";
import type { Customer, Seller, userBlockedData } from "@/lib/types/index";
import type {
  UserTableCategory,
  UserTableRow,
} from "@/lib/types/user-table.type";
import {
  blockUserMutationOptions,
  fetchSellersQueryOptions,
  fetchUsersBlockedQueryOptions,
  fetchUsersQueryOptions,
} from "@/services/queries/user.queries";
import * as XLSX from "xlsx";
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
    isVerified: Boolean(
      sellerProfile?.isVerified ?? customerProfile?.isVerified,
    ),
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
  const { confirm, ConfirmDialog } = useConfirm();

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

  const handleBlockUser = async (userId: string) => {
    const confirmed = await confirm({
      title: "Modifier le statut utilisateur",
      description:
        "Êtes-vous sûr de vouloir modifier le statut de cet utilisateur ?",
      confirmText: "Modifier",
      variant: "destructive",
    });

    if (confirmed) {
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

  const handleExportToExcel = () => {
    try {
      // Préparer les données pour l'export
      const dataToExport = filteredData.map((user) => ({
        ID: user.id,
        Nom: user.displayName,
        Email: user.email,
        Téléphone: user.phone,
        Ville: user.city,
        Adresse: user.location,
        Type: viewMode === "customers" ? "Client" : "Vendeur",
        Statut: user.isVerified ? "Vérifié" : "Non vérifié",
        Bloqué: user.isBlocked ? "Oui" : "Non",
        "Date de création": new Date(user.createdAt).toLocaleDateString(
          "fr-FR",
        ),
      }));

      // Créer un nouveau workbook
      const wb = XLSX.utils.book_new();

      // Créer une worksheet avec les données
      const ws = XLSX.utils.json_to_sheet(dataToExport);

      // Ajouter la worksheet au workbook
      const sheetName = viewMode === "customers" ? "Clients" : "Vendeurs";
      XLSX.utils.book_append_sheet(wb, ws, sheetName);

      // Générer le nom du fichier avec la date
      const date = new Date().toISOString().split("T")[0];
      const fileName = `${sheetName.toLowerCase()}_${date}.xlsx`;

      // Télécharger le fichier
      XLSX.writeFile(wb, fileName);

      toastSuccess(`Export Excel réussi : ${fileName}`);
    } catch (error) {
      console.error("Erreur lors de l'export Excel:", error);
      toastErr("Erreur lors de l'export Excel");
    }
  };

  const allCustomers =
    customersData &&
    typeof customersData === "object" &&
    "data" in customersData
      ? (customersData.data ?? [])
      : [];
  const allSellers =
    sellersData && typeof sellersData === "object" && "data" in sellersData
      ? (sellersData.data ?? [])
      : [];
  const blockedUsers =
    blockedCustomersData &&
    typeof blockedCustomersData === "object" &&
    "data" in blockedCustomersData
      ? (blockedCustomersData.data ?? [])
      : [];

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
        ? toNumber(
            customersData &&
              typeof customersData === "object" &&
              "totalItems" in customersData
              ? customersData.totalItems
              : 0,
          )
        : toNumber(
            sellersData &&
              typeof sellersData === "object" &&
              "totalItems" in sellersData
              ? sellersData.totalItems
              : 0,
          );

  const stats = {
    totalCustomers: toNumber(
      customersData &&
        typeof customersData === "object" &&
        "totalItems" in customersData
        ? customersData.totalItems
        : 0,
    ),
    totalSellers: toNumber(
      sellersData &&
        typeof sellersData === "object" &&
        "totalItems" in sellersData
        ? sellersData.totalItems
        : 0,
    ),
    verifiedCustomers: mappedCustomers.filter((customer) => customer.isVerified)
      .length,
    verifiedSellers: mappedSellers.filter((seller) => seller.isVerified).length,
    blockedUsers: toNumber(
      blockedCustomersData &&
        typeof blockedCustomersData === "object" &&
        "totalItems" in blockedCustomersData
        ? blockedCustomersData.totalItems
        : 0,
      mappedBlockedUsers.length,
    ),
    totalUsers:
      toNumber(
        customersData &&
          typeof customersData === "object" &&
          "totalItems" in customersData
          ? customersData.totalItems
          : 0,
      ) +
      toNumber(
        sellersData &&
          typeof sellersData === "object" &&
          "totalItems" in sellersData
          ? sellersData.totalItems
          : 0,
      ),
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
              <Users className="h-6 w-6 text-violet-vif" />
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
              icon={Users}
              variant="default"
              index={0}
            />
            <UserStatsCard
              title="Clients"
              value={stats.totalCustomers}
              subtitle="Comptes clients"
              trend="+8%"
              icon={UserCheck}
              variant="success"
              index={1}
            />
            <UserStatsCard
              title="Vendeurs"
              value={stats.totalSellers}
              subtitle="Comptes vendeurs"
              trend="+15%"
              icon={ShoppingBag}
              variant="default"
              index={2}
            />
            <UserStatsCard
              title="Clients vérifiés"
              value={stats.verifiedCustomers}
              subtitle="Comptes validés"
              icon={UserCheck}
              variant="success"
              index={3}
            />
            <UserStatsCard
              title="Vendeurs vérifiés"
              value={stats.verifiedSellers}
              subtitle="Comptes validés"
              icon={ShoppingBag}
              variant="success"
              index={4}
            />
            <UserStatsCard
              title="Utilisateurs bloqués"
              value={stats.blockedUsers}
              subtitle="Comptes suspendus"
              icon={UserX}
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportToExcel}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export Excel
                  </Button>
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
                    {viewMode === "customers"
                      ? "Clients bloqués"
                      : "Vendeurs bloqués"}
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
      <ConfirmDialog />
    </motion.div>
  );
}
