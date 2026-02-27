"use client";

import { SafeImage } from "@/components/atoms/SafeImage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Subcategory } from "@/lib/types/categories.types";
import { Image01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface SubcategoryViewDialogProps {
  subcategory: Subcategory | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SubcategoryViewDialog({
  subcategory,
  isOpen,
  onClose,
}: SubcategoryViewDialogProps) {
  if (!subcategory) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="w-[95%] 
    sm:max-w-lg 
    md:max-w-2xl 
    lg:max-w-4xl overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Détails de la sous-catégorie</DialogTitle>
          <DialogDescription>
            Informations complètes de la sous-catégorie
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
                      <span className="font-semibold">{subcategory.name}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground font-medium">
                        Type:
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        {subcategory.type}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground font-medium">
                        Catégorie parent:
                      </span>
                      <span className="font-semibold text-lg">
                        {subcategory.category?.name || "Non définie"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground font-medium">
                        Créé le:
                      </span>
                      <span className="font-medium">
                        {new Date(subcategory.createdAt).toLocaleDateString(
                          "fr-FR",
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-xl mb-4">Description</h3>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm leading-relaxed">
                    {subcategory.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <h3 className="font-semibold text-xl mb-4">Image</h3>
              {subcategory.url ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Image de la sous-catégorie
                    </p>
                    <div className="aspect-square rounded-lg overflow-hidden border-2 border-violet-vif/20">
                      <SafeImage
                        src={subcategory.url}
                        alt={`${subcategory.name} - Image`}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                        fallbackClassName="aspect-square rounded-lg"
                      />
                    </div>
                  </div>
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
