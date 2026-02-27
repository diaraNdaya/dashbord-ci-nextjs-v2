"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
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
import { formatPrice } from "@/lib/utils";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Calendar03Icon,
  CreditCardIcon,
  EyeIcon,
  MoneyBag02Icon,
  SmartPhone01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

interface Transaction {
  id: string;
  orders_id: string;
  customer_id: string;
  payment_method: string;
  amount: number;
  payment_status: string;
  provider: string;
  currency: string;
  payment_date: string;
  createdAt: string;
  reference: string;
  operator: string;
  transactionId: string;
  phonePaid: string;
  customer: {
    id: string;
    name: string;
    isVerified: boolean;
  };
  Orders: Array<{
    id: string;
    statut: string;
    totalAmount: number;
    quantity: number;
    shippingMethod: string;
  }>;
}

interface TransactionsDataTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  period: string;
  date: string;
  onPeriodChange: (period: string) => void;
  onDateChange: (date: string) => void;
  // Pagination props
  totalItems?: number;
  currentPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

const formatPaymentMethod = (method: string) => {
  switch (method?.toLowerCase()) {
    case "mobile_money":
      return "Mobile Money";
    case "card":
      return "Carte bancaire";
    case "cash":
      return "Espèces";
    case "bank_transfer":
      return "Virement bancaire";
    default:
      return method || "Non spécifié";
  }
};

const formatPaymentStatus = (status: string) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "Payé";
    case "pending":
      return "En attente";
    case "failed":
      return "Échoué";
    case "cancelled":
      return "Annulé";
    default:
      return status || "Inconnu";
  }
};

const getPaymentMethodIcon = (method: string) => {
  switch (method?.toLowerCase()) {
    case "mobile_money":
      return SmartPhone01Icon;
    case "cash":
      return MoneyBag02Icon;
    default:
      return CreditCardIcon;
  }
};

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "text-green-600 bg-green-50 dark:bg-green-950/20";
    case "pending":
      return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20";
    case "failed":
      return "text-red-600 bg-red-50 dark:bg-red-950/20";
    case "cancelled":
      return "text-gray-600 bg-gray-50 dark:bg-gray-950/20";
    default:
      return "text-gray-600 bg-gray-50 dark:bg-gray-950/20";
  }
};

export function TransactionsDataTable({
  transactions,
  isLoading,
  period,
  date,
  onPeriodChange,
  onDateChange,
  totalItems = 0,
  currentPage = 1,
  itemsPerPage = 10,
  onPageChange = () => {},
  onItemsPerPageChange = () => {},
}: TransactionsDataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        transaction.customer?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.reference
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.transactionId
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || transaction.payment_status === statusFilter;

      const matchesMethod =
        methodFilter === "all" || transaction.payment_method === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [transactions, searchTerm, statusFilter, methodFilter]);

  const totalPages = Math.ceil(
    (totalItems || filteredTransactions.length) / itemsPerPage,
  );
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(
    currentPage * itemsPerPage,
    totalItems || filteredTransactions.length,
  );
  const displayedTransactions =
    totalItems > 0 ? transactions : filteredTransactions;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <Input
            placeholder="Rechercher par nom, référence..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sm:max-w-xs"
          />

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="sm:w-40">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="paid">Payé</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="failed">Échoué</SelectItem>
              <SelectItem value="cancelled">Annulé</SelectItem>
            </SelectContent>
          </Select>

          <Select value={methodFilter} onValueChange={setMethodFilter}>
            <SelectTrigger className="sm:w-40">
              <SelectValue placeholder="Méthode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les méthodes</SelectItem>
              <SelectItem value="mobile_money">Mobile Money</SelectItem>
              <SelectItem value="card">Carte bancaire</SelectItem>
              <SelectItem value="cash">Espèces</SelectItem>
              <SelectItem value="bank_transfer">Virement</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Select value={period} onValueChange={onPeriodChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Jour</SelectItem>
              <SelectItem value="week">Semaine</SelectItem>
              <SelectItem value="month">Mois</SelectItem>
              <SelectItem value="year">Année</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative">
            <HugeiconsIcon
              icon={Calendar03Icon}
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              className="pl-9 w-40"
            />
          </div>
        </div>
      </div>

      {/* Tableau */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Méthode</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Référence</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="text-muted-foreground">
                    {transactions.length === 0
                      ? "Aucune transaction trouvée"
                      : "Aucune transaction ne correspond aux filtres"}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              displayedTransactions.map((transaction, index) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-muted/50"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-violet-vif/10 flex items-center justify-center">
                        <span className="text-xs font-semibold text-violet-vif">
                          {transaction.customer?.name
                            ?.charAt(0)
                            ?.toUpperCase() || "?"}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">
                          {transaction.customer?.name || "Client non spécifié"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.phonePaid || "N/A"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon
                        icon={getPaymentMethodIcon(transaction.payment_method)}
                        className="h-4 w-4 text-muted-foreground"
                      />
                      <span className="text-sm">
                        {formatPaymentMethod(transaction.payment_method)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatPrice(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        transaction.payment_status,
                      )}`}
                    >
                      {formatPaymentStatus(transaction.payment_status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(
                      transaction.payment_date || transaction.createdAt,
                    ).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {transaction.reference}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <HugeiconsIcon icon={EyeIcon} className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[95vw] w-[95vw] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-xl">
                            Détails de la transaction
                          </DialogTitle>
                        </DialogHeader>
                        <TransactionDetails transaction={transaction} />
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex w-full flex-wrap items-center justify-between gap-6 max-sm:justify-center">
        <div className="flex shrink-0 items-center gap-3">
          <Label htmlFor="items-per-page">Lignes par page</Label>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
          >
            <SelectTrigger
              id="items-per-page"
              className="w-fit whitespace-nowrap"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-muted-foreground flex grow items-center justify-end whitespace-nowrap max-sm:justify-center">
          <p
            className="text-muted-foreground text-sm whitespace-nowrap"
            aria-live="polite"
          >
            Affichage de <span className="text-foreground">{startItem}</span> à{" "}
            <span className="text-foreground">{endItem}</span> sur{" "}
            <span className="text-foreground">
              {totalItems || filteredTransactions.length}
            </span>{" "}
            transactions
          </p>
        </div>

        {totalPages > 1 && (
          <Pagination className="w-fit max-sm:mx-0">
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onPageChange(1)}
                  disabled={currentPage === 1}
                  className="rounded-full"
                  aria-label="Aller à la première page"
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" />
                </Button>
              </PaginationItem>

              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(Math.max(1, currentPage - 1));
                  }}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {/* Pages numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(pageNumber);
                      }}
                      isActive={pageNumber === currentPage}
                      className="rounded-full cursor-pointer"
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(Math.min(totalPages, currentPage + 1));
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              <PaginationItem>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onPageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="rounded-full"
                  aria-label="Aller à la dernière page"
                >
                  <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}

function TransactionDetails({ transaction }: { transaction: Transaction }) {
  return (
    <div className="space-y-6">
      {/* Informations générales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">
            Informations de paiement
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Référence:</span>
              <span className="font-mono text-sm">{transaction.reference}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">ID Transaction:</span>
              <span className="font-mono text-xs">
                {transaction.transactionId}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Montant:</span>
              <span className="font-semibold text-lg">
                {formatPrice(transaction.amount)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Devise:</span>
              <span>{transaction.currency}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Méthode:</span>
              <span>{formatPaymentMethod(transaction.payment_method)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Statut:</span>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  transaction.payment_status,
                )}`}
              >
                {formatPaymentStatus(transaction.payment_status)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">
            Fournisseur & Opérateur
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Fournisseur:</span>
              <span>{transaction.provider}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Opérateur:</span>
              <span>{transaction.operator}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">
            Informations client
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Nom:</span>
              <span>{transaction.customer?.name || "Non spécifié"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Téléphone:</span>
              <span>{transaction.phonePaid || "Non spécifié"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Vérifié:</span>
              <span>
                {transaction.customer?.isVerified ? (
                  <span className="text-green-600">✓ Vérifié</span>
                ) : (
                  <span className="text-yellow-600">⚠ Non vérifié</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg border-b pb-2">
          Dates importantes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Date de création:</span>
            <span>
              {new Date(transaction.createdAt).toLocaleString("fr-FR")}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Date de paiement:</span>
            <span>
              {new Date(transaction.payment_date).toLocaleString("fr-FR")}
            </span>
          </div>
        </div>
      </div>

      {/* Commandes associées */}
      {transaction.Orders && transaction.Orders.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">
            Commandes associées
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {transaction.Orders.map((order) => (
              <div key={order.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    Commande #{order.id.slice(-8)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      order.statut === "delivered"
                        ? "bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400"
                        : order.statut === "pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-950/20 dark:text-gray-400"
                    }`}
                  >
                    {order.statut}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantité:</span>
                    <span>{order.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Montant:</span>
                    <span className="font-semibold">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between col-span-2">
                    <span className="text-muted-foreground">Livraison:</span>
                    <span>{order.shippingMethod}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
