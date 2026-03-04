"use client";

import { DateDisplay } from "@/components/atoms/DateDisplay";
import { ErrorMessage } from "@/components/atoms/ErrorMessage";
import { LoadingSkeleton } from "@/components/atoms/LoadingSkeleton";
import TablePagination from "@/components/molecules/TablePagination";
import { toastErr, toastSuccess } from "@/components/molecules/ToastCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import {
  deliveryUserEditSchema,
  deliveryUserSchema,
  type DeliveryUserEditFormData,
  type DeliveryUserFormData,
} from "@/lib/schemas/delivery.schema";
import type {
  CreateDeliveryCredential,
  DeliveryUser,
} from "@/lib/types/delivery.types";
import {
  createDeliveryUserMutationOptions,
  deleteDeliveryUserMutationOptions,
  getAllDeliveriesQueryOptions,
  updateDeliveryUserMutationOptions,
} from "@/services/queries/delivery.queries";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Delete01Icon,
  Edit01Icon,
  Loading03Icon,
  PlusSignIcon,
  Search01Icon,
  TruckDeliveryIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import { PageHeader } from "../molecules";

export default function ConfigDeliveryTemplate() {
  const { confirmDelete, ConfirmDialog } = useConfirm();
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryUser | null>(
    null,
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const queryClient = useQueryClient();

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchTerm(value);
    setPage(1);
  }, 300);

  const {
    data: deliveriesData,
    isLoading,
    error,
    refetch,
  } = useQuery(
    getAllDeliveriesQueryOptions(page, limit, {
      fullName: searchTerm || undefined,
    }),
  );

  const createMutation = useMutation({
    ...createDeliveryUserMutationOptions(),
    onSuccess: () => {
      toastSuccess("Livreur créé avec succès");
      setIsCreateDialogOpen(false);
      createForm.reset();
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
    },
    onError: (error: Error) => {
      toastErr(error.message || "Erreur lors de la création du livreur");
    },
  });

  const updateMutation = useMutation({
    ...updateDeliveryUserMutationOptions(),
    onSuccess: () => {
      toastSuccess("Livreur mis à jour avec succès");
      setIsEditDialogOpen(false);
      setSelectedDelivery(null);
      editForm.reset();
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
    },
    onError: (error: Error) => {
      toastErr(error.message || "Erreur lors de la mise à jour du livreur");
    },
  });

  const deleteMutation = useMutation({
    ...deleteDeliveryUserMutationOptions(),
    onSuccess: () => {
      toastSuccess("Livreur supprimé avec succès");
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
    },
    onError: (error: Error) => {
      toastErr(error.message || "Erreur lors de la suppression du livreur");
    },
  });

  const createForm = useForm<DeliveryUserFormData>({
    resolver: zodResolver(deliveryUserSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      address: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const editForm = useForm<DeliveryUserEditFormData>({
    resolver: zodResolver(deliveryUserEditSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      address: "",
      phone: "",
    },
  });

  // Handlers
  const handleCreate = (data: DeliveryUserFormData) => {
    const deliveryData: CreateDeliveryCredential = {
      fullName: data.fullName.trim(),
      username: data.username.trim(),
      email: data.email.trim(),
      address: data.address.trim(),
      phone: data.phone.trim(),
      role: "DELIVERY",
      password: data.password,
      confirmPassword: data.confirmPassword,
    };
    createMutation.mutate(deliveryData);
  };

  const handleEdit = (delivery: DeliveryUser) => {
    setSelectedDelivery(delivery);
    editForm.reset({
      fullName: delivery.fullName,
      username: delivery.username,
      email: delivery.email,
      address: delivery.address,
      phone: delivery.phone,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data: DeliveryUserEditFormData) => {
    if (!selectedDelivery) return;

    const deliveryData = {
      fullName: data.fullName.trim(),
      username: data.username.trim(),
      email: data.email.trim(),
      address: data.address.trim(),
      phone: data.phone.trim(),
    };

    updateMutation.mutate({
      id: selectedDelivery.id,
      data: deliveryData,
    });
  };

  const handleDelete = async (delivery: DeliveryUser) => {
    const confirmed = await confirmDelete(`le livreur "${delivery.fullName}"`);
    if (confirmed) {
      deleteMutation.mutate({ id: delivery.id });
    }
  };

  const handleView = (delivery: DeliveryUser) => {
    setSelectedDelivery(delivery);
    setIsViewDialogOpen(true);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  // Pagination
  const totalItems = deliveriesData?.totalItems || 0;

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
        title="Erreur lors du chargement des livreurs"
        buttonText="Réessayer"
        onButtonClick={handleRefresh}
      />
    );
  }

  const deliveries = deliveriesData?.data || [];

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
          icon={TruckDeliveryIcon}
          title={`Gestion des Livreurs (${totalItems})`}
          description="Gérer les comptes des livreurs"
          buttonText="Nouveau Livreur"
          onButtonClick={() => setIsCreateDialogOpen(true)}
        />

        {/* Deliveries List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="relative">
                  <HugeiconsIcon
                    icon={Search01Icon}
                    strokeWidth={2}
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    placeholder="Rechercher par nom..."
                    className="pl-9 w-64"
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {deliveries.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {deliveries.map((delivery: DeliveryUser, index: number) => (
                      <motion.div
                        key={delivery.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <div>
                              <div className="font-semibold text-lg">
                                {delivery.fullName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                @{delivery.username} • {delivery.email}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">
                                Téléphone:
                              </div>
                              <div className="font-medium">
                                {delivery.phone}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">
                                Matricule:
                              </div>
                              <div className="font-medium">
                                {delivery.numberMatricule || "Non défini"}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Créé le <DateDisplay date={delivery.createdAt} />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(delivery)}
                            title="Voir le détail"
                          >
                            <HugeiconsIcon
                              icon={ViewIcon}
                              strokeWidth={2}
                              className="h-4 w-4"
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(delivery)}
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
                            onClick={() => handleDelete(delivery)}
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

                  <TablePagination
                    page={page}
                    limit={limit}
                    totalItems={totalItems}
                    onPageChange={handlePageChange}
                    onLimitChange={handleLimitChange}
                  />
                </>
              ) : (
                <div className="text-center py-8">
                  <HugeiconsIcon
                    icon={TruckDeliveryIcon}
                    strokeWidth={1}
                    className="h-12 w-12 text-muted-foreground mx-auto mb-4"
                  />
                  <h3 className="text-lg font-medium mb-2">
                    {searchTerm ? "Aucun livreur trouvé" : "Aucun livreur"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm
                      ? `Aucun livreur ne correspond à "${searchTerm}"`
                      : "Commencez par créer un nouveau livreur"}
                  </p>
                  {!searchTerm && (
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <HugeiconsIcon
                        icon={PlusSignIcon}
                        strokeWidth={2}
                        className="h-4 w-4 mr-2"
                      />
                      Créer un livreur
                    </Button>
                  )}
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
            <DialogTitle>Créer un Nouveau Livreur</DialogTitle>
            <DialogDescription>
              Créer un compte pour un nouveau livreur
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={createForm.handleSubmit(handleCreate)}
            className="space-y-4"
          >
            <Field>
              <FieldLabel>Nom Complet</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="Jean Dupont"
                  {...createForm.register("fullName")}
                />
                <FieldError>
                  {createForm.formState.errors.fullName?.message}
                </FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Nom d&apos;utilisateur</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="jean_dupont"
                  {...createForm.register("username")}
                />
                <FieldError>
                  {createForm.formState.errors.username?.message}
                </FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Email</FieldLabel>
              <FieldContent>
                <Input
                  type="email"
                  placeholder="jean.dupont@example.com"
                  {...createForm.register("email")}
                />
                <FieldError>
                  {createForm.formState.errors.email?.message}
                </FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Adresse</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="123 Rue de la Paix, Paris"
                  {...createForm.register("address")}
                />
                <FieldError>
                  {createForm.formState.errors.address?.message}
                </FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Téléphone</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="+33 1 23 45 67 89"
                  {...createForm.register("phone")}
                />
                <FieldError>
                  {createForm.formState.errors.phone?.message}
                </FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Mot de passe</FieldLabel>
              <FieldContent>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...createForm.register("password")}
                />
                <FieldError>
                  {createForm.formState.errors.password?.message}
                </FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Confirmer le mot de passe</FieldLabel>
              <FieldContent>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...createForm.register("confirmPassword")}
                />
                <FieldError>
                  {createForm.formState.errors.confirmPassword?.message}
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
            <DialogTitle>Modifier le Livreur</DialogTitle>
            <DialogDescription>
              Mettre à jour les informations du livreur
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={editForm.handleSubmit(handleUpdate)}
            className="space-y-4"
          >
            <Field>
              <FieldLabel>Nom Complet</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="Jean Dupont"
                  {...editForm.register("fullName")}
                />
                <FieldError>
                  {editForm.formState.errors.fullName?.message}
                </FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Nom d&apos;utilisateur</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="jean_dupont"
                  {...editForm.register("username")}
                />
                <FieldError>
                  {editForm.formState.errors.username?.message}
                </FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Email</FieldLabel>
              <FieldContent>
                <Input
                  type="email"
                  placeholder="jean.dupont@example.com"
                  {...editForm.register("email")}
                />
                <FieldError>
                  {editForm.formState.errors.email?.message}
                </FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Adresse</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="123 Rue de la Paix, Paris"
                  {...editForm.register("address")}
                />
                <FieldError>
                  {editForm.formState.errors.address?.message}
                </FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Téléphone</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="+33 1 23 45 67 89"
                  {...editForm.register("phone")}
                />
                <FieldError>
                  {editForm.formState.errors.phone?.message}
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

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Détails du Livreur</DialogTitle>
            <DialogDescription>
              Informations complètes du livreur
            </DialogDescription>
          </DialogHeader>
          {selectedDelivery && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Nom complet
                  </label>
                  <p className="font-medium">{selectedDelivery.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Nom d&apos;utilisateur
                  </label>
                  <p className="font-medium">{selectedDelivery.username}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p className="font-medium">{selectedDelivery.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Téléphone
                </label>
                <p className="font-medium">{selectedDelivery.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Adresse
                </label>
                <p className="text-sm bg-muted p-3 rounded-md">
                  {selectedDelivery.address}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Matricule
                  </label>
                  <p className="font-medium">
                    {selectedDelivery.numberMatricule || "Non défini"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Rôle
                  </label>
                  <p className="font-medium">{selectedDelivery.role.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                <div>
                  <label>Créé le</label>
                  <p>
                    <DateDisplay date={selectedDelivery.createdAt} />
                  </p>
                </div>
                <div>
                  <label>Modifié le</label>
                  <p>
                    <DateDisplay date={selectedDelivery.updatedAt} />
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog />
    </motion.div>
  );
}
