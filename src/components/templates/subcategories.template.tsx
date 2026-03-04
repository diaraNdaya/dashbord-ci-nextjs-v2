"use client";

import { LoadingSkeleton } from "@/components/atoms/LoadingSkeleton";
import { CategoryStatsCards } from "@/components/molecules/CategoryStatsCards";
import { PageHeader } from "@/components/molecules/PageHeader";
import CreateAndUpdateSubcategoryForm from "@/components/organisms/create-and-update-subcategory-form";
import { SubcategoryTable } from "@/components/organisms/SubcategoryTable";
import { SubcategoryViewDialog } from "@/components/organisms/SubcategoryViewDialog";
import { useConfirm } from "@/hooks/useConfirm";
import type {
  Subcategory,
  SubcategorySearchParams,
} from "@/lib/types/categories.types";
import {
  deleteSubCategoryMutationOptions,
  getAllSubCategoriesQueryOptions,
} from "@/services/queries/categories.queries";
import { Folder01Icon } from "@hugeicons/core-free-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useState } from "react";
import { toastErr, toastSuccess } from "../molecules/ToastCard";

export default function SubcategoriesTemplate() {
  const queryClient = useQueryClient();
  const { confirm, ConfirmDialog } = useConfirm();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchParams, setSearchParams] = useState<SubcategorySearchParams>({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] =
    useState<Subcategory | null>(null);
  const [viewingSubcategory, setViewingSubcategory] =
    useState<Subcategory | null>(null);

  const { data: subcategoriesData, isLoading } = useQuery(
    getAllSubCategoriesQueryOptions(page, limit, searchParams),
  );

  const deleteMutation = useMutation({
    ...deleteSubCategoryMutationOptions(),
    onSuccess: (data: unknown) => {
      if (
        data &&
        typeof data === "object" &&
        "success" in data &&
        data.success
      ) {
        toastSuccess("Sous-catégorie supprimée avec succès");
        queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      }
    },
    onError: (error: Error) => {
      toastErr(error.message || "Erreur lors de la suppression");
    },
  });

  const handleCreate = () => {
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: "Supprimer la sous-catégorie",
      description:
        "Êtes-vous sûr de vouloir supprimer cette sous-catégorie ? Cette action est irréversible.",
      confirmText: "Supprimer",
      variant: "destructive",
    });

    if (confirmed) {
      deleteMutation.mutate({ id });
    }
  };

  const handleView = (subcategory: Subcategory) => {
    setViewingSubcategory(subcategory);
  };

  const handleCloseForm = () => {
    setIsCreateDialogOpen(false);
    setEditingSubcategory(null);
  };

  const handleCloseView = () => {
    setViewingSubcategory(null);
  };

  const handleFormSuccess = () => {};

  const handleSearch = (query: string) => {
    setSearchParams({ search: query.trim() || undefined });
    setPage(1);
  };

  const subcategories =
    subcategoriesData &&
    typeof subcategoriesData === "object" &&
    "data" in subcategoriesData
      ? subcategoriesData.data
      : [];
  const totalItems =
    subcategoriesData &&
    typeof subcategoriesData === "object" &&
    "totalItems" in subcategoriesData
      ? subcategoriesData.totalItems
      : 0;

  // Pour les subcategories, on n'a pas de productCount, donc on utilise d'autres métriques
  const totalCategories = new Set(
    subcategories.map((sub: Subcategory) => sub.category_id),
  ).size;
  const averagePerCategory =
    totalCategories > 0 ? Math.round(totalItems / totalCategories) : 0;

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
          title="Sous-catégories"
          description="Gérer les sous-catégories de produits"
          buttonText="Nouvelle sous-catégorie"
          onButtonClick={handleCreate}
          emoji="📂"
        />

        {isLoading ? (
          <LoadingSkeleton rows={1} />
        ) : (
          <CategoryStatsCards
            totalCategories={totalItems}
            totalProducts={totalCategories}
            averagePerCategory={averagePerCategory}
          />
        )}

        <SubcategoryTable
          subcategories={subcategories}
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
          searchPlaceholder="Rechercher une sous-catégorie..."
          deletingId={deleteMutation.isPending ? undefined : undefined}
        />
      </div>

      {/* Formulaire de création/modification */}
      {(isCreateDialogOpen || editingSubcategory) && (
        <CreateAndUpdateSubcategoryForm
          subcategory={editingSubcategory}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Dialog de visualisation */}
      <SubcategoryViewDialog
        subcategory={viewingSubcategory}
        isOpen={!!viewingSubcategory}
        onClose={handleCloseView}
      />
      <ConfirmDialog />
    </motion.div>
  );
}
