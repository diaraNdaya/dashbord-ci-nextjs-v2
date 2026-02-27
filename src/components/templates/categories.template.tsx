"use client";

import { LoadingSkeleton } from "@/components/atoms/LoadingSkeleton";
import { CategoryStatsCards } from "@/components/molecules/CategoryStatsCards";
import { PageHeader } from "@/components/molecules/PageHeader";
import { CategoryTable } from "@/components/organisms/CategoryTable";
import { CategoryViewDialog } from "@/components/organisms/CategoryViewDialog";
import CreateAndUpdateCategoryForm from "@/components/organisms/create-and-update-category-form";
import type {
  Category,
  CategorySearchParams,
} from "@/lib/types/categories.types";
import {
  deleteCategoryMutationOptions,
  getAllCategoriesQueryOptions,
} from "@/services/queries/categories.queries";
import { Folder01Icon } from "@hugeicons/core-free-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useState } from "react";
import { toastErr, toastSuccess } from "../molecules/ToastCard";

export default function CategoriesTemplate() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchParams, setSearchParams] = useState<CategorySearchParams>({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [viewingCategory, setViewingCategory] = useState<Category | null>(null);

  const { data: categoriesData, isLoading } = useQuery(
    getAllCategoriesQueryOptions(page, limit, searchParams),
  );

  const deleteMutation = useMutation({
    ...deleteCategoryMutationOptions(),
    onSuccess: (data: any) => {
      if (data.success) {
        toastSuccess("Catégorie supprimée avec succès");
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      }
    },
    onError: (error: any) => {
      toastErr(error.message || "Erreur lors de la suppression");
    },
  });

  const handleCreate = () => {
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleView = (category: Category) => {
    setViewingCategory(category);
  };

  const handleCloseForm = () => {
    setIsCreateDialogOpen(false);
    setEditingCategory(null);
  };

  const handleCloseView = () => {
    setViewingCategory(null);
  };

  const handleFormSuccess = () => {};

  const handleSearch = (query: string) => {
    setSearchParams({ search: query.trim() || undefined });
    setPage(1); // Reset to first page when searching
  };

  // Calculs des statistiques
  const categories = (categoriesData as any)?.success
    ? (categoriesData as any)?.data
    : [];
  const totalItems = (categoriesData as any)?.success
    ? (categoriesData as any)?.totalItems
    : 0;
  const totalProducts = categories.reduce(
    (sum: number, cat: Category) => sum + (cat.productCount || 0),
    0,
  );
  const averagePerCategory =
    totalItems > 0 ? Math.round(totalProducts / totalItems) : 0;

  return (
    <motion.div
      className="flex flex-1 flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="@container/main flex flex-1 flex-col gap-6 p-4 lg:p-6">
        <PageHeader
          icon={Folder01Icon}
          title="Catégories"
          description="Gérer les catégories de produits"
          buttonText="Nouvelle catégorie"
          onButtonClick={handleCreate}
          emoji="📁"
        />

        {isLoading ? (
          <LoadingSkeleton rows={1} />
        ) : (
          <CategoryStatsCards
            totalCategories={totalItems}
            totalProducts={totalProducts}
            averagePerCategory={averagePerCategory}
          />
        )}

        <CategoryTable
          categories={categories}
          isLoading={isLoading}
          totalItems={totalItems}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreate={handleCreate}
          onSearch={handleSearch}
          searchPlaceholder="Rechercher une catégorie..."
          deletingId={deleteMutation.isPending ? undefined : undefined}
        />
      </div>

      {/* Formulaire de création/modification */}
      {(isCreateDialogOpen || editingCategory) && (
        <CreateAndUpdateCategoryForm
          category={editingCategory}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Dialog de visualisation */}
      <CategoryViewDialog
        category={viewingCategory}
        isOpen={!!viewingCategory}
        onClose={handleCloseView}
      />
    </motion.div>
  );
}
