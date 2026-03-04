"use client";

import { ErrorMessage } from "@/components/atoms/ErrorMessage";
import { LoadingSkeleton } from "@/components/atoms/LoadingSkeleton";
import { SafeImage } from "@/components/atoms/SafeImage";
import { PageHeader } from "@/components/molecules/PageHeader";
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
  getAllDocumentsQueryOptions,
  validateDocumentMutationOptions,
} from "@/services/queries/commission.queries";
import {
  Calendar03Icon,
  CheckmarkCircle01Icon,
  Download01Icon,
  EyeIcon,
  File01Icon,
  Loading03Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useState } from "react";

// Interface pour les documents avec la structure réelle
interface DocumentDetails {
  id: string;
  fullname: string;
  url_picture: string;
  cni_verso: string;
  cni_recto: string;
  passport: string;
  statut: string;
  user_Id: string;
  createdAt: string;
  updatedAt: string;
}

export default function DocumentsTemplate() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentDetails | null>(null);
  const [isValidationDialogOpen, setIsValidationDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");
  const [selectedImageLabel, setSelectedImageLabel] = useState<string>("");
  const [validationStatus, setValidationStatus] = useState<string>("");
  const limit = 10;
  const queryClient = useQueryClient();

  // Query pour récupérer les documents
  const {
    data: documentsData,
    isLoading,
    error,
    refetch,
  } = useQuery(getAllDocumentsQueryOptions(currentPage, limit));

  // Mutation pour valider un document
  const validateMutation = useMutation({
    ...validateDocumentMutationOptions(),
    onSuccess: () => {
      toastSuccess("Document validé avec succès");
      setIsValidationDialogOpen(false);
      setSelectedDocument(null);
      setValidationStatus("");
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: (error: Error) => {
      toastErr(error.message || "Erreur lors de la validation du document");
    },
  });

  // Handlers
  const handleViewDetails = (document: DocumentDetails) => {
    setSelectedDocument(document);
    // Sélectionner automatiquement la première image disponible
    if (document.url_picture) {
      setSelectedImageUrl(document.url_picture);
      setSelectedImageLabel("Photo de profil");
    } else if (document.cni_recto) {
      setSelectedImageUrl(document.cni_recto);
      setSelectedImageLabel("CNI Recto");
    } else if (document.cni_verso) {
      setSelectedImageUrl(document.cni_verso);
      setSelectedImageLabel("CNI Verso");
    } else if (document.passport) {
      setSelectedImageUrl(document.passport);
      setSelectedImageLabel("Passeport");
    }
    setIsDetailsDialogOpen(true);
  };

  const handleSelectImage = (url: string, label: string) => {
    setSelectedImageUrl(url);
    setSelectedImageLabel(label);
  };

  const handleValidateDocument = (document: DocumentDetails) => {
    setSelectedDocument(document);
    setValidationStatus("confirm");
    setIsValidationDialogOpen(true);
  };

  const handleConfirmValidation = () => {
    if (selectedDocument && validationStatus) {
      validateMutation.mutate({
        id: selectedDocument.id,
        statut: validationStatus,
      });
    }
  };

  const handleDownloadDocument = (url: string) => {
    window.open(url, "_blank");
  };

  const handleRefresh = () => {
    refetch();
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
        title="Erreur lors du chargement des documents"
        buttonText="Réessayer"
        onButtonClick={handleRefresh}
      />
    );
  }

  const documents =
    documentsData && (documentsData as any).success
      ? (documentsData as any).data
      : [];

  const totalItems =
    documentsData && (documentsData as any).success
      ? (documentsData as any).totalItems || 0
      : 0;
  const totalPages =
    documentsData && (documentsData as any).success
      ? (documentsData as any).totalPages || 1
      : 1;

  const confirmedCount = documents.filter(
    (doc: DocumentDetails) => doc.statut === "confirm",
  ).length;
  const pendingCount = documents.filter(
    (doc: DocumentDetails) => doc.statut === "pending",
  ).length;
  const rejectedCount = documents.filter(
    (doc: DocumentDetails) => doc.statut === "rejected",
  ).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirm":
        return (
          <Badge variant="default" className="bg-green-500">
            Confirmé
          </Badge>
        );
      case "pending":
        return <Badge variant="secondary">En attente</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejeté</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <motion.div
      className="flex flex-1 flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="@container/main flex flex-1 flex-col gap-4">
        <PageHeader
          icon={File01Icon}
          title="Gestion des Documents"
          description="Valider et gérer les documents des utilisateurs"
          buttonText="Actualiser"
          onButtonClick={handleRefresh}
        />

        <div className="grid gap-4 md:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Documents</CardDescription>
                <CardTitle className="text-2xl">{totalItems}</CardTitle>
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
                <CardDescription>Confirmés</CardDescription>
                <CardTitle className="text-2xl text-green-600">
                  {confirmedCount}
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
                <CardDescription>En Attente</CardDescription>
                <CardTitle className="text-2xl text-yellow-600">
                  {pendingCount}
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
                <CardDescription>Rejetés</CardDescription>
                <CardTitle className="text-2xl text-red-600">
                  {rejectedCount}
                </CardTitle>
              </CardHeader>
            </Card>
          </motion.div>
        </div>

        {/* Documents list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Documents à Valider</CardTitle>
              <CardDescription>
                Gérer et valider les documents soumis par les utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {documents.length > 0 ? (
                <div className="space-y-4">
                  {documents.map((document: DocumentDetails, index: number) => (
                    <motion.div
                      key={document.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
                          <HugeiconsIcon
                            icon={UserIcon}
                            strokeWidth={2}
                            className="h-4 w-4 text-primary"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{document.fullname}</div>
                          <div className="text-sm text-muted-foreground">
                            ID: {document.id.slice(-8)} • Créé le{" "}
                            {new Date(document.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(document.statut)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(document)}
                          title="Voir les détails"
                        >
                          <HugeiconsIcon
                            icon={EyeIcon}
                            strokeWidth={2}
                            className="h-4 w-4"
                          />
                        </Button>
                        {document.statut !== "confirm" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleValidateDocument(document)}
                            title="Confirmer le document"
                            disabled={validateMutation.isPending}
                          >
                            {validateMutation.isPending ? (
                              <HugeiconsIcon
                                icon={Loading03Icon}
                                strokeWidth={2}
                                className="h-4 w-4 animate-spin"
                              />
                            ) : (
                              <HugeiconsIcon
                                icon={CheckmarkCircle01Icon}
                                strokeWidth={2}
                                className="h-4 w-4 text-green-600"
                              />
                            )}
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <HugeiconsIcon
                    icon={File01Icon}
                    strokeWidth={1}
                    className="h-12 w-12 text-muted-foreground mx-auto mb-4"
                  />
                  <p className="text-muted-foreground mb-4">
                    Aucun document trouvé
                  </p>
                  <Button onClick={handleRefresh} variant="outline">
                    Actualiser
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} sur {totalPages} ({totalItems} documents)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Précédent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="w-[95%] max-w-9xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails du Document</DialogTitle>
            <DialogDescription>
              Vérifier les informations et documents soumis
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-6">
              {/* Informations générales */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Nom complet
                  </label>
                  <p className="font-medium">{selectedDocument.fullname}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Statut
                  </label>
                  <div className="mt-1">
                    {getStatusBadge(selectedDocument.statut)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Date de création
                  </label>
                  <p className="flex items-center gap-1">
                    <HugeiconsIcon icon={Calendar03Icon} className="h-4 w-4" />
                    {new Date(selectedDocument.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Dernière mise à jour
                  </label>
                  <p className="flex items-center gap-1">
                    <HugeiconsIcon icon={Calendar03Icon} className="h-4 w-4" />
                    {new Date(selectedDocument.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Photos des documents */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Documents soumis</h3>

                {/* Miniatures des documents */}
                <div className="flex flex-wrap gap-3">
                  {selectedDocument.url_picture && (
                    <div
                      className={`cursor-pointer border-2 rounded-lg p-1 transition-all ${
                        selectedImageUrl === selectedDocument.url_picture
                          ? "border-primary shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() =>
                        handleSelectImage(
                          selectedDocument.url_picture,
                          "Photo de profil",
                        )
                      }
                    >
                      <SafeImage
                        src={selectedDocument.url_picture}
                        alt="Photo de profil"
                        width={80}
                        height={80}
                        className="rounded object-cover"
                      />
                      <p className="text-xs text-center mt-1 font-medium">
                        Photo
                      </p>
                    </div>
                  )}

                  {selectedDocument.cni_recto && (
                    <div
                      className={`cursor-pointer border-2 rounded-lg p-1 transition-all ${
                        selectedImageUrl === selectedDocument.cni_recto
                          ? "border-primary shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() =>
                        handleSelectImage(
                          selectedDocument.cni_recto,
                          "CNI Recto",
                        )
                      }
                    >
                      <SafeImage
                        src={selectedDocument.cni_recto}
                        alt="CNI Recto"
                        width={80}
                        height={60}
                        className="rounded object-cover"
                      />
                      <p className="text-xs text-center mt-1 font-medium">
                        CNI Recto
                      </p>
                    </div>
                  )}

                  {selectedDocument.cni_verso && (
                    <div
                      className={`cursor-pointer border-2 rounded-lg p-1 transition-all ${
                        selectedImageUrl === selectedDocument.cni_verso
                          ? "border-primary shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() =>
                        handleSelectImage(
                          selectedDocument.cni_verso,
                          "CNI Verso",
                        )
                      }
                    >
                      <SafeImage
                        src={selectedDocument.cni_verso}
                        alt="CNI Verso"
                        width={80}
                        height={60}
                        className="rounded object-cover"
                      />
                      <p className="text-xs text-center mt-1 font-medium">
                        CNI Verso
                      </p>
                    </div>
                  )}

                  {selectedDocument.passport && (
                    <div
                      className={`cursor-pointer border-2 rounded-lg p-1 transition-all ${
                        selectedImageUrl === selectedDocument.passport
                          ? "border-primary shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() =>
                        handleSelectImage(
                          selectedDocument.passport,
                          "Passeport",
                        )
                      }
                    >
                      <SafeImage
                        src={selectedDocument.passport}
                        alt="Passeport"
                        width={80}
                        height={60}
                        className="rounded object-cover"
                      />
                      <p className="text-xs text-center mt-1 font-medium">
                        Passeport
                      </p>
                    </div>
                  )}
                </div>

                {/* Image sélectionnée en grand */}
                {selectedImageUrl && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-lg">
                        {selectedImageLabel}
                      </h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadDocument(selectedImageUrl)}
                      >
                        <HugeiconsIcon
                          icon={Download01Icon}
                          className="h-4 w-4 mr-2"
                        />
                        Télécharger
                      </Button>
                    </div>
                    <div className="border rounded-lg p-4 bg-white flex justify-center">
                      <SafeImage
                        src={selectedImageUrl}
                        alt={selectedImageLabel}
                        width={400}
                        height={300}
                        className="rounded-lg object-contain max-w-full h-auto"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailsDialogOpen(false)}
            >
              Fermer
            </Button>
            {selectedDocument && selectedDocument.statut !== "confirm" && (
              <Button
                onClick={() => {
                  setIsDetailsDialogOpen(false);
                  handleValidateDocument(selectedDocument);
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <HugeiconsIcon
                  icon={CheckmarkCircle01Icon}
                  strokeWidth={2}
                  className="h-4 w-4 mr-2"
                />
                Confirmer le Document
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Validation Dialog */}
      <Dialog
        open={isValidationDialogOpen}
        onOpenChange={setIsValidationDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer le Document</DialogTitle>
            <DialogDescription>
              Changer le statut du document vers &quot;Confirmé&quot;
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedDocument && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="font-medium">
                  Utilisateur: {selectedDocument.fullname}
                </p>
                <p className="text-sm text-muted-foreground">
                  ID: {selectedDocument.id}
                </p>
                <p className="text-sm text-muted-foreground">
                  Statut actuel: {selectedDocument.statut}
                </p>
              </div>
            )}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">
                ✓ Le document sera marqué comme &quot;Confirmé&quot;
              </p>
              <p className="text-sm text-green-600 mt-1">
                Cette action validera définitivement le document de
                l&apos;utilisateur.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsValidationDialogOpen(false);
                setSelectedDocument(null);
                setValidationStatus("");
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleConfirmValidation}
              disabled={validateMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {validateMutation.isPending ? (
                <>
                  <HugeiconsIcon
                    icon={Loading03Icon}
                    strokeWidth={2}
                    className="h-4 w-4 mr-2 animate-spin"
                  />
                  Confirmation...
                </>
              ) : (
                <>
                  <HugeiconsIcon
                    icon={CheckmarkCircle01Icon}
                    strokeWidth={2}
                    className="h-4 w-4 mr-2"
                  />
                  Confirmer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
