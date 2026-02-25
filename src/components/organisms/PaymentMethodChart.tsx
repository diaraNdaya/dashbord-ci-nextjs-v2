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

// Couleurs pour les méthodes de paiement
const colorByMethod: Record<string, string> = {
  mobile_money: "var(--violet-vif)",
  card: "var(--vert-menthe)",
  cash: "var(--jaune-orange)",
  bank_transfer: "var(--bleu-doux)",
};

export function PaymentMethodChart({ className }: PaymentMethodChartProps) {
  const [period, setPeriod] = useState("month");
  const [date, setDate] = useState(getToday());
  const [page] = useState(1);
  const [limit] = useState(1000); // Grande limite pour avoir toutes les transactions

  const {
    data: transactionsData,
    isLoading,
    error,
    refetch,
  } = useQuery(getTransactionsQueryOptions(period, date, page, limit));

  // Analyser les méthodes de paiement
  const paymentAnalysis = useMemo(() => {
    const transactions = transactionsData?.data || [];

    console.log("transactions", transactionsData);

    if (!Array.isArray(transactions) || transactions.length === 0) {
      return {
        data: [],
        totalTransactions: 0,
        totalAmount: 0,
      };
    }

    const methodGroups: Record<string, { count: number; amount: number }> = {};
    let totalAmount = 0;

    transactions.forEach((transaction: any) => {
      const method = transaction.payment_method || transaction.method || "card";
      const amount = Number(transaction.amount || 0);

      if (!methodGroups[method]) {
        methodGroups[method] = { count: 0, amount: 0 };
      }

      methodGroups[method].count += 1;
      methodGroups[method].amount += amount;
      totalAmount += amount;
    });

    // Convertir en array avec pourcentages
    const data = Object.entries(methodGroups).map(([method, stats]) => ({
      method,
      count: stats.count,
      amount: stats.amount,
      percentage: (stats.count / transactions.length) * 100,
      color: colorByMethod[method] || colorByMethod.card,
    }));

    return {
      data,
      totalTransactions: transactions.length,
      totalAmount,
    };
  }, [transactionsData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

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
        return "Virement";
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

  // Vérifier s'il n'y a qu'une seule méthode
  const nonZeroMethods = paymentAnalysis.data.filter((d) => d.count > 0);
  const onlyOneMethod = nonZeroMethods.length === 1;

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

          {/* Filtres */}
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
              className="bg-gradient-to-r from-bleu-doux/10 to-bleu-doux/20 p-4 rounded-lg border border-bleu-doux/20"
            >
              <p className="text-sm font-medium text-bleu-doux">
                Total des transactions
              </p>
              <p className="text-2xl font-bold text-bleu-doux">
                {paymentAnalysis.totalTransactions.toLocaleString("fr-FR")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-gradient-to-r from-vert-menthe/10 to-vert-menthe/20 p-4 rounded-lg border border-vert-menthe/20"
            >
              <p className="text-sm font-medium text-vert-menthe">
                Montant total
              </p>
              <p className="text-2xl font-bold text-vert-menthe">
                {formatCurrency(paymentAnalysis.totalAmount)}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-gradient-to-r from-violet-vif/10 to-violet-vif/20 p-4 rounded-lg border border-violet-vif/20"
            >
              <p className="text-sm font-medium text-violet-vif">
                Méthodes utilisées
              </p>
              <p className="text-2xl font-bold text-violet-vif">
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
            {/* Graphique en donut simple */}
            <div className="flex items-center justify-center">
              <div className="relative w-80 h-80">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {paymentAnalysis.data.map((item, index) => {
                    const total = paymentAnalysis.data.reduce(
                      (sum, d) => sum + d.count,
                      0,
                    );
                    const percentage = (item.count / total) * 100;
                    const angle = (percentage / 100) * 360;

                    // Calculer les positions pour le segment
                    const startAngle = paymentAnalysis.data
                      .slice(0, index)
                      .reduce((sum, d) => sum + (d.count / total) * 360, 0);

                    const endAngle = startAngle + angle;
                    const largeArcFlag = angle > 180 ? 1 : 0;

                    const startX =
                      100 + 60 * Math.cos(((startAngle - 90) * Math.PI) / 180);
                    const startY =
                      100 + 60 * Math.sin(((startAngle - 90) * Math.PI) / 180);
                    const endX =
                      100 + 60 * Math.cos(((endAngle - 90) * Math.PI) / 180);
                    const endY =
                      100 + 60 * Math.sin(((endAngle - 90) * Math.PI) / 180);

                    const innerStartX =
                      100 + 30 * Math.cos(((startAngle - 90) * Math.PI) / 180);
                    const innerStartY =
                      100 + 30 * Math.sin(((startAngle - 90) * Math.PI) / 180);
                    const innerEndX =
                      100 + 30 * Math.cos(((endAngle - 90) * Math.PI) / 180);
                    const innerEndY =
                      100 + 30 * Math.sin(((endAngle - 90) * Math.PI) / 180);

                    const pathData = [
                      `M ${startX} ${startY}`,
                      `A 60 60 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                      `L ${innerEndX} ${innerEndY}`,
                      `A 30 30 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}`,
                      "Z",
                    ].join(" ");

                    return (
                      <motion.path
                        key={item.method}
                        d={pathData}
                        fill={item.color}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="hover:opacity-80 cursor-pointer"
                        style={{
                          filter: onlyOneMethod
                            ? "none"
                            : `drop-shadow(0 0 ${index === 0 ? "8px" : "4px"} rgba(0,0,0,0.1))`,
                        }}
                      />
                    );
                  })}

                  {/* Centre du donut */}
                  <circle
                    cx="100"
                    cy="100"
                    r="25"
                    fill="var(--background)"
                    stroke="var(--border)"
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
                      {formatCurrency(item.amount)}
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
