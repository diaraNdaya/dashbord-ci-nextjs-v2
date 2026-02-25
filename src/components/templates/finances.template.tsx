"use client";

import { FinanceStatsCard } from "@/components/atoms/FinanceStatsCard";
import { LoadingSkeleton } from "@/components/atoms/LoadingSkeleton";
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
  ExchangeIcon,
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
  const [page] = useState(1);
  const [limit] = useState(10);

  const { data: commissionData, isLoading: isLoadingCommission } = useQuery(
    getCommissionGlobaleQueryOptions(),
  );

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
    const commission = commissionData?.data?.data.commission || 0;
    const tva = commissionData?.data?.data.tva || 0;

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

        <div className="grid gap-6 xl:grid-cols-2">
          <CommissionEvolutionChart />
          <PaymentMethodChart />
        </div>

        {/* Additional Section */}
        <div className="grid gap-6 xl:grid-cols-2">
          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Transactions récentes</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingTransactions ? (
                  <LoadingSkeleton rows={5} />
                ) : (transactionsData as any)?.data?.transactions &&
                  Array.isArray((transactionsData as any).data.transactions) &&
                  (transactionsData as any).data.transactions.length > 0 ? (
                  <div className="space-y-3">
                    {(transactionsData as any).data.transactions
                      .slice(0, 5)
                      .map((transaction: any) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-3 rounded-lg border"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-violet-vif/10 flex items-center justify-center">
                              <HugeiconsIcon
                                icon={ExchangeIcon}
                                className="h-4 w-4 text-violet-vif"
                              />
                            </div>
                            <div>
                              <p className="font-medium">
                                {transaction.user?.name ||
                                  "Utilisateur inconnu"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {transaction.type} • {transaction.status}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {formatCurrency(transaction.amount)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(
                                transaction.createdAt,
                              ).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="flex h-32 items-center justify-center text-muted-foreground">
                    Aucune transaction récente
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

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
              ) : (sellersCommissionData as any)?.data &&
                Array.isArray((sellersCommissionData as any).data) &&
                (sellersCommissionData as any).data.length > 0 ? (
                <div className="space-y-3">
                  {(sellersCommissionData as any).data
                    .slice(0, 8)
                    .map((seller: any) => (
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
