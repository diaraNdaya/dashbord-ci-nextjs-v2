import { BannerForm } from "@/components/organisms/BannerForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { BannerFormData } from "@/lib/schemas/banner.schema";
import type { UseFormReturn } from "react-hook-form";

interface BannerCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  form: UseFormReturn<BannerFormData>;
  onSubmit: (data: BannerFormData) => void;
  isSubmitting: boolean;
}

export function BannerCreateDialog({
  isOpen,
  onClose,
  form,
  onSubmit,
  isSubmitting,
}: BannerCreateDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une Nouvelle Bannière</DialogTitle>
          <DialogDescription>
            Ajouter une nouvelle bannière publicitaire
          </DialogDescription>
        </DialogHeader>
        <BannerForm
          form={form}
          onSubmit={onSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          isEditing={false}
        />
      </DialogContent>
    </Dialog>
  );
}
