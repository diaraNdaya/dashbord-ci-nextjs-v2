"use client";

import {
  MoreHorizontalIcon,
  UserBlock01Icon,
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
import Image from "next/image";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import type { UserTableRow } from "@/lib/types/user-table.type";

interface UsersDataTableProps {
  data: UserTableRow[];
  onViewUser: (userId: string) => void;
  onBlockUser: (userId: string) => void;
  searchQuery?: string;
  userType: "customers" | "sellers" | "blocked-customers" | "blocked-sellers";
}

export function UsersDataTable({
  data,
  onViewUser,
  onBlockUser,
  searchQuery = "",
  userType,
}: UsersDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState<string>(searchQuery);
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    setGlobalFilter(searchQuery);
  }, [searchQuery]);

  const getStatusBadge = (user: UserTableRow) => {
    if (user.isBlocked) {
      return (
        <Badge
          variant="destructive"
          className="bg-red-50 text-red-700 border-red-200"
        >
          Bloqué
        </Badge>
      );
    }

    if (user.isVerified) {
      return (
        <Badge
          variant="default"
          className="bg-green-50 text-green-700 border-green-200"
        >
          Vérifié
        </Badge>
      );
    }

    return (
      <Badge
        variant="secondary"
        className="bg-gray-50 text-gray-700 border-gray-200"
      >
        Non vérifié
      </Badge>
    );
  };

  const columns: ColumnDef<UserTableRow>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "displayName",
      header: userType.includes("sellers") ? "Nom du magasin" : "Nom",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.displayName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <div className="font-medium">{user.displayName}</div>
              <div className="text-sm text-muted-foreground">{user.email || "N/A"}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "location",
      header: userType.includes("sellers") ? "Adresse commerciale" : "Ville",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="text-sm">
            <div>{user.location || "N/A"}</div>
            {user.city && <div className="text-muted-foreground">{user.city}</div>}
          </div>
        );
      },
    },
    {
      accessorKey: "phone",
      header: "Téléphone",
      cell: ({ row }) => {
        const phone = row.original.phone;
        return <div className="text-sm">{phone || "N/A"}</div>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date d'inscription",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
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
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => getStatusBadge(row.original),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <HugeiconsIcon icon={MoreHorizontalIcon} className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewUser(user.profileId)}>
                <HugeiconsIcon icon={ViewIcon} className="mr-2 h-4 w-4" />
                Voir détails
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onBlockUser(user.id)}
                className={
                  user.isBlocked
                    ? "text-vert-menthe focus:text-vert-menthe"
                    : "text-rouge-vif focus:text-rouge-vif"
                }
              >
                <HugeiconsIcon
                  icon={UserBlock01Icon}
                  className="mr-2 h-4 w-4"
                />
                {user.isBlocked ? "Débloquer" : "Bloquer"}
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
    onRowSelectionChange: setRowSelection,
    globalFilterFn: (row, _columnId, filterValue) => {
      const searchValue = filterValue?.toLowerCase() || "";
      if (!searchValue) return true;

      const user = row.original;
      const searchFields = [
        user.displayName,
        user.email,
        user.phone,
        user.location,
        user.city,
      ];

      return searchFields.some((field) =>
        field?.toLowerCase().includes(searchValue),
      );
    },
    state: {
      sorting,
      columnVisibility,
      globalFilter,
      rowSelection,
    },
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
              <TableRow key={headerGroup.id} className="border-b bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-medium">
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
                    <TableCell key={cell.id} className="py-4">
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
                  Aucun utilisateur trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
