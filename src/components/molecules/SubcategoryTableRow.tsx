"use client";

import { SafeImage } from "@/components/atoms/SafeImage";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import type { Subcategory } from "@/lib/types/categories.types";
import {
  Delete01Icon,
  Edit01Icon,
  EyeIcon,
  Image01Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface SubcategoryTableRowProps {
  subcategory: Subcategory;
  onView: (subcategory: Subcategory) => void;
  onEdit: (subcategory: Subcategory) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function SubcategoryTableRow({
  subcategory,
  onView,
  onEdit,
  onDelete,
  isDeleting = false,
}: SubcategoryTableRowProps) {
  return (
    <TableRow key={subcategory.id} className="hover:bg-muted/50">
      <TableCell>
        {subcategory.url ? (
          <div className="h-12 w-12 rounded-lg overflow-hidden border">
            <SafeImage
              src={subcategory.url}
              alt={subcategory.name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
              fallbackClassName="h-12 w-12 rounded-lg"
            />
          </div>
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-vif/10">
            <HugeiconsIcon
              icon={Image01Icon}
              className="h-6 w-6 text-violet-vif"
            />
          </div>
        )}
      </TableCell>
      <TableCell>
        <div className="font-medium">{subcategory.name}</div>
        {subcategory.category && (
          <div className="text-xs text-muted-foreground">
            Catégorie: {subcategory.category.name}
          </div>
        )}
      </TableCell>
      <TableCell>
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
          {subcategory.type}
        </span>
      </TableCell>
      <TableCell>
        <div className="max-w-xs truncate text-sm text-muted-foreground">
          {subcategory.description}
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm text-muted-foreground">
          {new Date(subcategory.createdAt).toLocaleDateString("fr-FR")}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => onView(subcategory)}>
            <HugeiconsIcon icon={EyeIcon} className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(subcategory)}>
            <HugeiconsIcon icon={Edit01Icon} className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(subcategory.id)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <HugeiconsIcon
                icon={Loading03Icon}
                className="h-4 w-4 animate-spin"
              />
            ) : (
              <HugeiconsIcon
                icon={Delete01Icon}
                className="h-4 w-4 text-red-500"
              />
            )}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
