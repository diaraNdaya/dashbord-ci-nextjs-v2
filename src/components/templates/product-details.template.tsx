"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { LoadingSpinner } from "@/components/atoms";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getOneProductQueryOptions } from "@/services/queries/products.queries";
import {
  ArrowLeft01Icon,
  Delete02Icon,
  Edit02Icon,
  Package01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface ProductDetailsTemplateProps {
  productId: string;
}

export default function ProductDetailsTemplate({
  productId,
}: ProductDetailsTemplateProps) {
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const {
    data: productData,
    isLoading,
    error,
  } = useQuery(getOneProductQueryOptions(productId));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !productData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-muted-foreground">
          Erreur lors du chargement du produit
        </div>
      </div>
    );
  }

  console.log("Details", productData);
  // The query now returns the product directly
  const product = productData;

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-muted-foreground">
          Produit non trouvé
        </div>
      </div>
    );
  }

  const images = product.ProductImage || [];
  const primaryImage =
    images.find((img: { isPrimary: boolean }) => img.isPrimary) || images[0];
  const isInStock = product.stockQuantity > 0;
  const isLowStock = product.stockQuantity <= 10 && product.stockQuantity > 0;

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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="h-8 w-8 p-0"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" />
            </Button>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-vif/10 dark:bg-violet-vif/5">
              <HugeiconsIcon
                icon={Package01Icon}
                className="h-6 w-6 text-violet-vif"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Détails du produit</h1>
              <p className="text-muted-foreground">
                Informations complètes du produit
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <HugeiconsIcon icon={Edit02Icon} className="h-4 w-4 mr-2" />
              Modifier
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-rouge-vif hover:text-rouge-vif"
            >
              <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </motion.div>

        {/* Product Details */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    {images.length > 0 ? (
                      <Image
                        src={
                          images[selectedImageIndex]?.imageUrl ||
                          primaryImage?.imageUrl
                        }
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        Aucune image
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Images */}
                  {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {images.map(
                        (
                          image: { id: string; imageUrl: string },
                          index: number,
                        ) => (
                          <button
                            key={image.id}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                              selectedImageIndex === index
                                ? "border-violet-vif"
                                : "border-transparent"
                            }`}
                          >
                            <Image
                              src={image.imageUrl}
                              alt={`${product.name} ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </button>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl">{product.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      {!isInStock && (
                        <Badge variant="destructive">Rupture de stock</Badge>
                      )}
                      {isLowStock && (
                        <Badge
                          variant="outline"
                          className="bg-orange-50 text-orange-700 border-orange-200"
                        >
                          Stock faible
                        </Badge>
                      )}
                      {product.reduce > 0 && (
                        <Badge className="bg-vert-menthe text-white">
                          -{product.reduce}% de réduction
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-violet-vif">
                      {product.price?.toLocaleString()} {product.currency}
                    </div>
                    {product.Reviews && product.Reviews.length > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <HugeiconsIcon
                          icon={Package01Icon}
                          className="h-4 w-4 text-yellow-500"
                        />
                        <span className="text-sm">
                          {(
                            product.Reviews.reduce(
                              (acc: number, review: { rating: number }) =>
                                acc + review.rating,
                              0,
                            ) / product.Reviews.length
                          ).toFixed(1)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({product.Reviews.length} avis)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-muted-foreground">
                      {product.description || "Aucune description disponible"}
                    </p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Stock:</span>
                      <span className="ml-2">
                        {product.stockQuantity} unités
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Condition:</span>
                      <span className="ml-2">{product.condition}</span>
                    </div>
                    <div>
                      <span className="font-medium">Catégorie:</span>
                      <span className="ml-2">{product.categories?.name}</span>
                    </div>
                    <div>
                      <span className="font-medium">Vendeur:</span>
                      <span className="ml-2">{product.seller?.store_name}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Details */}
            <Card>
              <CardHeader>
                <CardTitle>Détails supplémentaires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {product.colors && product.colors.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Couleurs disponibles</h4>
                      <div className="flex gap-2 flex-wrap">
                        {product.colors.map((color: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {color}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.sizes && product.sizes.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Tailles disponibles</h4>
                      <div className="flex gap-2 flex-wrap">
                        {product.sizes.map((size: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {size}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.tag && (
                    <div>
                      <h4 className="font-medium mb-2">Tags</h4>
                      <Badge variant="secondary">{product.tag}</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
