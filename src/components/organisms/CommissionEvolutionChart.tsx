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
import { getCommissionEvolutionQueryOptions } from "@/services/queries/commission.queries";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  Calendar03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

const getToday = () => new Date().toISOString().slice(0, 10);

interface CommissionEvolutionChartProps {
  className?: string;
}

export function CommissionEvolutionChart({
  className,
}: CommissionEvolutionChartProps) {
  const [period, setPeriod] = useState("month");
  const [date, setDate] = useState(getToday());

  const {
    data: evolutionData,
    isLoading,
    error,
    refetch,
  } = useQuery(getCommissionEvolutionQueryOptions(period, date));

  const chartData = useMemo(() => {
    if (
      !evolutionData ||
      !(evolutionData as any)?.success ||
      !(evolutionData as any)?.data
    ) {
      return [];
    }

    const responseData = (evolutionData as any).data;

    // Handle both single object and array responses
    const dataArray = Array.isArray(responseData)
      ? responseData
      : [responseData];

    return dataArray.map((item: any) => ({
      period: item.date || item.period,
      total: Number(item.commission || item.total || 0),
      transactions: Number(item.transactions || 0),
    }));
  }, [evolutionData]);

  const stats = useMemo(() => {
    const totalCommissions = chartData.reduce(
      (sum, item) => sum + item.total,
      0,
    );
    const totalTransactions = chartData.reduce(
      (sum, item) => sum + item.transactions,
      0,
    );
    const avgCommission =
      chartData.length > 0 ? totalCommissions / chartData.length : 0;

    // Calculate trend (last 7 vs previous 7 periods)
    const recentData = chartData.slice(-7);
    const previousData = chartData.slice(-14, -7);

    const recentTotal = recentData.reduce((sum, item) => sum + item.total, 0);
    const previousTotal = previousData.reduce(
      (sum, item) => sum + item.total,
      0,
    );

    const trendPercentage =
      previousTotal > 0
        ? ((recentTotal - previousTotal) / previousTotal) * 100
        : 0;

    return {
      totalCommissions,
      totalTransactions,
      avgCommission,
      trendPercentage,
    };
  }, [chartData]);

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
              Évolution des Commissions
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Analyse des commissions sur la période sélectionnée -{" "}
              {getPeriodLabel(period).toLowerCase()}
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
                Commission Totale
              </p>
              <p className="text-2xl font-bold text-bleu-doux">
                {formatCurrency(stats.totalCommissions)}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-gradient-to-r from-vert-menthe/10 to-vert-menthe/20 p-4 rounded-lg border border-vert-menthe/20"
            >
              <p className="text-sm font-medium text-vert-menthe">
                Transactions
              </p>
              <p className="text-2xl font-bold text-vert-menthe">
                {stats.totalTransactions.toLocaleString()}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-gradient-to-r from-violet-vif/10 to-violet-vif/20 p-4 rounded-lg border border-violet-vif/20"
            >
              <p className="text-sm font-medium text-violet-vif">
                Commission Moyenne
              </p>
              <p className="text-2xl font-bold text-violet-vif">
                {formatCurrency(stats.avgCommission)}
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
        ) : chartData.length > 0 ? (
          <div className="space-y-6">
            <div className="h-[300px] sm:h-[400px] w-full">
              <div className="flex h-full items-end gap-1 rounded-md border p-4">
                {chartData.slice(0, 12).map((item, idx) => {
                  const maxCommission = Math.max(
                    1,
                    ...chartData.map((d) => d.total),
                  );
                  const height = Math.max(
                    8,
                    Math.round((item.total / maxCommission) * 100),
                  );

                  return (
                    <motion.div
                      key={`${item.period}-${idx}`}
                      className="flex-1 flex flex-col items-center gap-2"
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                    >
                      <div
                        className="w-full rounded-t bg-gradient-to-t from-vert-menthe to-vert-menthe/70 hover:from-vert-menthe/90 hover:to-vert-menthe/50 transition-colors cursor-pointer"
                        style={{ height: `${height}%` }}
                        title={`${item.period}: ${formatCurrency(item.total)}`}
                      />
                      <span className="text-xs text-muted-foreground rotate-45 origin-left">
                        {item.period}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm">
              <div className="flex items-center gap-2">
                {stats.trendPercentage >= 0 ? (
                  <>
                    <HugeiconsIcon
                      icon={ArrowUp01Icon}
                      className="h-4 w-4 text-vert-menthe"
                    />
                    <span className="text-vert-menthe font-medium">
                      Tendance à la hausse de{" "}
                      {Math.abs(stats.trendPercentage).toFixed(1)}%
                    </span>
                  </>
                ) : (
                  <>
                    <HugeiconsIcon
                      icon={ArrowDown01Icon}
                      className="h-4 w-4 text-rouge-vif"
                    />
                    <span className="text-rouge-vif font-medium">
                      Tendance à la baisse de{" "}
                      {Math.abs(stats.trendPercentage).toFixed(1)}%
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="text-center text-xs text-muted-foreground">
              Évolution des commissions sur la période sélectionnée
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[400px]">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Aucune donnée d&apos;évolution disponible
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
