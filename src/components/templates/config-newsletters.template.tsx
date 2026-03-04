"use client";

import { DateDisplay } from "@/components/atoms/DateDisplay";
import { ErrorMessage } from "@/components/atoms/ErrorMessage";
import { LoadingSkeleton } from "@/components/atoms/LoadingSkeleton";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useConfirm } from "@/hooks/useConfirm";
import type { Newsletter } from "@/lib/types/newsletter.types";
import {
  deleteNewsletterMutationOptions,
  getAllNewslettersQueryOptions,
} from "@/services/queries/newsletter.queries";
import {
  Delete01Icon,
  Loading03Icon,
  Mail01Icon,
  Search01Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { PageHeader } from "../molecules";
import { Input } from "../ui/input";
export default function ConfigNewslettersTemplate() {
  const { confirmDelete, ConfirmDialog } = useConfirm();
  const [selectedNewsletter, setSelectedNewsletter] =
    useState<Newsletter | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const queryClient = useQueryClient();

  // Debounced search
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  }, 300);

  // Query pour récupérer les newsletters avec pagination
  const {
    data: newslettersData,
    isLoading,
    error,
    refetch,
  } = useQuery(
    getAllNewslettersQueryOptions(currentPage, itemsPerPage, {
      email: searchTerm || undefined,
    }),
  );

  const deleteMutation = useMutation({
    ...deleteNewsletterMutationOptions(),
    onSuccess: () => {
      toastSuccess("Newsletter supprimée avec succès");
      queryClient.invalidateQueries({ queryKey: ["newsletters"] });
    },
    onError: (error: Error) => {
      toastErr(error.message || "Erreur lors de la suppression du newsletter");
    },
  });

  // Handlers
  const handleView = (newsletter: Newsletter) => {
    setSelectedNewsletter(newsletter);
    setIsViewDialogOpen(true);
  };

  const handleDelete = async (newsletter: Newsletter) => {
    const confirmed = await confirmDelete(
      `le newsletter de "${newsletter.email}"`,
    );
    if (confirmed) {
      deleteMutation.mutate({ id: newsletter.id });
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Pagination - amélioration pour gérer différents cas d'API
  const totalPages = newslettersData?.totalPages || 1;
  const totalItems = newslettersData?.totalItems || 0;
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const paginationButtons = useMemo(() => {
    const buttons = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(i);
    }

    return buttons;
  }, [currentPage, totalPages]);

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
        title="Erreur lors du chargement des newsletters"
        buttonText="Réessayer"
        onButtonClick={handleRefresh}
      />
    );
  }

  const newsletters = newslettersData?.data || [];

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
          icon={Mail01Icon}
          title={`Newsletters (${totalItems})`}
          description="Gérer les abonnements aux newsletters"
        />

        {/* Newsletters List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    Newsletters
                    {totalItems > 0 && (
                      <span className="text-sm font-normal text-muted-foreground ml-2">
                        ({totalItems} au total)
                      </span>
                    )}
                    {searchTerm && (
                      <span className="text-sm font-normal text-muted-foreground ml-2">
                        - Recherche: &quot;{searchTerm}&quot;
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Liste des abonnements aux newsletters
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <HugeiconsIcon
                      icon={Search01Icon}
                      strokeWidth={2}
                      className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      placeholder="Rechercher par email..."
                      className="pl-9 w-64"
                      onChange={handleSearchChange}
                    />
                  </div>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value={5}>5 par page</option>
                    <option value={10}>10 par page</option>
                    <option value={20}>20 par page</option>
                    <option value={50}>50 par page</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {newsletters.length > 0 ? (
                <>
                  {isLoading && (
                    <div className="flex justify-center py-4">
                      <HugeiconsIcon
                        icon={Loading03Icon}
                        strokeWidth={2}
                        className="h-6 w-6 animate-spin text-muted-foreground"
                      />
                    </div>
                  )}
                  <div className="space-y-4">
                    {newsletters.map(
                      (newsletter: Newsletter, index: number) => (
                        <motion.div
                          key={newsletter.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 * index }}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <div>
                                <div className="font-semibold text-lg">
                                  {newsletter.first_name} {newsletter.last_name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {newsletter.email}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">
                                  Entreprise:
                                </div>
                                <div className="font-medium">
                                  {newsletter.company}
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Inscrit le{" "}
                              <DateDisplay date={newsletter.createdAt} />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(newsletter)}
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
                              onClick={() => handleDelete(newsletter)}
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

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <div className="text-sm text-muted-foreground">
                        Page {currentPage} sur {totalPages}
                        {totalItems > 0 && ` (${totalItems} éléments)`}
                      </div>
                      <div className="flex items-center gap-2">
                        {currentPage > 2 && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePageChange(1)}
                            >
                              1
                            </Button>
                            {currentPage > 3 && (
                              <span className="text-muted-foreground">...</span>
                            )}
                          </>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={!hasPrevPage}
                        >
                          Précédent
                        </Button>
                        {paginationButtons.map((page) => (
                          <Button
                            key={page}
                            variant={
                              page === currentPage ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </Button>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={!hasNextPage}
                        >
                          Suivant
                        </Button>
                        {currentPage < totalPages - 1 && (
                          <>
                            {currentPage < totalPages - 2 && (
                              <span className="text-muted-foreground">...</span>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePageChange(totalPages)}
                            >
                              {totalPages}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <HugeiconsIcon
                    icon={Mail01Icon}
                    strokeWidth={1}
                    className="h-12 w-12 text-muted-foreground mx-auto mb-4"
                  />
                  <h3 className="text-lg font-medium mb-2">
                    {searchTerm
                      ? "Aucun newsletter trouvé"
                      : "Aucun newsletter"}
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? `Aucun newsletter ne correspond à "${searchTerm}"`
                      : "Aucun abonnement aux newsletters pour le moment"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Détails du Newsletter</DialogTitle>
            <DialogDescription>
              Informations complètes de l&apos;abonnement
            </DialogDescription>
          </DialogHeader>
          {selectedNewsletter && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Prénom
                  </label>
                  <p className="font-medium">{selectedNewsletter.first_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Nom
                  </label>
                  <p className="font-medium">{selectedNewsletter.last_name}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p className="font-medium">{selectedNewsletter.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Entreprise
                </label>
                <p className="font-medium">{selectedNewsletter.company}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Message
                </label>
                <p className="text-sm bg-muted p-3 rounded-md">
                  {selectedNewsletter.message}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                <div>
                  <label>Inscrit le</label>
                  <p>
                    <DateDisplay date={selectedNewsletter.createdAt} />
                  </p>
                </div>
                <div>
                  <label>Modifié le</label>
                  <p>
                    <DateDisplay date={selectedNewsletter.updatedAt} />
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation */}
      <ConfirmDialog />
    </motion.div>
  );
}
