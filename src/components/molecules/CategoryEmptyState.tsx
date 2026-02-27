"use client";

import { Button } from "@/components/ui/button";
import { Add01Icon, Folder01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface CategoryEmptyStateProps {
  onCreateClick: () => void;
  title?: string;
  description?: string;
  buttonText?: string;
}

export function CategoryEmptyState({
  onCreateClick,
  title = "Aucune catégorie",
  description = "Commencez par créer votre première catégorie",
  buttonText = "Créer une catégorie",
}: CategoryEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <HugeiconsIcon
        icon={Folder01Icon}
        className="h-12 w-12 text-muted-foreground mb-4"
      />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <Button
        onClick={onCreateClick}
        className="bg-violet-vif hover:bg-violet-vif/90"
      >
        <HugeiconsIcon icon={Add01Icon} className="h-4 w-4 mr-2" />
        {buttonText}
      </Button>
    </div>
  );
}
