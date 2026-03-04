import { BannerEmptyState } from "@/components/molecules/BannerEmptyState";
import { BannerTableRow } from "@/components/molecules/BannerTableRow";
import { SearchInput } from "@/components/molecules/SearchInput";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Banner } from "@/lib/types/banner.types";
import { motion } from "motion/react";

interface BannerTableProps {
  banners: Banner[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onView: (banner: Banner) => void;
  onEdit: (banner: Banner) => void;
  onDelete: (banner: Banner) => void;
  onCreateClick: () => void;
  isDeleting: boolean;
  // Pagination
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function BannerTable({
  banners,
  searchTerm,
  onSearchChange,
  onView,
  onEdit,
  onDelete,
  onCreateClick,
  isDeleting,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: BannerTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Liste des Bannières</CardTitle>
              <CardDescription>
                Gérer vos bannières publicitaires
              </CardDescription>
            </div>
            <div className="w-72">
              <SearchInput
                placeholder="Rechercher par description..."
                value={searchTerm}
                onChange={onSearchChange}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {banners.length > 0 ? (
            <div className="space-y-4">
              {banners.map((banner: Banner, index: number) => (
                <BannerTableRow
                  key={banner.id}
                  banner={banner}
                  index={index}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isDeleting={isDeleting}
                />
              ))}
            </div>
          ) : (
            <BannerEmptyState
              searchTerm={searchTerm}
              onCreateClick={onCreateClick}
            />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} sur {totalPages} ({totalItems} banners)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onPageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
