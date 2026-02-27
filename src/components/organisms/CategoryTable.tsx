"use client";

import { LoadingSkeleton } from "@/components/atoms/LoadingSkeleton";
import { CategoryEmptyState } from "@/components/molecules/CategoryEmptyState";
import { CategoryTableRow } from "@/components/molecules/CategoryTableRow";
import { SearchInput } from "@/components/molecules/SearchInput";
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
import type { Category } from "@/lib/types/categories.types";

interface CategoryTableProps {
  categories: Category[];
  isLoading: boolean;
  totalItems: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onView: (category: Category) => void;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  deletingId?: string;
  title?: string;
  description?: string;
}

export function CategoryTable({
  categories,
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
  title = "Liste des catégories",
  description = "Gérer vos catégories de produits",
}: CategoryTableProps) {
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
        ) : categories.length === 0 ? (
          <CategoryEmptyState onCreateClick={onCreate} />
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
                    <TableHead>Produits</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category: Category) => (
                    <CategoryTableRow
                      key={category.id}
                      category={category}
                      onView={onView}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      isDeleting={deletingId === category.id}
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
