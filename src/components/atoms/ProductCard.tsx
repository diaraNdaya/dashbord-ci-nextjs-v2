"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/lib/types/products.types";
import { Delete02Icon, ViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  onView: (productId: string) => void;
  onDelete: (productId: string) => void;
  index?: number;
}

export function ProductCard({
  product,
  onView,
  onDelete,
  index = 0,
}: ProductCardProps) {
  const primaryImage =
    product.ProductImage?.find((img) => img.isPrimary)?.imageUrl ||
    product.ProductImage?.[0]?.imageUrl ||
    "/images/placeholder-product.jpg";

  const isInStock = product.stockQuantity > 0;
  const isLowStock = product.stockQuantity <= 10 && product.stockQuantity > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            {!isInStock && (
              <Badge variant="destructive" className="text-xs">
                Rupture
              </Badge>
            )}
            {isLowStock && (
              <Badge
                variant="outline"
                className="text-xs bg-orange-50 text-orange-700 border-orange-200"
              >
                Stock faible
              </Badge>
            )}
            {product.reduce > 0 && (
              <Badge className="text-xs bg-vert-menthe text-white">
                -{product.reduce}%
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-sm line-clamp-2 flex-1">
                {product.name}
              </h3>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-lg font-bold text-violet-vif">
                  {product.price?.toLocaleString()} {product.currency}
                </p>
                <p className="text-xs text-muted-foreground">
                  Stock: {product.stockQuantity}
                </p>
              </div>

              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onView(product.id)}
                  className="h-8 w-8 p-0"
                >
                  <HugeiconsIcon icon={ViewIcon} className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(product.id)}
                  className="h-8 w-8 p-0 text-rouge-vif hover:text-rouge-vif"
                >
                  <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{product.categories?.name}</span>
              {product.seller && (
                <>
                  <span>•</span>
                  <span>{product.seller.store_name}</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
