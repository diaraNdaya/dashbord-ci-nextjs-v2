"use client";

import { ProductCard } from "@/components/atoms/ProductCard";
import type { Product } from "@/lib/types/products.types";
import { motion } from "motion/react";

interface ProductsGridProps {
  products: Product[];
  onViewProduct: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  isLoading?: boolean;
}

export function ProductsGrid({
  products,
  onViewProduct,
  onDeleteProduct,
  isLoading = false,
}: ProductsGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="aspect-[3/4] bg-muted animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <div className="text-muted-foreground text-lg mb-2">
          Aucun produit trouvé
        </div>
        <p className="text-sm text-muted-foreground">
          Essayez de modifier vos critères de recherche
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          onView={onViewProduct}
          onDelete={onDeleteProduct}
          index={index}
        />
      ))}
    </div>
  );
}
