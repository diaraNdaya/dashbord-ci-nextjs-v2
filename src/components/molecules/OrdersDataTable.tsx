"use client";

import {
  Delete02Icon,
  MoreHorizontalIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { OrderStatusBadge } from "@/components/atoms/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order } from "@/lib/types/orders.type";

interface OrdersDataTableProps {
  data: Order[];
  onViewOrder: (orderId: string) => void;
  onDeleteOrder: (orderId: string) => void;
  searchQuery?: string;
}

export function OrdersDataTable({
  data,
  onViewOrder,
  onDeleteOrder,
  searchQuery = "",
}: OrdersDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "orderDate", desc: true },
  ]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState<string>(searchQuery);

  // Synchronize global filter with search query
  useEffect(() => {
    setGlobalFilter(searchQuery);
  }, [searchQuery]);

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "ID Commande",
      cell: ({ row }) => (
        <div className="font-mono text-sm">
          #{row.getValue("id")?.toString().slice(-6)}
        </div>
      ),
    },
    {
      accessorKey: "orderDate",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("orderDate"));
        return (
          <div className="text-sm">
            {date.toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "customer",
      header: "Client",
      cell: ({ row }) => {
        const customer = row.getValue("customer") as Order["customer"];
        return (
          <div className="text-sm font-medium">{customer?.name || "N/A"}</div>
        );
      },
    },
    {
      accessorKey: "orderItem",
      header: "Produits",
      cell: ({ row }) => {
        const items = row.getValue("orderItem") as Order["orderItem"];
        const firstItem = items?.[0];
        return (
          <div className="text-sm">
            {firstItem?.product?.name || "N/A"}
            {items && items.length > 1 && (
              <span className="text-muted-foreground">
                {" "}
                +{items.length - 1} autre(s)
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "totalAmount",
      header: "Montant",
      cell: ({ row }) => {
        const amount = row.getValue("totalAmount") as number;
        const currency = row.original.currency || "FCFA";
        return (
          <div className="font-medium">
            {amount?.toLocaleString()} {currency}
          </div>
        );
      },
    },
    {
      accessorKey: "statut",
      header: "Statut",
      cell: ({ row }) => {
        const status = row.getValue("statut") as Order["statut"];
        return <OrderStatusBadge status={status} />;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <HugeiconsIcon icon={MoreHorizontalIcon} className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewOrder(order.id)}>
                <HugeiconsIcon icon={ViewIcon} className="mr-2 h-4 w-4" />
                Voir détails
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteOrder(order.id)}
                className="text-rouge-vif focus:text-rouge-vif"
              >
                <HugeiconsIcon icon={Delete02Icon} className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    globalFilterFn: (row, columnId, filterValue) => {
      const searchValue = filterValue?.toLowerCase() || "";
      if (!searchValue) return true;

      // Search in multiple fields
      const order = row.original;
      const searchFields = [
        order.id?.toString(),
        order.customer?.name,
        order.orderItem?.[0]?.product?.name,
        order.statut,
        order.totalAmount?.toString(),
      ];

      return searchFields.some((field) =>
        field?.toLowerCase().includes(searchValue),
      );
    },
    state: {
      sorting,
      columnVisibility,
      globalFilter,
    },
    // Supprimer la pagination intégrée pour utiliser notre composant personnalisé
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Aucune commande trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
