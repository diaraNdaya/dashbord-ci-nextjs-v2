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
import type { Product } from "@/lib/types/products.types";

interface ProductsDataTableProps {
  data: Product[];
  onViewProduct: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  searchQuery?: string;
}

export function ProductsDataTable({
  data,
  onViewProduct,
  onDeleteProduct,
  searchQuery = "",
}: ProductsDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState<string>(searchQuery);
  const [rowSelection, setRowSelection] = useState({});

  // Synchronize global filter with search query
  useEffect(() => {
    setGlobalFilter(searchQuery);
  }, [searchQuery]);

  const getStatusBadge = (product: Product) => {
    if (product.stockQuantity === 0) {
      return (
        <Badge
          variant="destructive"
          className="bg-red-50 text-red-700 border-red-200"
        >
          Out of Stock
        </Badge>
      );
    }
    if (product.stockQuantity <= 10) {
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200"
        >
          Low Stock
        </Badge>
      );
    }
    if (product.available === "true") {
      return (
        <Badge
          variant="default"
          className="bg-green-50 text-green-700 border-green-200"
        >
          Published
        </Badge>
      );
    }
    return (
      <Badge
        variant="secondary"
        className="bg-gray-50 text-gray-700 border-gray-200"
      >
        Draft List
      </Badge>
    );
  };

  const columns: ColumnDef<Product>[] = [
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
      accessorKey: "name",
      header: "Product Name",
      cell: ({ row }) => {
        const product = row.original;
        const primaryImage =
          product.ProductImage?.find((img) => img.isPrimary)?.imageUrl ||
          product.ProductImage?.[0]?.imageUrl ||
          "/images/placeholder-product.jpg";

        return (
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted">
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="font-medium">{product.name}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "categories.name",
      header: "Category",
      cell: ({ row }) => {
        const category = row.original.categories?.name || "N/A";
        return <div className="text-muted-foreground">{category}</div>;
      },
    },
    {
      accessorKey: "stockQuantity",
      header: "Stock",
      cell: ({ row }) => {
        const stock = row.getValue("stockQuantity") as number;
        const isLowStock = stock <= 10 && stock > 0;
        const isOutOfStock = stock === 0;

        return (
          <div className="flex items-center gap-2">
            <span>{stock}</span>
            {isLowStock && (
              <span className="text-xs text-yellow-600 font-medium">
                Low Stock
              </span>
            )}
            {isOutOfStock && (
              <span className="text-xs text-red-600 font-medium">
                Out of Stock
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = row.getValue("price") as number;
        const currency = row.original.currency || "FCFA";
        return (
          <div className="font-medium">${price?.toLocaleString() || 0}</div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const product = row.original;
        return getStatusBadge(product);
      },
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <HugeiconsIcon icon={MoreHorizontalIcon} className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewProduct(product.id)}>
                <HugeiconsIcon icon={ViewIcon} className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteProduct(product.id)}
                className="text-rouge-vif focus:text-rouge-vif"
              >
                <HugeiconsIcon icon={Delete02Icon} className="mr-2 h-4 w-4" />
                Delete
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
    globalFilterFn: (row, columnId, filterValue) => {
      const searchValue = filterValue?.toLowerCase() || "";
      if (!searchValue) return true;

      // Search in multiple fields
      const product = row.original;
      const searchFields = [
        product.name,
        product.categories?.name,
        product.seller?.store_name,
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
                  Aucun produit trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
