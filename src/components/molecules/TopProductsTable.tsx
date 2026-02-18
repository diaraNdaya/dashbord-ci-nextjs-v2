"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/lib/types/products.types";
import { ViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";
import Image from "next/image";

interface TopProductsTableProps {
  products: Product[];
  onViewProduct: (productId: string) => void;
  isLoading?: boolean;
}

export function TopProductsTable({
  products,
  onViewProduct,
  isLoading = false,
}: TopProductsTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg border"
              >
                <div className="w-8 h-8 bg-muted animate-pulse rounded-full" />
                <div className="w-10 h-10 bg-muted animate-pulse rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded" />
                  <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (product: Product) => {
    if (product.stockQuantity === 0) {
      return (
        <Badge
          variant="destructive"
          className="bg-red-50 text-red-700 border-red-200 text-xs"
        >
          Out of Stock
        </Badge>
      );
    }
    if (product.stockQuantity <= 10) {
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs"
        >
          Low Stock
        </Badge>
      );
    }
    return (
      <Badge
        variant="default"
        className="bg-green-50 text-green-700 border-green-200 text-xs"
      >
        Published
      </Badge>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🏆 Top Products
            <Badge variant="secondary" className="ml-auto">
              {products.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No top products found
            </div>
          ) : (
            <div className="space-y-3">
              {products.slice(0, 10).map((product, index) => {
                const primaryImage =
                  product.ProductImage?.find((img) => img.isPrimary)
                    ?.imageUrl ||
                  product.ProductImage?.[0]?.imageUrl ||
                  "/images/placeholder-product.jpg";

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-vif text-white text-xs font-bold">
                      {index + 1}
                    </div>

                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={primaryImage}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="font-medium text-sm line-clamp-1">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>${product.price?.toLocaleString() || 0}</span>
                        <span>•</span>
                        <span>{product.categories?.name || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(product)}
                        <span className="text-xs text-muted-foreground">
                          Stock: {product.stockQuantity}
                        </span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onViewProduct(product.id)}
                      className="h-8 w-8 p-0"
                    >
                      <HugeiconsIcon icon={ViewIcon} className="h-4 w-4" />
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
