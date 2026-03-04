import { Button } from "@/components/ui/button";
import { Image01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface BannerEmptyStateProps {
  searchTerm: string;
  onCreateClick: () => void;
}

export function BannerEmptyState({
  searchTerm,
  onCreateClick,
}: BannerEmptyStateProps) {
  return (
    <div className="text-center py-8">
      <HugeiconsIcon
        icon={Image01Icon}
        strokeWidth={1}
        className="h-12 w-12 text-muted-foreground mx-auto mb-4"
      />
      <p className="text-muted-foreground mb-4">
        {searchTerm
          ? "Aucun banner trouvé pour cette recherche"
          : "Aucun banner trouvé"}
      </p>
      <Button onClick={onCreateClick} variant="outline">
        Créer le premier banner
      </Button>
    </div>
  );
}
