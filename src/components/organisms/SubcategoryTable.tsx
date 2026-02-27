"use client";

import { LoadingSkeleton } from "@/components/atoms/LoadingSkeleton";
import { CategoryEmptyState } from "@/components/molecules/CategoryEmptyState";
import { SearchInput } from "@/components/molecules/SearchInput";
import { SubcategoryTableRow } from "@/components/molecules/SubcategoryTableRow";
import TablePagination from "@/components/molecules/TablePagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Subcategory } from "@/lib/types/categories.types";

interface SubcategoryTableProps {
  subcategories: Subcategory[];
  isLoading: boolean;
  totalItems: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onView: (subcategory: Subcategory) => void;
  onEdit: (subcategory: Subcategory) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  deletingId?: string;
  title?: string;
  description?: string;
}

export function SubcategoryTable({
  subcategories,
  isLoading,
  totalItems,
  page,
  limit,
  onPageChange,
  onLimitChange,
  onView,
  onEdit,
  onDelete,
  onCreate,
  onSearch,
  searchPlaceholder = "Rechercher...",
  deletingId,
  title = "Liste des sous-catégories",
  description = "Gérer vos sous-catégories de produits",
}: SubcategoryTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Barre de recherche */}
        {onSearch && (
          <div className="mb-4">
            <SearchInput
              placeholder={searchPlaceholder}
              onSearch={onSearch}
              className="max-w-sm"
            />
          </div>
        )}

        {isLoading ? (
          <LoadingSkeleton rows={5} />
        ) : subcategories.length === 0 ? (
          <CategoryEmptyState
            onCreateClick={onCreate}
            title="Aucune sous-catégorie"
            description="Commencez par créer votre première sous-catégorie"
            buttonText="Créer une sous-catégorie"
          />
        ) : (
          <div className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subcategories.map((subcategory: Subcategory) => (
                    <SubcategoryTableRow
                      key={subcategory.id}
                      subcategory={subcategory}
                      onView={onView}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      isDeleting={deletingId === subcategory.id}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
            <TablePagination
              page={page}
              limit={limit}
              totalItems={totalItems}
              onPageChange={onPageChange}
              onLimitChange={(newLimit) => {
                onLimitChange(newLimit);
                onPageChange(1);
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
