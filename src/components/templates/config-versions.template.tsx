"use client";

import { ErrorMessage } from "@/components/atoms/ErrorMessage";
import { LoadingSkeleton } from "@/components/atoms/LoadingSkeleton";
import { PageHeader } from "@/components/molecules/PageHeader";
import { toastErr, toastSuccess } from "@/components/molecules/ToastCard";
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
import { Textarea } from "@/components/ui/textarea";
import { useConfirm } from "@/hooks/useConfirm";
import {
  versionSchema,
  type VersionFormData,
} from "@/lib/schemas/version.schema";
import type { CreateVersionPayload, Version } from "@/lib/types/version.types";
import {
  createVersionMutationOptions,
  deleteVersionMutationOptions,
  getAllVersionsQueryOptions,
  updateVersionMutationOptions,
} from "@/services/queries/version.queries";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Delete01Icon,
  Edit01Icon,
  Loading03Icon,
  PlusSignIcon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ConfigVersionsTemplate() {
  const { confirmDelete, ConfirmDialog } = useConfirm();
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Query pour récupérer les versions
  const {
    data: versionsData,
    isLoading,
    error,
    refetch,
  } = useQuery(getAllVersionsQueryOptions());

  const createMutation = useMutation({
    ...createVersionMutationOptions(),
    onSuccess: () => {
      toastSuccess("Version créée avec succès");
      setIsCreateDialogOpen(false);
      createForm.reset();
      queryClient.invalidateQueries({ queryKey: ["versions"] });
    },
    onError: (error: Error) => {
      toastErr(error.message || "Erreur lors de la création de la version");
    },
  });

  const updateMutation = useMutation({
    ...updateVersionMutationOptions(),
    onSuccess: () => {
      toastSuccess("Version mise à jour avec succès");
      setIsEditDialogOpen(false);
      setSelectedVersion(null);
      editForm.reset();
      queryClient.invalidateQueries({ queryKey: ["versions"] });
    },
    onError: (error: Error) => {
      toastErr(error.message || "Erreur lors de la mise à jour de la version");
    },
  });

  const deleteMutation = useMutation({
    ...deleteVersionMutationOptions(),
    onSuccess: () => {
      toastSuccess("Version supprimée avec succès");
      queryClient.invalidateQueries({ queryKey: ["versions"] });
    },
    onError: (error: Error) => {
      toastErr(error.message || "Erreur lors de la suppression de la version");
    },
  });

  // Forms
  const createForm = useForm<VersionFormData>({
    resolver: zodResolver(versionSchema),
    defaultValues: {
      latestVersion: "",
      minVersion: "",
      forceUpdateMessage: "",
    },
  });

  const editForm = useForm<VersionFormData>({
    resolver: zodResolver(versionSchema),
    defaultValues: {
      latestVersion: "",
      minVersion: "",
      forceUpdateMessage: "",
    },
  });

  // Handlers
  const handleCreate = (data: VersionFormData) => {
    const versionData: CreateVersionPayload = {
      latestVersion: data.latestVersion.trim(),
      minVersion: data.minVersion.trim(),
      forceUpdateMessage: data.forceUpdateMessage.trim(),
    };
    createMutation.mutate(versionData);
  };

  const handleEdit = (version: Version) => {
    setSelectedVersion(version);
    editForm.reset({
      latestVersion: version.latestVersion,
      minVersion: version.minVersion,
      forceUpdateMessage: version.forceUpdateMessage,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data: VersionFormData) => {
    if (!selectedVersion) return;

    const versionData: CreateVersionPayload = {
      latestVersion: data.latestVersion.trim(),
      minVersion: data.minVersion.trim(),
      forceUpdateMessage: data.forceUpdateMessage.trim(),
    };

    updateMutation.mutate({
      id: selectedVersion.id,
      data: versionData,
    });
  };

  const handleDelete = async (version: Version) => {
    const confirmed = await confirmDelete(
      `la version ${version.latestVersion}`,
    );
    if (confirmed) {
      deleteMutation.mutate({ id: version.id });
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4">
        <LoadingSkeleton rows={1} />
        <LoadingSkeleton rows={5} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <ErrorMessage
        title="Erreur lors du chargement des versions"
        buttonText="Réessayer"
        onButtonClick={handleRefresh}
      />
    );
  }

  const versions = versionsData?.data || [];

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
          icon={Settings01Icon}
          title="Gestion des Versions"
          description="Gérer les versions de l'application mobile"
          buttonText="Nouvelle Version"
          onButtonClick={() => setIsCreateDialogOpen(true)}
        />

        {/* Versions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Versions ({versions.length})</CardTitle>
              <CardDescription>Liste des versions configurées</CardDescription>
            </CardHeader>
            <CardContent>
              {versions.length > 0 ? (
                <div className="space-y-4">
                  {versions.map((version: Version, index: number) => (
                    <motion.div
                      key={version.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <div>
                            <span className="text-sm text-muted-foreground">
                              Version actuelle:
                            </span>
                            <div className="font-semibold text-lg">
                              {version.latestVersion}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">
                              Version minimale:
                            </span>
                            <div className="font-medium">
                              {version.minVersion}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          <strong>Message de mise à jour:</strong>{" "}
                          {version.forceUpdateMessage}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(version)}
                          title="Modifier"
                        >
                          <HugeiconsIcon
                            icon={Edit01Icon}
                            strokeWidth={2}
                            className="h-4 w-4"
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(version)}
                          title="Supprimer"
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
                              icon={Delete01Icon}
                              strokeWidth={2}
                              className="h-4 w-4 text-destructive"
                            />
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <HugeiconsIcon
                    icon={Settings01Icon}
                    strokeWidth={1}
                    className="h-12 w-12 text-muted-foreground mx-auto mb-4"
                  />
                  <h3 className="text-lg font-medium mb-2">
                    Aucune version configurée
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Commencez par créer une nouvelle version
                  </p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <HugeiconsIcon
                      icon={PlusSignIcon}
                      strokeWidth={2}
                      className="h-4 w-4 mr-2"
                    />
                    Créer une version
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Créer une Nouvelle Version</DialogTitle>
            <DialogDescription>
              Configurer une nouvelle version de l&apos;application
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={createForm.handleSubmit(handleCreate)}
            className="space-y-4"
          >
            <Field>
              <FieldLabel>Version Actuelle</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="1.0.0"
                  {...createForm.register("latestVersion")}
                />
                <FieldError>
                  {createForm.formState.errors.latestVersion?.message}
                </FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Version Minimale</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="1.0.0"
                  {...createForm.register("minVersion")}
                />
                <FieldError>
                  {createForm.formState.errors.minVersion?.message}
                </FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Message de Mise à Jour Forcée</FieldLabel>
              <FieldContent>
                <Textarea
                  placeholder="Veuillez mettre à jour votre application..."
                  {...createForm.register("forceUpdateMessage")}
                />
                <FieldError>
                  {createForm.formState.errors.forceUpdateMessage?.message}
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier la Version</DialogTitle>
            <DialogDescription>
              Mettre à jour les informations de la version
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={editForm.handleSubmit(handleUpdate)}
            className="space-y-4"
          >
            <Field>
              <FieldLabel>Version Actuelle</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="1.0.0"
                  {...editForm.register("latestVersion")}
                />
                <FieldError>
                  {editForm.formState.errors.latestVersion?.message}
                </FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Version Minimale</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="1.0.0"
                  {...editForm.register("minVersion")}
                />
                <FieldError>
                  {editForm.formState.errors.minVersion?.message}
                </FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Message de Mise à Jour Forcée</FieldLabel>
              <FieldContent>
                <Textarea
                  placeholder="Veuillez mettre à jour votre application..."
                  {...editForm.register("forceUpdateMessage")}
                />
                <FieldError>
                  {editForm.formState.errors.forceUpdateMessage?.message}
                </FieldError>
              </FieldContent>
            </Field>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
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

      {/* Dialog de confirmation */}
      <ConfirmDialog />
    </motion.div>
  );
}
