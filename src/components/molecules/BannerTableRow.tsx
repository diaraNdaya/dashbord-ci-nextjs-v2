import { SafeImage } from "@/components/atoms/SafeImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Banner } from "@/lib/types/banner.types";
import {
  Delete01Icon,
  Edit01Icon,
  EyeIcon,
  Image01Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";
import { DateDisplay } from "../atoms/DateDisplay";

interface BannerTableRowProps {
  banner: Banner;
  index: number;
  onView: (banner: Banner) => void;
  onEdit: (banner: Banner) => void;
  onDelete: (banner: Banner) => void;
  isDeleting: boolean;
}

export function BannerTableRow({
  banner,
  index,
  onView,
  onEdit,
  onDelete,
  isDeleting,
}: BannerTableRowProps) {
  return (
    <motion.div
      key={banner.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 * index }}
      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded bg-primary/10 overflow-hidden">
          {banner.file_path ? (
            <SafeImage
              src={banner.file_path}
              alt={banner.description}
              width={48}
              height={48}
              className="object-cover rounded"
            />
          ) : (
            <HugeiconsIcon
              icon={Image01Icon}
              strokeWidth={2}
              className="h-6 w-6 text-primary"
            />
          )}
        </div>
        <div>
          <div className="font-medium">{banner.description}</div>
          <div className="text-sm text-muted-foreground">
            Provider: {banner.provider}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Créé le <DateDisplay date={banner.createdAt} />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="default">Actif</Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onView(banner)}
          title="Voir les détails"
        >
          <HugeiconsIcon icon={EyeIcon} strokeWidth={2} className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(banner)}
          title="Modifier"
        >
          <HugeiconsIcon
            icon={Edit01Icon}
            strokeWidth={2}
            className="h-4 w-4"
          />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(banner)}
          title="Supprimer"
          disabled={isDeleting}
        >
          {isDeleting ? (
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
  );
}
