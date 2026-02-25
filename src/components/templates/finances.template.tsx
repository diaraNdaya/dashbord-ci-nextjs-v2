"use client";

import { FinanceStatsCard } from "@/components/atoms/FinanceStatsCard";
import { LoadingSkeleton } from "@/components/atoms/LoadingSkeleton";
import { CommissionEvolutionChart } from "@/components/organisms/CommissionEvolutionChart";
import { PaymentMethodChart } from "@/components/organisms/PaymentMethodChart";
import TransactionsTable from "@/components/organisms/TransactionsTable";
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
import { TransactionsApiResponse } from "@/services/actions/finances.actions";
import { getDashboardDataQueryOptions } from "@/services/queries/dashboard.queries";
import {
  getCommissionGlobaleQueryOptions,
  getCommissionSellersQueryOptions,
  getTransactionsQueryOptions,
} from "@/services/queries/finances.queries";
import {
  CreditCardIcon,
  MoneyBag02Icon,
  PercentIcon,
  ShoppingCart01Icon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

const getToday = () => new Date().toISOString().slice(0, 10);

// Type guard pour vérifier si le résultat est une erreur
const isApiError = (
  result: any,
): result is import("@/services/api.type").ApiError => {
  return (
    result && "message" in result && "status" in result && !("data" in result)
  );
};

// Type guard pour vérifier si c'est une réponse de transactions valide
const isTransactionsResponse = (
  result: any,
): result is TransactionsApiResponse => {
  return (
    result &&
    "data" in result &&
    result.data &&
    "data" in result.data &&
    Array.isArray(result.data.data)
  );
};

export default function FinancesTemplate() {
  const queryClient = useQueryClient();
  const [period, setPeriod] = useState("month");
  const [date, setDate] = useState(getToday());
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: commissionData, isLoading: isLoadingCommission } = useQuery(
    getCommissionGlobaleQueryOptions(),
  );

  const { data: transactionsData, isLoading: isLoadingTransactions } = useQuery(
    getTransactionsQueryOptions(period, date, page, limit),
  );
  console.log(
    "DataTransactions",
    !isApiError(transactionsData) ? transactionsData?.data?.data : "Error",
  );
  const { data: sellersCommissionData, isLoading: isLoadingSellers } = useQuery(
    getCommissionSellersQueryOptions(page, limit),
  );

  const { data: dashboardData } = useQuery(getDashboardDataQueryOptions());

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["finances"] });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  const stats = useMemo(() => {
    const commission =
      (!isApiError(commissionData) && commissionData?.data?.commission) || 0;
    const tva = (!isApiError(commissionData) && commissionData?.data?.tva) || 0;

    let totalRevenue = 0;
    let totalClients = 0;
    let totalOrders = 0;

    const dashboardStats = dashboardData?.data?.statistics;
    if (dashboardStats && Array.isArray(dashboardStats)) {
      const revenueStats = dashboardStats.find(
        (stat: any) =>
          stat.title?.toLowerCase().includes("chiffre") ||
          stat.title?.toLowerCase().includes("affaires"),
      );
      totalRevenue = Number(revenueStats?.value || 0);
      const clientStats = dashboardStats.find((stat: any) =>
        stat.title?.toLowerCase().includes("client"),
      );
      totalClients = Number(clientStats?.value || 0);

      const orderStats = dashboardStats.find((stat: any) =>
        stat.title?.toLowerCase().includes("commande"),
      );
      totalOrders = Number(orderStats?.value || 0);
    }

    return {
      totalRevenue,
      totalClients,
      totalOrders,
      totalCommissions: commission + tva,
    };
  }, [commissionData, dashboardData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const isLoading = isLoadingCommission || isLoadingTransactions;

  return (
    <motion.div
      className="flex flex-1 flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="@container/main flex flex-1 flex-col gap-6 p-4 lg:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-vert-menthe/10 dark:bg-vert-menthe/5">
              <HugeiconsIcon
                icon={MoneyBag02Icon}
                className="h-6 w-6 text-vert-menthe"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Finances 💰</h1>
              <p className="text-muted-foreground">
                Gestion des revenus, commissions et transactions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Jour</SelectItem>
                <SelectItem value="week">Semaine</SelectItem>
                <SelectItem value="month">Mois</SelectItem>
                <SelectItem value="year">Année</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-40"
            />
            <Button
              onClick={handleRefresh}
              className="bg-vert-menthe hover:bg-vert-menthe/90"
            >
              Actualiser
            </Button>
          </div>
        </motion.div>

        {isLoading ? (
          <LoadingSkeleton rows={4} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <FinanceStatsCard
                title="Revenus totaux"
                value={formatCurrency(stats.totalRevenue)}
                subtitle="Chiffre d'affaires"
                trend={{
                  value: "+12.5%",
                  direction: "up",
                }}
                icon={CreditCardIcon}
                variant="success"
                index={0}
              />
              <FinanceStatsCard
                title="Nombre de clients"
                value={stats.totalClients.toLocaleString()}
                subtitle="Clients enregistrés"
                trend={{
                  value: "+8.3%",
                  direction: "up",
                }}
                icon={UserMultiple02Icon}
                variant="default"
                index={1}
              />
              <FinanceStatsCard
                title="Nombre de commandes"
                value={stats.totalOrders.toLocaleString()}
                subtitle="Commandes totales"
                trend={{
                  value: "+15.7%",
                  direction: "up",
                }}
                icon={ShoppingCart01Icon}
                variant="warning"
                index={2}
              />
              <FinanceStatsCard
                title="Commissions"
                value={formatCurrency(stats.totalCommissions)}
                subtitle="Commissions + TVA"
                trend={{
                  value: "+10.1%",
                  direction: "up",
                }}
                icon={PercentIcon}
                variant="success"
                index={3}
              />
            </div>
          </motion.div>
        )}

        <div className="grid gap-6 xl:grid-cols-1">
          <CommissionEvolutionChart />
          <PaymentMethodChart />
        </div>

        {/* Tableau des transactions avec pagination */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {isTransactionsResponse(transactionsData) ? (
                <TransactionsTable
                  transactions={transactionsData.data.data}
                  totalItems={transactionsData.data.totalItems}
                  currentPage={page}
                  limit={limit}
                  onPageChange={handlePageChange}
                  onLimitChange={handleLimitChange}
                  isLoading={isLoadingTransactions}
                />
              ) : (
                <div className="flex h-32 items-center justify-center text-muted-foreground">
                  {isLoadingTransactions
                    ? "Chargement..."
                    : "Aucune transaction disponible"}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Commissions des vendeurs</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingSellers ? (
                <LoadingSkeleton rows={6} />
              ) : !isApiError(sellersCommissionData) &&
                sellersCommissionData?.data &&
                Array.isArray(sellersCommissionData.data) &&
                sellersCommissionData.data.length > 0 ? (
                <div className="space-y-3">
                  {sellersCommissionData.data.slice(0, 8).map((seller: any) => (
                    <div
                      key={seller.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-bleu-doux/10 flex items-center justify-center">
                          <span className="font-semibold text-bleu-doux">
                            {seller.seller_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{seller.seller_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Taux: {seller.commission_rate}%
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatCurrency(seller.commission_amount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Ventes: {formatCurrency(seller.total_sales)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-32 items-center justify-center text-muted-foreground">
                  Aucune commission de vendeur disponible
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
