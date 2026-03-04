import { DateDisplay } from "@/components/atoms/DateDisplay";
import { SafeImage } from "@/components/atoms/SafeImage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Banner } from "@/lib/types/banner.types";
import { Edit01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface BannerViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  banner: Banner | null;
  onEdit: (banner: Banner) => void;
}

export function BannerViewDialog({
  isOpen,
  onClose,
  banner,
  onEdit,
}: BannerViewDialogProps) {
  if (!banner) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Détails de la Bannière</DialogTitle>
          <DialogDescription>
            Informations complètes de la bannière
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Image */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Aperçu</label>
            <div className="border rounded-lg p-4 bg-white flex justify-center">
              <SafeImage
                src={banner.file_path}
                alt={banner.description}
                width={400}
                height={200}
                className="rounded-lg object-contain max-w-full h-auto"
              />
            </div>
          </div>

          {/* Informations */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Description
              </label>
              <p className="font-medium">{banner.description}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Provider
              </label>
              <p className="font-medium">{banner.provider}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Date de création
              </label>
              <p className="font-medium">
                <DateDisplay date={banner.createdAt} />
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button
            onClick={() => {
              onClose();
              onEdit(banner);
            }}
          >
            <HugeiconsIcon
              icon={Edit01Icon}
              strokeWidth={2}
              className="h-4 w-4 mr-2"
            />
            Modifier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
