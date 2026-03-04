"use client";

import { ErrorMessage } from "@/components/atoms/ErrorMessage";
import { LoadingSkeleton } from "@/components/atoms/LoadingSkeleton";
import { BannerStatsCards } from "@/components/molecules/BannerStatsCards";
import { PageHeader } from "@/components/molecules/PageHeader";
import { toastErr, toastSuccess } from "@/components/molecules/ToastCard";
import { BannerCreateDialog } from "@/components/organisms/BannerCreateDialog";
import { BannerEditDialog } from "@/components/organisms/BannerEditDialog";
import { BannerTable } from "@/components/organisms/BannerTable";
import { BannerViewDialog } from "@/components/organisms/BannerViewDialog";
import { useConfirm } from "@/hooks/useConfirm";
import { bannerSchema, type BannerFormData } from "@/lib/schemas/banner.schema";
import type { Banner, CreateBannerCredential } from "@/lib/types/banner.types";
import type { BannerSearchParams } from "@/services/actions/banner.actions";
import {
  createBannerMutationOptions,
  deleteBannerMutationOptions,
  getAllBannersQueryOptions,
  updateBannerMutationOptions,
  uploadFileMutationOptions,
} from "@/services/queries/banner.queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image01Icon } from "@hugeicons/core-free-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

const isFile = (v: unknown): v is File =>
  typeof File !== "undefined" && v instanceof File;

export default function BannersTemplate() {
  const { confirmDelete, ConfirmDialog } = useConfirm();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const limit = 10;
  const queryClient = useQueryClient();

  // Paramètres de recherche
  const searchParams: BannerSearchParams | undefined = useMemo(() => {
    if (!searchTerm.trim()) return undefined;
    return {
      description: searchTerm,
    };
  }, [searchTerm]);

  // Query pour récupérer les banners
  const {
    data: bannersData,
    isLoading,
    error,
    refetch,
  } = useQuery(getAllBannersQueryOptions(currentPage, limit, searchParams));

  const uploadMutation = useMutation(uploadFileMutationOptions());

  const createMutation = useMutation({
    ...createBannerMutationOptions(),
    mutationFn: async (values: BannerFormData) => {
      let imageUrl = "";

      if (values.image && isFile(values.image)) {
        const uploadResponse = await uploadMutation.mutateAsync({
          file: values.image,
        });

        if (uploadResponse.success) {
          imageUrl = uploadResponse.url;
        } else {
          console.error("Failed to upload banner image:", uploadResponse);
          toastErr("Erreur lors de l'upload de l'image");
          return;
        }
      }

      const bannerData: CreateBannerCredential = {
        file_path: imageUrl,
        description: values.description.trim(),
        productLink: values.productLink?.trim() || "",
        provider: "BANNER",
      };

      return await createBannerMutationOptions().mutationFn(bannerData);
    },
    onSuccess: (data) => {
      toastSuccess("Banner créé avec succès");
      setIsCreateDialogOpen(false);
      createForm.reset();
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
    onError: (error: Error) => {
      toastErr(error.message || "Erreur lors de la création du banner");
    },
  });

  const updateMutation = useMutation({
    ...updateBannerMutationOptions(),
    mutationFn: async (values: BannerFormData) => {
      if (!selectedBanner) {
        toastErr("Banner sélectionné manquant");
        return;
      }

      let finalImageUrl = selectedBanner.file_path || "";

      if (values.image && isFile(values.image)) {
        const uploadResponse = await uploadMutation.mutateAsync({
          file: values.image,
        });

        if (uploadResponse.success) {
          finalImageUrl = uploadResponse.url;
        } else {
          console.error("Failed to upload new banner image:", uploadResponse);
          toastErr("Erreur lors de l'upload de l'image");
          return;
        }
      }

      const bannerData: CreateBannerCredential = {
        file_path: finalImageUrl,
        description: values.description.trim() || selectedBanner.description,
        productLink: values.productLink?.trim() || "",
        provider: "BANNER",
      };

      return await updateBannerMutationOptions().mutationFn({
        id: selectedBanner.id,
        data: bannerData,
      });
    },
    onSuccess: (data) => {
      toastSuccess("Banner mis à jour avec succès");
      setIsEditDialogOpen(false);
      setSelectedBanner(null);
      editForm.reset();
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
    onError: (error: Error) => {
      toastErr(error.message || "Erreur lors de la mise à jour du banner");
    },
  });

  const deleteMutation = useMutation({
    ...deleteBannerMutationOptions(),
    onSuccess: () => {
      toastSuccess("Banner supprimé avec succès");
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
    onError: (error: Error) => {
      toastErr(error.message || "Erreur lors de la suppression du banner");
    },
  });

  // Forms
  const createForm = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      image: null,
      description: "",
      productLink: "",
    },
  });

  const editForm = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      image: null,
      description: "",
      productLink: "",
    },
  });

  // Handlers
  const handleCreate = (data: BannerFormData) => {
    createMutation.mutate(data);
  };

  const handleEdit = (banner: Banner) => {
    setSelectedBanner(banner);
    editForm.reset({
      image: null,
      description: banner.description,
      productLink: "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data: BannerFormData) => {
    updateMutation.mutate(data);
  };

  const handleDelete = async (banner: Banner) => {
    const confirmed = await confirmDelete(banner.description);
    if (confirmed) {
      deleteMutation.mutate({ id: banner.id });
    }
  };

  const handleView = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsViewDialogOpen(true);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4">
        <LoadingSkeleton rows={1} />
        <div className="grid gap-4 md:grid-cols-4">
          <LoadingSkeleton rows={1} />
          <LoadingSkeleton rows={1} />
          <LoadingSkeleton rows={1} />
          <LoadingSkeleton rows={1} />
        </div>
        <LoadingSkeleton rows={5} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <ErrorMessage
        title="Erreur lors du chargement des banners"
        buttonText="Réessayer"
        onButtonClick={handleRefresh}
      />
    );
  }

  const banners = bannersData?.data || [];
  const totalItems = bannersData?.totalItems || 0;
  const totalPages = bannersData?.totalPages || 1;

  return (
    <motion.div
      className="flex flex-1 flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="@container/main flex flex-1 flex-col gap-4">
        {/* Header */}
        <PageHeader
          icon={Image01Icon}
          title="Gestion des Bannières"
          description="Gérer les bannières publicitaires de la plateforme"
          buttonText="Nouvelle Bannière"
          onButtonClick={() => setIsCreateDialogOpen(true)}
          emoji="🎨"
        />

        {/* Stats */}
        <BannerStatsCards banners={banners} />

        {/* Table */}
        <BannerTable
          banners={banners}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreateClick={() => setIsCreateDialogOpen(true)}
          isDeleting={deleteMutation.isPending}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Dialogs */}
      <BannerCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        form={createForm}
        onSubmit={handleCreate}
        isSubmitting={createMutation.isPending}
      />

      <BannerEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedBanner(null);
        }}
        form={editForm}
        onSubmit={handleUpdate}
        isSubmitting={updateMutation.isPending}
        selectedBanner={selectedBanner}
      />
      <BannerViewDialog
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        banner={selectedBanner}
        onEdit={handleEdit}
      />

      {/* Dialog de confirmation */}
      <ConfirmDialog />
    </motion.div>
  );
}
