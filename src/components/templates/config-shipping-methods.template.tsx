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
  shippingMethodSchema,
  type ShippingMethodFormData,
} from "@/lib/schemas/shipping.schema";
import type {
  ShippingMethod,
  ShippingMethodCredentials,
} from "@/lib/types/shipping.types";
import { formatPrice } from "@/lib/utils";
import {
  createShippingMethodMutationOptions,
  deleteShippingMethodMutationOptions,
  getAllShippingMethodsQueryOptions,
  updateShippingMethodMutationOptions,
} from "@/services/queries/shipping.queries";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Delete01Icon,
  Edit01Icon,
  Loading03Icon,
  PlusSignIcon,
  TruckIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ConfigShippingMethodsTemplate() {
  const { confirmDelete, ConfirmDialog } = useConfirm();
  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState<ShippingMethod | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: shippingMethodsData,
    isLoading,
    error,
    refetch,
  } = useQuery(getAllShippingMethodsQueryOptions(1, 100));

  const createMutation = useMutation({
    ...createShippingMethodMutationOptions(),
    onSuccess: () => {
      toastSuccess("Méthode de livraison créée avec succès");
      setIsCreateDialogOpen(false);
      createForm.reset();
      queryClient.invalidateQueries({ queryKey: ["shipping-methods"] });
    },
    onError: (error: Error) => {
      toastErr(
        error.message ||
          "Erreur lors de la création de la méthode de livraison",
      );
    },
  });

  const updateMutation = useMutation({
    ...updateShippingMethodMutationOptions(),
    onSuccess: () => {
      toastSuccess("Méthode de livraison mise à jour avec succès");
      setIsEditDialogOpen(false);
      setSelectedShippingMethod(null);
      editForm.reset();
      queryClient.invalidateQueries({ queryKey: ["shipping-methods"] });
    },
    onError: (error: Error) => {
      toastErr(
        error.message ||
          "Erreur lors de la mise à jour de la méthode de livraison",
      );
    },
  });

  const deleteMutation = useMutation({
    ...deleteShippingMethodMutationOptions(),
    onSuccess: () => {
      toastSuccess("Méthode de livraison supprimée avec succès");
      queryClient.invalidateQueries({ queryKey: ["shipping-methods"] });
    },
    onError: (error: Error) => {
      toastErr(
        error.message ||
          "Erreur lors de la suppression de la méthode de livraison",
      );
    },
  });

  const createForm = useForm<ShippingMethodFormData>({
    resolver: zodResolver(shippingMethodSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
    },
  });

  const editForm = useForm<ShippingMethodFormData>({
    resolver: zodResolver(shippingMethodSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
    },
  });

  const handleCreate = (data: ShippingMethodFormData) => {
    const shippingMethodData: ShippingMethodCredentials = {
      name: data.name.trim(),
      price: data.price,
      description: data.description.trim(),
    };
    createMutation.mutate(shippingMethodData);
  };

  const handleEdit = (shippingMethod: ShippingMethod) => {
    setSelectedShippingMethod(shippingMethod);
    editForm.reset({
      name: shippingMethod.name,
      price: shippingMethod.price,
      description: shippingMethod.description,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data: ShippingMethodFormData) => {
    if (!selectedShippingMethod) return;

    const shippingMethodData: ShippingMethodCredentials = {
      name: data.name.trim(),
      price: data.price,
      description: data.description.trim(),
    };

    updateMutation.mutate({
      id: selectedShippingMethod.id,
      data: shippingMethodData,
    });
  };

  const handleDelete = async (shippingMethod: ShippingMethod) => {
    const confirmed = await confirmDelete(
      `la méthode de livraison "${shippingMethod.name}"`,
    );
    if (confirmed) {
      deleteMutation.mutate({ id: shippingMethod.id });
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4">
        <LoadingSkeleton rows={1} />
        <LoadingSkeleton rows={5} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        title="Erreur lors du chargement des méthodes de livraison"
        buttonText="Réessayer"
        onButtonClick={handleRefresh}
      />
    );
  }

  const shippingMethods = shippingMethodsData?.data || [];

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
          icon={TruckIcon}
          title="Méthodes de Livraison"
          description="Gérer les méthodes de livraison disponibles"
          buttonText="Nouvelle Méthode"
          onButtonClick={() => setIsCreateDialogOpen(true)}
        />

        {/* Shipping Methods List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>
                Méthodes de Livraison ({shippingMethods.length})
              </CardTitle>
              <CardDescription>
                Liste des méthodes de livraison configurées
              </CardDescription>
            </CardHeader>
            <CardContent>
              {shippingMethods.length > 0 ? (
                <div className="space-y-4">
                  {shippingMethods.map(
                    (shippingMethod: ShippingMethod, index: number) => (
                      <motion.div
                        key={shippingMethod.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <div>
                              <div className="font-semibold text-lg">
                                {shippingMethod.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Prix: {formatPrice(shippingMethod.price)}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  shippingMethod.active
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {shippingMethod.active ? "Actif" : "Inactif"}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {shippingMethod.description}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(shippingMethod)}
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
                            onClick={() => handleDelete(shippingMethod)}
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
                    ),
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <HugeiconsIcon
                    icon={TruckIcon}
                    strokeWidth={1}
                    className="h-12 w-12 text-muted-foreground mx-auto mb-4"
                  />
                  <h3 className="text-lg font-medium mb-2">
                    Aucune méthode de livraison configurée
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Commencez par créer une nouvelle méthode de livraison
                  </p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <HugeiconsIcon
                      icon={PlusSignIcon}
                      strokeWidth={2}
                      className="h-4 w-4 mr-2"
                    />
                    Créer une méthode
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
            <DialogTitle>Créer une Nouvelle Méthode de Livraison</DialogTitle>
            <DialogDescription>
              Configurer une nouvelle méthode de livraison
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={createForm.handleSubmit(handleCreate)}
            className="space-y-4"
          >
            <Field>
              <FieldLabel>Nom de la Méthode</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="Livraison standard"
                  {...createForm.register("name")}
                />
                <FieldError>
                  {createForm.formState.errors.name?.message}
                </FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Prix (F CFA)</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="5.99"
                  {...createForm.register("price", { valueAsNumber: true })}
                />
                <FieldError>
                  {createForm.formState.errors.price?.message}
                </FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Description</FieldLabel>
              <FieldContent>
                <Textarea
                  placeholder="Description de la méthode de livraison..."
                  {...createForm.register("description")}
                />
                <FieldError>
                  {createForm.formState.errors.description?.message}
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
            <DialogTitle>Modifier la Méthode de Livraison</DialogTitle>
            <DialogDescription>
              Mettre à jour les informations de la méthode de livraison
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={editForm.handleSubmit(handleUpdate)}
            className="space-y-4"
          >
            <Field>
              <FieldLabel>Nom de la Méthode</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="Livraison standard"
                  {...editForm.register("name")}
                />
                <FieldError>
                  {editForm.formState.errors.name?.message}
                </FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Prix (€)</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="5.99"
                  {...editForm.register("price", { valueAsNumber: true })}
                />
                <FieldError>
                  {editForm.formState.errors.price?.message}
                </FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Description</FieldLabel>
              <FieldContent>
                <Textarea
                  placeholder="Description de la méthode de livraison..."
                  {...editForm.register("description")}
                />
                <FieldError>
                  {editForm.formState.errors.description?.message}
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
