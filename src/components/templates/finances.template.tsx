"use client";

import { FinanceStatsCard } from "@/components/atoms/FinanceStatsCard";
import { LoadingSkeleton } from "@/components/atoms/LoadingSkeleton";
import { TransactionsDataTable } from "@/components/molecules/TransactionsDataTable";
import { CommissionEvolutionChart } from "@/components/organisms/CommissionEvolutionChart";
import { PaymentMethodChart } from "@/components/organisms/PaymentMethodChart";
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

export default function FinancesTemplate() {
  const queryClient = useQueryClient();
  const [period, setPeriod] = useState("month");
  const [date, setDate] = useState(getToday());
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: commissionData, isLoading: isLoadingCommission } = useQuery(
    getCommissionGlobaleQueryOptions(),
  );

  console.log("commissionData", commissionData);

  const { data: transactionsData, isLoading: isLoadingTransactions } = useQuery(
    getTransactionsQueryOptions(period, date, page, limit),
  );

  const { data: sellersCommissionData, isLoading: isLoadingSellers } = useQuery(
    getCommissionSellersQueryOptions(page, limit),
  );

  const { data: dashboardData } = useQuery(getDashboardDataQueryOptions());

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["finances"] });
  };

  const stats = useMemo(() => {
    const commission = (commissionData as any)?.data?.commission || 0;
    const tva = (commissionData as any)?.data?.tva || 0;

    let totalRevenue = 0;
    let totalClients = 0;
    let totalOrders = 0;

    const dashboardStats = dashboardData?.statistics;
    console.log("dashboardStats", dashboardStats);
    if (dashboardStats && Array.isArray(dashboardStats)) {
      // Chercher le chiffre d'affaires
      const revenueStats = dashboardStats.find(
        (stat: any) =>
          stat.title?.toLowerCase().includes("chiffre") &&
          stat.title?.toLowerCase().includes("affaires"),
      );
      totalRevenue = Number(revenueStats?.value || 0);

      const clientStats = dashboardStats.find((stat: any) =>
        stat.title?.toLowerCase().includes("clients"),
      );
      totalClients = Number(clientStats?.value || 0);

      // Chercher le nombre de commandes
      const orderStats = dashboardStats.find((stat: any) =>
        stat.title?.toLowerCase().includes("commandes"),
      );
      totalOrders = Number(orderStats?.value || 0);

      console.log("Found stats:", { revenueStats, clientStats, orderStats });
    }

    console.log("Final calculated stats:", {
      totalRevenue,
      totalClients,
      totalOrders,
      totalCommissions: commission + tva,
    });

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

        <div className="grid gap-6 xl:grid-cols-2">
          <CommissionEvolutionChart />
          <PaymentMethodChart />
        </div>

        {/* Transactions Table */}
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
              <TransactionsDataTable
                transactions={
                  (transactionsData as any)?.data?.data
                    ? (transactionsData as any).data.data
                    : []
                }
                isLoading={isLoadingTransactions}
                period={period}
                date={date}
                onPeriodChange={setPeriod}
                onDateChange={setDate}
                totalItems={(transactionsData as any)?.totalItems || 0}
                currentPage={page}
                itemsPerPage={limit}
                onPageChange={setPage}
                onItemsPerPageChange={(newLimit) => {
                  setLimit(newLimit);
                  setPage(1); // Reset to first page when changing items per page
                }}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Sellers Commissions */}
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
              ) : sellersCommissionData &&
                Array.isArray(sellersCommissionData) &&
                sellersCommissionData.length > 0 ? (
                <div className="space-y-3">
                  {sellersCommissionData
                    .slice(0, 8)
                    .map(
                      (seller: {
                        id: string;
                        seller_name: string;
                        commission_rate: number;
                        commission_amount: number;
                        total_sales: number;
                      }) => (
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
                              <p className="font-medium">
                                {seller.seller_name}
                              </p>
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
                      ),
                    )}
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
