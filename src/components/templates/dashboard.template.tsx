"use client";

import { FilterPeriodSelect } from "@/components/molecules/FilterPeriodSelect";
import { CategoriesSection } from "@/components/organisms/CategoriesSection";
import { DashboardKpiRow } from "@/components/organisms/DashboardKpiRow";
import { RecentOrdersSection } from "@/components/organisms/RecentOrdersSection";
import { SalesSection } from "@/components/organisms/SalesSection";
import { TopProductsSection } from "@/components/organisms/TopProductsSection";
import { TopSellersSection } from "@/components/organisms/TopSellersSection";
import { UsersEvolutionSection } from "@/components/organisms/UsersEvolutionSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChartIcon,
  PackageIcon,
  ShoppingBagIcon,
  TagIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

const getToday = () => new Date().toISOString().slice(0, 10);

export default function DashBoardTemplate() {
  const queryClient = useQueryClient();
  const [period, setPeriod] = useState("month");
  const [date, setDate] = useState(getToday());
  const [activeTab, setActiveTab] = useState("sales");

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
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytical Dashboard</h1>
            <p className="text-muted-foreground">
              Comprehensive analysis of your performance and sales data
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

        {/* KPI Row */}
        <DashboardKpiRow />

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-muted/50 p-1 h-12">
            <TabsTrigger
              value="sales"
              className="flex items-center gap-2 data-[state=active]:bg-jaune-orange data-[state=active]:text-white font-medium"
            >
              <HugeiconsIcon icon={BarChartIcon} className="h-4 w-4" />
              Sales
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="flex items-center gap-2 data-[state=active]:bg-violet-vif data-[state=active]:text-white font-medium"
            >
              <HugeiconsIcon icon={TagIcon} className="h-4 w-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="flex items-center gap-2 data-[state=active]:bg-vert-menthe data-[state=active]:text-white font-medium"
            >
              <HugeiconsIcon icon={UserIcon} className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger
              value="sellers"
              className="flex items-center gap-2 data-[state=active]:bg-rose-pastel data-[state=active]:text-white font-medium"
            >
              <HugeiconsIcon icon={ShoppingBagIcon} className="h-4 w-4" />
              Sellers
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="flex items-center gap-2 data-[state=active]:bg-bleu-doux data-[state=active]:text-white font-medium"
            >
              <HugeiconsIcon icon={PackageIcon} className="h-4 w-4" />
              Products
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <div className="mt-6">
            <TabsContent value="sales" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SalesSection
                  period={period}
                  date={date}
                  onPeriodChange={setPeriod}
                  onDateChange={setDate}
                />
              </motion.div>
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CategoriesSection year={year} month={month} />
              </motion.div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6 xl:grid-cols-1"
              >
                <UsersEvolutionSection year={year} month={month} />
                <RecentOrdersSection />
              </motion.div>
            </TabsContent>

            <TabsContent value="sellers" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TopSellersSection period={period} date={date} />
              </motion.div>
            </TabsContent>

            <TabsContent value="products" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TopProductsSection period={period} date={date} />
              </motion.div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </motion.div>
  );
}
