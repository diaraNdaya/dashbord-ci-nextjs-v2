import { BannerForm } from "@/components/organisms/BannerForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { BannerFormData } from "@/lib/schemas/banner.schema";
import type { Banner } from "@/lib/types/banner.types";
import type { UseFormReturn } from "react-hook-form";

interface BannerEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  form: UseFormReturn<BannerFormData>;
  onSubmit: (data: BannerFormData) => void;
  isSubmitting: boolean;
  selectedBanner: Banner | null;
}

export function BannerEditDialog({
  isOpen,
  onClose,
  form,
  onSubmit,
  isSubmitting,
  selectedBanner,
}: BannerEditDialogProps) {
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier la Bannière</DialogTitle>
          <DialogDescription>
            Mettre à jour les informations de la bannière
          </DialogDescription>
        </DialogHeader>
        <BannerForm
          form={form}
          onSubmit={onSubmit}
          onCancel={handleClose}
          isSubmitting={isSubmitting}
          isEditing={true}
          selectedBanner={selectedBanner}
        />
      </DialogContent>
    </Dialog>
  );
}
