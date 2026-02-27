"use client";

import { LoadingSkeleton } from "@/components/atoms/LoadingSkeleton";
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
import { formatPrice } from "@/lib/utils";
import { TransactionsApiResponse } from "@/services/actions/finances.actions";
import { getTransactionsQueryOptions } from "@/services/queries/finances.queries";
import {
  Calendar03Icon,
  CreditCardIcon,
  MoneyBag02Icon,
  PieChartIcon,
  SmartPhone01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

const getToday = () => new Date().toISOString().slice(0, 10);

interface PaymentMethodChartProps {
  className?: string;
}

// Type guard pour vérifier si c'est une réponse de transactions valide
const isTransactionsResponse = (
  result: unknown,
): result is TransactionsApiResponse => {
  return (
    result !== null &&
    typeof result === "object" &&
    "data" in result &&
    result.data !== null &&
    typeof result.data === "object" &&
    "data" in result.data &&
    Array.isArray((result.data as { data: unknown[] }).data)
  );
};

const colorByMethod: Record<string, string> = {
  mobile_money: "#8b5cf6", // violet
  card: "#10b981", // vert
  cash: "#f59e0b", // orange
  bank_transfer: "#3b82f6", // bleu
};

export function PaymentMethodChart({ className }: PaymentMethodChartProps) {
  const [period, setPeriod] = useState("month");
  const [date, setDate] = useState(getToday());
  const [page] = useState(1);
  const [limit] = useState(1000);

  const {
    data: transactionsData,
    isLoading,
    error,
    refetch,
  } = useQuery(getTransactionsQueryOptions(period, date, page, limit));

  const paymentAnalysis = useMemo(() => {
    // Vérifier si nous avons des données valides
    if (!isTransactionsResponse(transactionsData)) {
      console.log("No valid transactions response");
      return {
        data: [],
        totalTransactions: 0,
        totalAmount: 0,
      };
    }

    const transactions = transactionsData.data.data;
    console.log("transactions array:", transactions);

    if (!Array.isArray(transactions) || transactions.length === 0) {
      console.log("No transactions array or empty");
      return {
        data: [],
        totalTransactions: 0,
        totalAmount: 0,
      };
    }

    const methodGroups: Record<string, { count: number; amount: number }> = {};
    let totalAmount = 0;

    console.log("Processing transactions:", transactions);
    transactions.forEach((transaction, index) => {
      console.log(`Transaction ${index}:`, transaction);
      const method = transaction.payment_method || "card";
      const amount = Number(transaction.amount || 0);

      if (!methodGroups[method]) {
        methodGroups[method] = { count: 0, amount: 0 };
      }

      methodGroups[method].count += 1;
      methodGroups[method].amount += amount;
      totalAmount += amount;
    });

    console.log("Method groups:", methodGroups);

    const data = Object.entries(methodGroups).map(([method, stats]) => ({
      method,
      count: stats.count,
      amount: stats.amount,
      percentage: (stats.count / transactions.length) * 100,
      color: colorByMethod[method] || colorByMethod.card,
    }));

    console.log("Final payment analysis data:", data);

    return {
      data,
      totalTransactions: transactions.length,
      totalAmount,
    };
  }, [transactionsData]);

  const getPeriodLabel = (p: string): string => {
    switch (p) {
      case "year":
        return "Année";
      case "month":
        return "Mois";
      case "week":
        return "Semaine";
      case "day":
        return "Jour";
      default:
        return "Période";
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "mobile_money":
      case "mobile":
        return SmartPhone01Icon;
      case "cash":
      case "especes":
        return MoneyBag02Icon;
      case "bank_transfer":
      case "virement":
        return CreditCardIcon;
      default:
        return CreditCardIcon;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method.toLowerCase()) {
      case "mobile_money":
      case "mobile":
        return "Mobile Money";
      case "cash":
      case "especes":
        return "Espèces";
      case "bank_transfer":
      case "virement":
        return "Virement bancaire";
      case "card":
      case "carte":
        return "Carte bancaire";
      default:
        return method.charAt(0).toUpperCase() + method.slice(1);
    }
  };

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-destructive mb-4">
              Erreur lors du chargement des données
            </p>
            <Button onClick={() => refetch()}>Réessayer</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl sm:text-2xl">
              Méthodes de paiement
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Répartition par {getPeriodLabel(period).toLowerCase()}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="year">Année</SelectItem>
                <SelectItem value="month">Mois</SelectItem>
                <SelectItem value="week">Semaine</SelectItem>
                <SelectItem value="day">Jour</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative">
              <HugeiconsIcon
                icon={Calendar03Icon}
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-9 w-full sm:w-[200px]"
              />
            </div>
          </div>
        </div>

        {/* Statistiques */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800"
            >
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Total des transactions
              </p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {paymentAnalysis.totalTransactions.toLocaleString("fr-FR")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800"
            >
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                Montant total
              </p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {formatPrice(paymentAnalysis.totalAmount)}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800"
            >
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                Méthodes utilisées
              </p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {paymentAnalysis.data.length}
              </p>
            </motion.div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <LoadingSkeleton rows={1} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <LoadingSkeleton rows={1} />
              <LoadingSkeleton rows={1} />
              <LoadingSkeleton rows={1} />
            </div>
          </div>
        ) : paymentAnalysis.data.length > 0 ? (
          <div className="space-y-6">
            {/* Graphique en donut avec Chart.js ou version simplifiée */}
            <div className="flex items-center justify-center">
              <div className="relative w-80 h-80">
                {paymentAnalysis.data.length === 1 ? (
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <circle
                      cx="100"
                      cy="100"
                      r="60"
                      fill="none"
                      stroke={paymentAnalysis.data[0].color}
                      strokeWidth="30"
                      className="opacity-80"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="25"
                      fill="hsl(var(--background))"
                      stroke="hsl(var(--border))"
                      strokeWidth="2"
                    />
                    <foreignObject x="85" y="85" width="30" height="30">
                      <div className="flex items-center justify-center w-full h-full">
                        <HugeiconsIcon
                          icon={PieChartIcon}
                          className="h-6 w-6 text-muted-foreground"
                        />
                      </div>
                    </foreignObject>
                  </svg>
                ) : (
                  // Cas normal : plusieurs méthodes de paiement
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    {paymentAnalysis.data.map((item, index) => {
                      const total = paymentAnalysis.totalTransactions;
                      const percentage = (item.count / total) * 100;

                      // Calculer l'angle de départ (cumul des segments précédents)
                      const previousPercentage = paymentAnalysis.data
                        .slice(0, index)
                        .reduce((sum, d) => sum + (d.count / total) * 100, 0);

                      const startAngle = (previousPercentage / 100) * 360 - 90; // -90 pour commencer en haut
                      const endAngle =
                        ((previousPercentage + percentage) / 100) * 360 - 90;

                      const largeArcFlag = percentage > 50 ? 1 : 0;

                      // Coordonnées du cercle extérieur
                      const x1 =
                        100 + 60 * Math.cos((startAngle * Math.PI) / 180);
                      const y1 =
                        100 + 60 * Math.sin((startAngle * Math.PI) / 180);
                      const x2 =
                        100 + 60 * Math.cos((endAngle * Math.PI) / 180);
                      const y2 =
                        100 + 60 * Math.sin((endAngle * Math.PI) / 180);

                      // Coordonnées du cercle intérieur
                      const x3 =
                        100 + 30 * Math.cos((endAngle * Math.PI) / 180);
                      const y3 =
                        100 + 30 * Math.sin((endAngle * Math.PI) / 180);
                      const x4 =
                        100 + 30 * Math.cos((startAngle * Math.PI) / 180);
                      const y4 =
                        100 + 30 * Math.sin((startAngle * Math.PI) / 180);

                      const pathData = [
                        `M ${x1} ${y1}`,
                        `A 60 60 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                        `L ${x3} ${y3}`,
                        `A 30 30 0 ${largeArcFlag} 0 ${x4} ${y4}`,
                        "Z",
                      ].join(" ");

                      return (
                        <motion.path
                          key={item.method}
                          d={pathData}
                          fill={item.color}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 0.8, scale: 1 }}
                          whileHover={{ opacity: 1, scale: 1.02 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="cursor-pointer"
                          style={{
                            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                          }}
                        />
                      );
                    })}

                    {/* Centre du donut */}
                    <circle
                      cx="100"
                      cy="100"
                      r="25"
                      fill="hsl(var(--background))"
                      stroke="hsl(var(--border))"
                      strokeWidth="2"
                    />

                    {/* Icône au centre */}
                    <foreignObject x="85" y="85" width="30" height="30">
                      <div className="flex items-center justify-center w-full h-full">
                        <HugeiconsIcon
                          icon={PieChartIcon}
                          className="h-6 w-6 text-muted-foreground"
                        />
                      </div>
                    </foreignObject>
                  </svg>
                )}
              </div>
            </div>

            {/* Légende détaillée */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paymentAnalysis.data.map((item, index) => (
                <motion.div
                  key={item.method}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon
                        icon={getMethodIcon(item.method)}
                        className="h-4 w-4 text-muted-foreground"
                      />
                      <span className="font-medium">
                        {getMethodLabel(item.method)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      {item.percentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.count} transaction{item.count > 1 ? "s" : ""}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatPrice(item.amount)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[400px]">
            <div className="text-center">
              <HugeiconsIcon
                icon={PieChartIcon}
                className="h-12 w-12 text-muted-foreground mx-auto mb-4"
              />
              <p className="text-muted-foreground mb-4">
                Aucune donnée de paiement disponible
              </p>
              <Button variant="outline" onClick={() => refetch()}>
                Actualiser
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
