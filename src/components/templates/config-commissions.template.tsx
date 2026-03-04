"use client";

import { ErrorMessage } from "@/components/atoms/ErrorMessage";
import { LoadingSkeleton } from "@/components/atoms/LoadingSkeleton";
import { toastErr, toastSuccess } from "@/components/molecules/ToastCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useConfirm } from "@/hooks/useConfirm";
import type { CommissionRule } from "@/lib/types/commissions.types";
import {
  createCommissionMutationOptions,
  deleteCommissionMutationOptions,
  getCommissionConfigQueryOptions,
  getCommissionGlobaleQueryOptions,
  updateCommissionMutationOptions,
} from "@/services/queries/commission.queries";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Add01Icon,
  ArrowUp01Icon,
  Delete02Icon,
  Edit01Icon,
  Loading03Icon,
  PercentIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PageHeader } from "../molecules";

// Schema de validation pour le formulaire de commission
const commissionSchema = z.object({
  rate: z
    .number()
    .min(0, "Le taux doit être positif")
    .max(100, "Le taux ne peut pas dépasser 100%"),
});

type CommissionFormData = z.infer<typeof commissionSchema>;

export default function ConfigCommissionsTemplate() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCommission, setSelectedCommission] =
    useState<CommissionRule | null>(null);
  const queryClient = useQueryClient();
  const { confirm, ConfirmDialog } = useConfirm();

  // Queries
  const {
    data: commissionConfig,
    isLoading: isLoadingConfig,
    error: configError,
    refetch: refetchConfig,
  } = useQuery(getCommissionConfigQueryOptions());

  const {
    data: commissionGlobale,
    isLoading: isLoadingGlobale,
    refetch: refetchGlobale,
  } = useQuery(getCommissionGlobaleQueryOptions());

  const createMutation = useMutation({
    ...createCommissionMutationOptions(),
    onSuccess: (data) => {
      toastSuccess("Commission créée avec succès");
      setIsCreateDialogOpen(false);
      createForm.reset();
      queryClient.invalidateQueries({ queryKey: ["commissions"] });
    },
    onError: (error: Error) => {
      toastErr(error.message || "Erreur lors de la création de la commission");
    },
  });

  const updateMutation = useMutation({
    ...updateCommissionMutationOptions(),
    onSuccess: (data) => {
      toastSuccess("Commission mise à jour avec succès");
      setIsEditDialogOpen(false);
      setSelectedCommission(null);
      editForm.reset();
      queryClient.invalidateQueries({ queryKey: ["commissions"] });
    },
    onError: (error: Error) => {
      toastErr(
        error.message || "Erreur lors de la mise à jour de la commission",
      );
    },
  });

  const deleteMutation = useMutation({
    ...deleteCommissionMutationOptions(),
    onSuccess: () => {
      toastSuccess("Commission supprimée avec succès");
      queryClient.invalidateQueries({ queryKey: ["commissions"] });
    },
    onError: (error: Error) => {
      toastErr(
        error.message || "Erreur lors de la suppression de la commission",
      );
    },
  });

  // Forms
  const createForm = useForm<CommissionFormData>({
    resolver: zodResolver(commissionSchema),
    defaultValues: {
      rate: 0,
    },
  });

  const editForm = useForm<CommissionFormData>({
    resolver: zodResolver(commissionSchema),
    defaultValues: {
      rate: 0,
    },
  });

  // Handlers
  const handleCreate = (data: CommissionFormData) => {
    createMutation.mutate(data);
  };

  const handleEdit = (commission: CommissionRule) => {
    setSelectedCommission(commission);
    editForm.reset({ rate: commission.rate });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data: CommissionFormData) => {
    updateMutation.mutate(data);
  };

  const handleDelete = async (commissionId: string) => {
    const confirmed = await confirm({
      title: "Supprimer la commission",
      description:
        "Êtes-vous sûr de vouloir supprimer cette commission ? Cette action est irréversible.",
      confirmText: "Supprimer",
      variant: "destructive",
    });

    if (confirmed) {
      deleteMutation.mutate({ id: commissionId });
    }
  };

  const handleRefresh = () => {
    refetchConfig();
    refetchGlobale();
  };

  // Loading state
  if (isLoadingConfig || isLoadingGlobale) {
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
  if (configError) {
    return (
      <ErrorMessage
        title="Erreur lors du chargement des données de commission"
        buttonText="Réessayer"
        onButtonClick={handleRefresh}
      />
    );
  }

  const currentCommission =
    commissionConfig && (commissionConfig as any).success
      ? (commissionConfig as any).data
      : null;
  const globaleData =
    commissionGlobale && (commissionGlobale as any).success
      ? (commissionGlobale as any).data
      : null;

  return (
    <motion.div
      className="flex flex-1 flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="@container/main flex flex-1 flex-col gap-4">
        <PageHeader
          icon={Add01Icon}
          title="Configuration des Commissions"
          description="Gérer les taux de commission"
          buttonText="Nouvelle Commission"
          onButtonClick={() => setIsCreateDialogOpen(true)}
          // emoji="📁"
        />

        <div className="grid gap-4 md:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Taux Actuel</CardDescription>
                <CardTitle className="text-2xl">
                  {currentCommission?.rate || 0}%
                </CardTitle>
              </CardHeader>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Commission Globale</CardDescription>
                <CardTitle className="text-2xl">
                  {globaleData?.commission || 0} XOF
                </CardTitle>
              </CardHeader>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>TVA</CardDescription>
                <CardTitle className="text-2xl">
                  {globaleData?.tva || 0} XOF
                </CardTitle>
              </CardHeader>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Statut</CardDescription>
                <CardTitle className="text-2xl text-green-600 flex items-center gap-1">
                  <HugeiconsIcon
                    icon={ArrowUp01Icon}
                    strokeWidth={2}
                    className="h-4 w-4"
                  />
                  {globaleData?.status || "Actif"}
                </CardTitle>
              </CardHeader>
            </Card>
          </motion.div>
        </div>

        {/* Commission Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Configuration de Commission</CardTitle>
              <CardDescription>
                Gérer le taux de commission global de la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentCommission ? (
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
                      <HugeiconsIcon
                        icon={PercentIcon}
                        strokeWidth={2}
                        className="h-4 w-4 text-primary"
                      />
                    </div>
                    <div>
                      <div className="font-medium">Commission Globale</div>
                      <div className="text-sm text-muted-foreground">
                        Créée le{" "}
                        {new Date(
                          currentCommission.createdAt,
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">
                      {currentCommission.rate}%
                    </Badge>
                    <Badge variant="default">Actif</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(currentCommission)}
                      disabled={updateMutation.isPending}
                    >
                      {updateMutation.isPending ? (
                        <HugeiconsIcon
                          icon={Loading03Icon}
                          strokeWidth={2}
                          className="h-4 w-4 animate-spin"
                        />
                      ) : (
                        <HugeiconsIcon
                          icon={Edit01Icon}
                          strokeWidth={2}
                          className="h-4 w-4"
                        />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(currentCommission.id)}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? (
                        <HugeiconsIcon
                          icon={Loading03Icon}
                          strokeWidth={2}
                          className="h-4 w-4 animate-spin"
                        />
                      ) : (
                        <HugeiconsIcon
                          icon={Delete02Icon}
                          strokeWidth={2}
                          className="h-4 w-4 text-destructive"
                        />
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Aucune commission configurée
                  </p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <HugeiconsIcon
                      icon={Add01Icon}
                      strokeWidth={2}
                      className="h-4 w-4 mr-2"
                    />
                    Créer une Commission
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Create Commission Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer une Nouvelle Commission</DialogTitle>
            <DialogDescription>
              Définir le taux de commission pour la plateforme
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={createForm.handleSubmit(handleCreate)}
            className="space-y-4"
          >
            <Field>
              <FieldLabel>Taux de Commission (%)</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="5.0"
                  {...createForm.register("rate", { valueAsNumber: true })}
                />
                <FieldError>
                  {createForm.formState.errors.rate?.message}
                </FieldError>
              </FieldContent>
            </Field>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <>
                    <HugeiconsIcon
                      icon={Loading03Icon}
                      strokeWidth={2}
                      className="h-4 w-4 mr-2 animate-spin"
                    />
                    Création...
                  </>
                ) : (
                  "Créer"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Commission Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la Commission</DialogTitle>
            <DialogDescription>
              Mettre à jour le taux de commission
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={editForm.handleSubmit(handleUpdate)}
            className="space-y-4"
          >
            <Field>
              <FieldLabel>Taux de Commission (%)</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="5.0"
                  {...editForm.register("rate", { valueAsNumber: true })}
                />
                <FieldError>
                  {editForm.formState.errors.rate?.message}
                </FieldError>
              </FieldContent>
            </Field>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setSelectedCommission(null);
                }}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? (
                  <>
                    <HugeiconsIcon
                      icon={Loading03Icon}
                      strokeWidth={2}
                      className="h-4 w-4 mr-2 animate-spin"
                    />
                    Mise à jour...
                  </>
                ) : (
                  "Mettre à jour"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <ConfirmDialog />
    </motion.div>
  );
}
