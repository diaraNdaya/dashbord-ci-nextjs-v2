"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaction } from "@/services/actions/finances.actions";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

interface TransactionsTableProps {
  transactions: Transaction[];
  totalItems: number;
  currentPage: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  isLoading?: boolean;
}

export default function TransactionsTable({
  transactions,
  totalItems,
  currentPage,
  limit,
  onPageChange,
  onLimitChange,
  isLoading = false,
}: TransactionsTableProps) {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const totalPages = Math.ceil(totalItems / limit);
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { label: "Payé", variant: "default" as const },
      pending: { label: "En attente", variant: "secondary" as const },
      failed: { label: "Échoué", variant: "destructive" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      variant: "outline" as const,
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentMethodLabel = (method: string) => {
    const methods = {
      mobile_money: "Mobile Money",
      card: "Carte bancaire",
      cash: "Espèces",
      bank_transfer: "Virement bancaire",
    };
    return methods[method as keyof typeof methods] || method;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Référence</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Méthode</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: limit }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={7}>
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </TableCell>
                </TableRow>
              ))
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  Aucune transaction trouvée
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {transaction.reference}
                  </TableCell>
                  <TableCell>
                    {transaction.customer?.name || "Client inconnu"}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    {getPaymentMethodLabel(transaction.payment_method)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(transaction.payment_status)}
                  </TableCell>
                  <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedTransaction(transaction)}
                        >
                          <HugeiconsIcon icon={ViewIcon} className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Détails de la transaction</DialogTitle>
                        </DialogHeader>
                        {selectedTransaction && (
                          <TransactionDetails
                            transaction={selectedTransaction}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Label className="whitespace-nowrap">Lignes par page:</Label>
          <Select
            onValueChange={(value) => onLimitChange(+value)}
            value={limit.toString()}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap text-muted-foreground text-sm">
            {startItem}-{endItem} sur {totalItems}
          </span>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  aria-label="Page précédente"
                  disabled={currentPage === 1}
                  size="default"
                  variant="ghost"
                  onClick={() => onPageChange(currentPage - 1)}
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  aria-label="Page suivante"
                  disabled={currentPage >= totalPages}
                  size="default"
                  variant="ghost"
                  onClick={() => onPageChange(currentPage + 1)}
                >
                  <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

// Composant pour afficher les détails de la transaction
function TransactionDetails({ transaction }: { transaction: Transaction }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Informations générales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Référence
            </Label>
            <p className="font-semibold">{transaction.reference}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              ID Transaction
            </Label>
            <p className="font-mono text-sm">{transaction.transactionId}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Montant
            </Label>
            <p className="font-semibold text-lg">
              {formatCurrency(transaction.amount)}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Devise
            </Label>
            <p>{transaction.currency}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Statut
            </Label>
            <div className="mt-1">
              <Badge
                variant={
                  transaction.payment_status === "paid"
                    ? "default"
                    : "secondary"
                }
              >
                {transaction.payment_status === "paid"
                  ? "Payé"
                  : transaction.payment_status}
              </Badge>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Méthode de paiement
            </Label>
            <p>{transaction.payment_method}</p>
          </div>
        </CardContent>
      </Card>

      {/* Informations de paiement */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Détails du paiement</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Fournisseur
            </Label>
            <p>{transaction.provider}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Opérateur
            </Label>
            <p>{transaction.operator}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Téléphone
            </Label>
            <p>{transaction.phonePaid}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Date de paiement
            </Label>
            <p>{formatDate(transaction.payment_date)}</p>
          </div>
          {transaction.paidAt && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Payé le
              </Label>
              <p>{formatDate(transaction.paidAt)}</p>
            </div>
          )}
          {transaction.failureReason && (
            <div className="col-span-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Raison de l&apos;échec
              </Label>
              <p className="text-destructive">{transaction.failureReason}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informations client */}
      {transaction.customer && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informations client</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Nom
              </Label>
              <p className="font-semibold">{transaction.customer.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                ID Client
              </Label>
              <p className="font-mono text-sm">{transaction.customer.id}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Vérifié
              </Label>
              <Badge
                variant={
                  transaction.customer.isVerified ? "default" : "secondary"
                }
              >
                {transaction.customer.isVerified ? "Oui" : "Non"}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Inscrit le
              </Label>
              <p>{formatDate(transaction.customer.createdAt)}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Commandes associées */}
      {transaction.Orders && transaction.Orders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Commandes associées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transaction.Orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        ID Commande
                      </Label>
                      <p className="font-mono text-sm">{order.id}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Statut
                      </Label>
                      <Badge variant="outline">{order.statut}</Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Montant total
                      </Label>
                      <p className="font-semibold">
                        {formatCurrency(order.totalAmount)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Quantité
                      </Label>
                      <p>{order.quantity}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Méthode de livraison
                      </Label>
                      <p>{order.shippingMethod}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Date de livraison
                      </Label>
                      <p>{formatDate(order.shippingDate)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dates importantes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Historique</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Créé le
            </Label>
            <p>{formatDate(transaction.createdAt)}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Mis à jour le
            </Label>
            <p>{formatDate(transaction.updatedAt)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
