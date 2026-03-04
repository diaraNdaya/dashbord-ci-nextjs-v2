import { SafeImage } from "@/components/atoms/SafeImage";
import ImageUploader from "@/components/molecules/file-upload";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { BannerFormData } from "@/lib/schemas/banner.schema";
import type { Banner } from "@/lib/types/banner.types";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { UseFormReturn } from "react-hook-form";

interface BannerFormProps {
  form: UseFormReturn<BannerFormData>;
  onSubmit: (data: BannerFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isEditing?: boolean;
  selectedBanner?: Banner | null;
}

export function BannerForm({
  form,
  onSubmit,
  onCancel,
  isSubmitting,
  isEditing = false,
  selectedBanner,
}: BannerFormProps) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Field>
        <FieldLabel>Image de la bannière</FieldLabel>
        <FieldContent>
          <ImageUploader
            value={(() => {
              const image = form.watch("image");
              return image ? [image] : [];
            })()}
            onChange={(files: File[]) => {
              const file = files[0];
              if (file) {
                form.setValue("image", file);
                form.clearErrors("image");
              }
            }}
            maxFiles={1}
            maxSizeMB={10}
            accept="image/*"
            onUploadSuccess={(url: string) =>
              console.log("Image de bannière sélectionnée:", url)
            }
            onUploadError={(error: string) =>
              console.error("Erreur sélection image bannière:", error)
            }
          />
          {isEditing && selectedBanner?.file_path && !form.watch("image") && (
            <div className="mt-3 space-y-2">
              <p className="text-sm text-muted-foreground font-medium">
                Image actuelle :
              </p>
              <div className="w-32 h-20 rounded-lg overflow-hidden border-2 border-violet-vif/20">
                <SafeImage
                  src={selectedBanner.file_path}
                  alt="Image actuelle de la bannière"
                  className="w-full h-full object-cover"
                  width={128}
                  height={80}
                  fallbackClassName="w-32 h-20 rounded-lg"
                />
              </div>
            </div>
          )}
          <FieldError>{form.formState.errors.image?.message}</FieldError>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Description</FieldLabel>
        <FieldContent>
          <Textarea
            placeholder="Description de la bannière..."
            {...form.register("description")}
          />
          <FieldError>{form.formState.errors.description?.message}</FieldError>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Lien du Produit (optionnel)</FieldLabel>
        <FieldContent>
          <Input
            placeholder="https://example.com/product"
            {...form.register("productLink")}
          />
          <FieldError>{form.formState.errors.productLink?.message}</FieldError>
        </FieldContent>
      </Field>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <HugeiconsIcon
                icon={Loading03Icon}
                strokeWidth={2}
                className="h-4 w-4 mr-2 animate-spin"
              />
              {isEditing ? "Mise à jour..." : "Création..."}
            </>
          ) : isEditing ? (
            "Mettre à jour"
          ) : (
            "Créer"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
