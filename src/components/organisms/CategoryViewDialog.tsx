"use client";

import { SafeImage } from "@/components/atoms/SafeImage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Category } from "@/lib/types/categories.types";
import { Image01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface CategoryViewDialogProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CategoryViewDialog({
  category,
  isOpen,
  onClose,
}: CategoryViewDialogProps) {
  if (!category) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails de la catégorie</DialogTitle>
          <DialogDescription>
            Informations complètes de la catégorie
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="font-semibold text-xl mb-4">
                  Informations générales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground font-medium">
                        Nom:
                      </span>
                      <span className="font-semibold">{category.name}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground font-medium">
                        Type:
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                        {category.type}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground font-medium">
                        Produits:
                      </span>
                      <span className="font-semibold text-lg">
                        {category.productCount || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground font-medium">
                        Créé le:
                      </span>
                      <span className="font-medium">
                        {new Date(category.createdAt).toLocaleDateString(
                          "fr-FR",
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                {category.url && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">
                        URL:
                      </span>
                      <a
                        href={category.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Lien externe
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-xl mb-4">Description</h3>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <h3 className="font-semibold text-xl mb-4">Images</h3>
              {category.images && category.images.length > 0 ? (
                <div className="space-y-4">
                  {/* Image principale */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Image principale
                    </p>
                    <div className="aspect-square rounded-lg overflow-hidden border-2 border-violet-vif/20">
                      <SafeImage
                        src={category.images[0]}
                        alt={`${category.name} - Image principale`}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                        fallbackClassName="aspect-square rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Images supplémentaires */}
                  {category.images.length > 1 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Images supplémentaires ({category.images.length - 1})
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {category.images.slice(1).map((imageUrl, index) => (
                          <div
                            key={index}
                            className="aspect-square rounded-lg overflow-hidden border"
                          >
                            <SafeImage
                              src={imageUrl}
                              alt={`${category.name} - Image ${index + 2}`}
                              width={150}
                              height={150}
                              className="w-full h-full object-cover"
                              fallbackClassName="aspect-square rounded-lg"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg bg-muted/50">
                  <div className="text-center">
                    <HugeiconsIcon
                      icon={Image01Icon}
                      className="h-12 w-12 text-muted-foreground mx-auto mb-3"
                    />
                    <p className="text-sm text-muted-foreground font-medium">
                      Aucune image
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
