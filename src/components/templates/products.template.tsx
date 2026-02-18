"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { ProductStatsCard } from "@/components/atoms/ProductStatsCard";
import { ProductsDataTable } from "@/components/molecules/ProductsDataTable";
import TablePagination from "@/components/molecules/TablePagination";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Alert02Icon,
  ArrowUp01Icon,
  Menu01Icon,
  Package01Icon,
  Search01Icon,
  ShoppingCart01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { Product } from "@/lib/types/products.types";
import {
  deleteProductMutationOptions,
  getAllProductsQueryOptions,
  getTopProductsQueryOptions,
} from "@/services/queries/products.queries";

export default function ProductsTemplate() {
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"all" | "top">("all"); // New state for switching between all and top products
  const queryClient = useQueryClient();
  const router = useRouter();

  // Queries
  const { data: productsData, isLoading: isLoadingProducts } = useQuery(
    getAllProductsQueryOptions(page, limit),
  );

  const { data: topProductsData, isLoading: isLoadingTopProducts } = useQuery(
    getTopProductsQueryOptions(),
  );

  // Mutations
  const deleteProductMutation = useMutation({
    ...deleteProductMutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error deleting product");
    },
  });

  const handleViewProduct = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(productId);
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
    setActiveTab(newTab);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleViewModeChange = (mode: "all" | "top") => {
    setViewMode(mode);
    setPage(1);
    setActiveTab("all"); // Reset tab when switching view mode
  };

  // Extract products array and pagination info
  const allProducts: Product[] = (() => {
    if (!productsData) return [];
    if (Array.isArray(productsData)) return productsData;
    if ("data" in productsData && Array.isArray(productsData.data)) {
      return productsData.data;
    }
    return [];
  })();

  const topProducts: Product[] = (() => {
    if (!topProductsData) return [];
    if (Array.isArray(topProductsData)) return topProductsData;
    if ("data" in topProductsData && Array.isArray(topProductsData.data)) {
      return topProductsData.data;
    }
    return [];
  })();

  // Use the appropriate data based on view mode
  const currentProducts = viewMode === "top" ? topProducts : allProducts;

  const currentTotalItems = (() => {
    const sourceData = viewMode === "top" ? topProductsData : productsData;
    if (!sourceData) return 0;
    if (
      "totalItems" in sourceData &&
      typeof sourceData.totalItems === "number"
    ) {
      return sourceData.totalItems;
    }
    return currentProducts.length;
  })();

  // Filter products based on search and tab
  const filteredProducts = currentProducts.filter((product) => {
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.categories?.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      product.seller?.store_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "in-stock" && product.stockQuantity > 0) ||
      (activeTab === "out-of-stock" && product.stockQuantity === 0) ||
      (activeTab === "low-stock" &&
        product.stockQuantity <= 10 &&
        product.stockQuantity > 0);

    return matchesSearch && matchesTab;
  });

  // Calculate stats - using the old stats format
  const stats = {
    total: allProducts.length,
    inStock: allProducts.filter((p) => p.stockQuantity > 0).length,
    outOfStock: allProducts.filter((p) => p.stockQuantity === 0).length,
    lowStock: allProducts.filter(
      (p) => p.stockQuantity <= 10 && p.stockQuantity > 0,
    ).length,
    categories: [
      ...new Set(allProducts.map((p) => p.categories?.name).filter(Boolean)),
    ].length,
    topProducts: topProducts.length, // Add top products count to stats
  };

  return (
    <motion.div
      className="flex flex-1 flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="@container/main flex flex-1 flex-col gap-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-vif/10 dark:bg-violet-vif/5">
              <HugeiconsIcon
                icon={Package01Icon}
                className="h-6 w-6 text-violet-vif"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Products 📦</h1>
              <p className="text-muted-foreground">
                Manage your product catalog
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            <ProductStatsCard
              title="Total produits"
              value={stats.total}
              subtitle="Dans le catalogue"
              trend="+12%"
              icon={Package01Icon}
              variant="default"
              index={0}
            />
            <ProductStatsCard
              title="En stock"
              value={stats.inStock}
              subtitle="Disponibles"
              trend="+8%"
              icon={ShoppingCart01Icon}
              variant="success"
              index={1}
            />
            <ProductStatsCard
              title="Rupture de stock"
              value={stats.outOfStock}
              subtitle="Indisponibles"
              icon={Alert02Icon}
              variant="danger"
              index={2}
            />
            <ProductStatsCard
              title="Stock faible"
              value={stats.lowStock}
              subtitle="≤ 10 unités"
              icon={ArrowUp01Icon}
              variant="warning"
              index={3}
            />
            <ProductStatsCard
              title="Catégories"
              value={stats.categories}
              subtitle="Différentes"
              icon={Menu01Icon}
              variant="default"
              index={4}
            />
            <ProductStatsCard
              title="Top Produits"
              value={stats.topProducts}
              subtitle="Populaires"
              trend="+5%"
              icon={Package01Icon}
              variant="success"
              index={5}
            />
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CardTitle>Catalogue des produits</CardTitle>
                  {/* View Mode Toggle Buttons */}
                  <div className="flex items-center gap-2 ml-6">
                    <Button
                      variant={viewMode === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleViewModeChange("all")}
                    >
                      Tous les produits
                    </Button>
                    <Button
                      variant={viewMode === "top" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleViewModeChange("top")}
                    >
                      Top produits
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="all-status">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-status">Status</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select defaultValue="all-categories">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-categories">Category</SelectItem>
                      <SelectItem value="clothes">Clothes</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="beauty">Beauty</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" size="sm">
                    <HugeiconsIcon icon={Menu01Icon} className="h-4 w-4 mr-2" />
                    Filter
                  </Button>

                  <div className="relative">
                    <HugeiconsIcon
                      icon={Search01Icon}
                      className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      placeholder="Search"
                      className="pl-9 w-64"
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                {viewMode === "all" ? (
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">Tous</TabsTrigger>
                    <TabsTrigger value="in-stock">En stock</TabsTrigger>
                    <TabsTrigger value="low-stock">Stock faible</TabsTrigger>
                    <TabsTrigger value="out-of-stock">Rupture</TabsTrigger>
                  </TabsList>
                ) : (
                  <TabsList className="grid w-full grid-cols-1">
                    <TabsTrigger value="all">Top Produits</TabsTrigger>
                  </TabsList>
                )}
                <TabsContent value={activeTab} className="mt-6 space-y-4">
                  {(
                    viewMode === "all"
                      ? isLoadingProducts
                      : isLoadingTopProducts
                  ) ? (
                    <div className="flex h-32 items-center justify-center">
                      <div className="text-muted-foreground">Chargement...</div>
                    </div>
                  ) : (
                    <>
                      <ProductsDataTable
                        data={filteredProducts}
                        onViewProduct={handleViewProduct}
                        onDeleteProduct={handleDeleteProduct}
                        searchQuery={searchQuery}
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
