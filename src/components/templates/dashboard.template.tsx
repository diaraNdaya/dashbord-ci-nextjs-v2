"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoriesSection } from "@/components/organisms/CategoriesSection";
import { DashboardKpiRow } from "@/components/organisms/DashboardKpiRow";
import { RecentOrdersSection } from "@/components/organisms/RecentOrdersSection";
import { SalesSection } from "@/components/organisms/SalesSection";
import { TopProductsSection } from "@/components/organisms/TopProductsSection";
import { TopSellersSection } from "@/components/organisms/TopSellersSection";
import { UsersEvolutionSection } from "@/components/organisms/UsersEvolutionSection";
import { FilterPeriodSelect } from "@/components/molecules/FilterPeriodSelect";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

const getToday = () => new Date().toISOString().slice(0, 10);

export default function DashBoardTemplate() {
  const queryClient = useQueryClient();
  const [period, setPeriod] = useState("month");
  const [date, setDate] = useState(getToday());

  const { year, month } = useMemo(() => {
    const d = date ? new Date(date) : new Date();
    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
    };
  }, [date]);

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    await queryClient.invalidateQueries({ queryKey: ["orders"] });
  };

  return (
    <motion.div
      className="flex flex-1 flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className="@container/main flex flex-1 flex-col gap-6 p-4 lg:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Admin</h1>
            <p className="text-muted-foreground">
              Vue globale des performances, ventes et activite.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <FilterPeriodSelect value={period} onChange={setPeriod} />
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-40"
            />
            <Button
              onClick={handleRefresh}
              className="bg-violet-vif hover:bg-violet-vif/90"
            >
              Refresh Data
            </Button>
          </div>
        </div>

        <DashboardKpiRow />

        <div className="grid gap-6 xl:grid-cols-2">
          <SalesSection
            period={period}
            date={date}
            onPeriodChange={setPeriod}
            onDateChange={setDate}
          />
          <CategoriesSection year={year} month={month} />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <UsersEvolutionSection year={year} month={month} />
          <RecentOrdersSection />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <TopSellersSection period={period} date={date} />
          <TopProductsSection period={period} date={date} />
        </div>
      </div>
    </motion.div>
  );
}
