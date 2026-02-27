"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type {
  Category,
  CategoryCredentials,
} from "@/lib/types/categories.types";
import {
  createCategoryMutationOptions,
  updateCategoryMutationOptions,
  uploadFileMutationOptions,
} from "@/services/queries/categories.queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { SafeImage } from "../atoms/SafeImage";
import { ImageUploader } from "../molecules/file-upload";
import { toastErr, toastSuccess } from "../molecules/ToastCard";

const isFile = (v: unknown): v is File =>
  typeof File !== "undefined" && v instanceof File;

const createSchema = z.object({
  name: z
    .string({
      message: "Le nom de la catégorie doit contenir au moins 2 caractères",
    })
    .min(2, {
      message: "Le nom de la catégorie doit contenir au moins 2 caractères",
    }),
  description: z.string().min(2, {
    message: "La description doit contenir au moins 2 caractères",
  }),
  type: z
    .string({
      message: "Veuillez sélectionner un type",
    })
    .min(1, {
      message: "Le type est requis",
    }),
  mainImage: z
    .custom<File>((v) => v === null || v === undefined || isFile(v), {
      message: "Fichier invalide",
    })
    .nullable()
    .optional(),
  additionalImages: z
    .array(
      z.custom<File>((v) => isFile(v), {
        message: "Fichier invalide",
      }),
    )
    .optional()
    .default([]),
});

const updateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  type: z.string().optional(),
  mainImage: z
    .custom<File>((v) => v === null || v === undefined || isFile(v), {
      message: "Fichier invalide",
    })
    .nullable()
    .optional(),
  additionalImages: z
    .array(z.custom<File>((v) => isFile(v)))
    .max(0)
    .optional()
    .default([]),
});

type CreateValues = z.infer<typeof createSchema>;
type UpdateValues = z.infer<typeof updateSchema>;
type FormValues = CreateValues | UpdateValues;

interface CategoryFormProps {
  category?: Category | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateAndUpdateCategoryForm({
  category,
  onClose,
  onSuccess,
}: CategoryFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditing = Boolean(category?.id);

  const schema = useMemo(
    () => (isEditing ? updateSchema : createSchema),
    [isEditing],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      name: category?.name ?? "",
      description: category?.description ?? "",
      type: category?.type ?? "",
      mainImage: null,
      additionalImages: [],
    } as FormValues,
  });

  const uploadMutation = useMutation(uploadFileMutationOptions());

  const createMutation = useMutation({
    ...createCategoryMutationOptions(),
    mutationFn: async (values: CreateValues) => {
      console.log("=== CREATE MUTATION START ===");
      console.log("Values received:", values);

      let mainImageUrl = "";
      const additionalImageUrls: string[] = [];

      if (values.mainImage && isFile(values.mainImage)) {
        console.log("Uploading main image...");

        const uploadResponse = await uploadMutation.mutateAsync({
          file: values.mainImage,
        });

        console.log("dataResponseUplaod", uploadResponse);

        if (uploadResponse?.success) {
          mainImageUrl = (uploadResponse as any)?.data?.url;
          console.log("Main image uploaded:", mainImageUrl);
          // Pas de toast de succès pour l'upload individuel
        } else {
          console.error("Failed to upload main image:", uploadResponse);
          toastErr(
            uploadResponse.message ||
              "Erreur lors de l'upload de l'image principale",
          );
          throw new Error(
            uploadResponse.message ||
              "Erreur lors de l'upload de l'image principale",
          );
        }
      }

      if (
        Array.isArray(values.additionalImages) &&
        values.additionalImages.length > 0
      ) {
        for (let i = 0; i < values.additionalImages.length; i++) {
          const uploadResponse = await uploadMutation.mutateAsync({
            file: values.additionalImages[i],
          });

          console.log("uploadResponse", uploadResponse);

          if (uploadResponse?.success) {
            additionalImageUrls.push((uploadResponse as any)?.data?.url);
            console.log(
              `Image ${i + 1}/${values.additionalImages.length} uploaded:`,
              (uploadResponse as any)?.data?.url,
            );
          } else {
            console.error(
              `Failed to upload additional image ${i + 1}:`,
              uploadResponse,
            );
            toastErr(
              uploadResponse.message ||
                `Erreur lors de l'upload de l'image ${i + 1}`,
            );
            throw new Error(
              uploadResponse.message ||
                `Erreur lors de l'upload de l'image ${i + 1}`,
            );
          }
        }

        // Pas de toast de succès pour les uploads individuels
      }

      const categoryData: CategoryCredentials = {
        name: values.name.trim(),
        description: values.description.trim(),
        type: values.type,
        url: mainImageUrl,
        images: additionalImageUrls,
      };

      console.log("Final category data (URLs only):", categoryData);
      console.log(
        "Category data size:",
        JSON.stringify(categoryData).length,
        "bytes",
      );

      return await createCategoryMutationOptions().mutationFn(categoryData);
    },
    onSuccess: (data) => {
      console.log("=== CREATE SUCCESS ===");
      console.log("Response:", data);

      if (data?.success) {
        toastSuccess("Catégorie créée avec succès");
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        onClose();
        onSuccess?.();
        router.refresh();
      } else {
        console.error("Create failed:", data);
        toastErr(data?.message || "Erreur lors de la création");
      }
    },
    onError: (error: unknown) => {
      console.error("=== CREATE ERROR ===");
      console.error("Error:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "Une erreur est survenue lors de la création";

      toastErr(errorMessage);
    },
  });

  const updateMutation = useMutation({
    ...updateCategoryMutationOptions(),
    mutationFn: async (values: UpdateValues) => {
      console.log("=== UPDATE MUTATION START ===");
      console.log("Values received:", values);

      if (!category?.id) {
        toastErr("ID de catégorie manquant");
        return;
      }

      let finalUrl = category.url || "";
      if (values.mainImage && isFile(values.mainImage)) {
        console.log("Uploading new main image...");

        const uploadResponse = await uploadMutation.mutateAsync({
          file: values.mainImage,
        });

        if (uploadResponse.success) {
          finalUrl = (uploadResponse as any).data.url;
          console.log("New main image uploaded:", finalUrl);
          // Pas de toast de succès pour l'upload - seulement le toast final
        } else {
          console.error("Failed to upload main image:", uploadResponse);
          toastErr(
            uploadResponse.message ||
              "Erreur lors de l'upload de l'image principale",
          );
          throw new Error(
            uploadResponse.message ||
              "Erreur lors de l'upload de l'image principale",
          );
        }
      }

      const finalName =
        typeof values.name === "string" && values.name.trim() !== ""
          ? values.name.trim()
          : category.name;

      const finalDescription =
        typeof values.description === "string" &&
        values.description.trim() !== ""
          ? values.description.trim()
          : category.description;

      const finalType =
        typeof values.type === "string" && values.type.trim() !== ""
          ? values.type.trim()
          : category.type;

      const finalImages = category.images ?? [];

      const filledPayload: CategoryCredentials = {
        name: finalName,
        description: finalDescription,
        type: finalType,
        url: finalUrl,
        images: finalImages,
      };

      console.log("Final update payload:", filledPayload);
      console.log(
        "Update payload size:",
        JSON.stringify(filledPayload).length,
        "bytes",
      );

      // Utiliser la mutation function originale
      return await updateCategoryMutationOptions().mutationFn({
        id: category.id,
        data: filledPayload,
      });
    },
    onSuccess: (data) => {
      console.log("=== UPDATE SUCCESS ===");
      console.log("Response:", data);

      if (data?.success) {
        toastSuccess("Catégorie modifiée avec succès");
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        onClose();
        onSuccess?.();
        router.refresh();
      } else {
        console.error("Update failed:", data);
        toastErr(data?.message || "Erreur lors de la modification");
      }
    },
    onError: (error: unknown) => {
      console.error("=== UPDATE ERROR ===");
      console.error("Error:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "Une erreur est survenue lors de la modification";

      toastErr(errorMessage);
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log("=== FORM SUBMISSION DEBUG ===");
    console.log("Form values:", values);
    console.log("Form errors:", form.formState.errors);
    console.log("Is editing:", isEditing);
    console.log("Is valid:", form.formState.isValid);

    const allFiles = [
      ...(values.mainImage ? [values.mainImage] : []),
      ...(values.additionalImages || []),
    ].filter(Boolean) as File[];

    const totalSize = allFiles.reduce((total, file) => total + file.size, 0);

    console.log(
      "Total files size:",
      (totalSize / 1024 / 1024).toFixed(2),
      "MB",
    );

    if (totalSize > 50 * 1024 * 1024) {
      toastErr("Les fichiers sont trop volumineux (max 50MB au total)");
      return;
    }

    if (isEditing) {
      console.log("Calling update mutation...");
      updateMutation.mutate(values as UpdateValues);
    } else {
      console.log("Calling create mutation...");
      createMutation.mutate(values as CreateValues);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className=" w-[95%] 
    sm:max-w-lg 
    md:max-w-2xl 
    lg:max-w-4xl overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Modifier la catégorie"
              : "Créer une nouvelle catégorie"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifiez les informations de la catégorie"
              : "Ajoutez une nouvelle catégorie avec ses informations et images"}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            console.log("=== FORM SUBMIT EVENT ===");
            console.log("Event:", e);
            form.handleSubmit(onSubmit)(e);
          }}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="name">Nom de la catégorie</FieldLabel>
                  <FieldContent>
                    <Input
                      id="name"
                      placeholder="Ex: Électronique"
                      {...form.register("name")}
                    />
                    <FieldError
                      errors={
                        form.formState.errors.name
                          ? [form.formState.errors.name]
                          : []
                      }
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="type">Type</FieldLabel>
                  <FieldContent>
                    <Select
                      value={form.watch("type") || ""}
                      onValueChange={(value) => form.setValue("type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cosmetic">Cosmétique</SelectItem>
                        <SelectItem value="fashion">Mode</SelectItem>
                        <SelectItem value="electronics">
                          Électronique
                        </SelectItem>
                        <SelectItem value="home">Maison</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="books">Livres</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError
                      errors={
                        form.formState.errors.type
                          ? [form.formState.errors.type]
                          : []
                      }
                    />
                  </FieldContent>
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <FieldContent>
                  <Textarea
                    id="description"
                    placeholder="Description détaillée de la catégorie..."
                    className="min-h-[120px]"
                    {...form.register("description")}
                  />
                  <FieldError
                    errors={
                      form.formState.errors.description
                        ? [form.formState.errors.description]
                        : []
                    }
                  />
                </FieldContent>
              </Field>
            </div>

            <div className="space-y-6">
              {/* Image principale */}
              <Field>
                <FieldLabel>Image principale</FieldLabel>
                <FieldContent>
                  <ImageUploader
                    value={(() => {
                      const mainImage = form.watch("mainImage");
                      return mainImage ? [mainImage] : [];
                    })()}
                    onChange={(files) => {
                      const file = files[0];
                      if (file) {
                        form.setValue("mainImage", file);
                        form.clearErrors("mainImage");
                      }
                    }}
                    maxFiles={1}
                    maxSizeMB={10}
                    accept="image/*"
                    onUploadSuccess={(url) =>
                      console.log("Image principale sélectionnée:", url)
                    }
                    onUploadError={(error) =>
                      console.error("Erreur sélection image principale:", error)
                    }
                  />
                  <FieldDescription>
                    Cette image sera utilisée comme image principale (champ url)
                  </FieldDescription>
                  {category?.url && !form.watch("mainImage") && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm text-muted-foreground font-medium">
                        Image principale actuelle :
                      </p>
                      <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-violet-vif/20">
                        <SafeImage
                          src={category.url}
                          alt="Image principale actuelle"
                          className="w-full h-full object-cover"
                          width={96}
                          height={96}
                          fallbackClassName="w-24 h-24 rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                  <FieldError
                    errors={
                      form.formState.errors.mainImage
                        ? [form.formState.errors.mainImage]
                        : []
                    }
                  />
                </FieldContent>
              </Field>

              {/* Images supplémentaires (seulement en création) */}
              {!isEditing && (
                <Field>
                  <FieldLabel>Images supplémentaires</FieldLabel>
                  <FieldContent>
                    <ImageUploader
                      value={form.watch("additionalImages") || []}
                      onChange={(files) => {
                        form.setValue("additionalImages", files);
                        form.clearErrors("additionalImages");
                      }}
                      maxFiles={4}
                      maxSizeMB={10}
                      accept="image/*"
                      onUploadSuccess={(url) =>
                        console.log(
                          "Images supplémentaires sélectionnées:",
                          url,
                        )
                      }
                      onUploadError={(error) =>
                        console.error(
                          "Erreur sélection images supplémentaires:",
                          error,
                        )
                      }
                    />
                    <FieldDescription>
                      Sélectionnez des images supplémentaires (optionnel, max 4
                      images)
                    </FieldDescription>
                    <FieldError
                      errors={
                        form.formState.errors.additionalImages
                          ? [form.formState.errors.additionalImages]
                          : []
                      }
                    />
                  </FieldContent>
                </Field>
              )}

              {/* Affichage des images supplémentaires en édition */}
              {isEditing && (
                <div className="space-y-3">
                  <p className="text-sm font-medium">Images supplémentaires</p>
                  {category?.images?.length ? (
                    <>
                      <p className="text-xs text-muted-foreground">
                        Ces images ne peuvent pas être modifiées ici.
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        {category.images.map((url, index) => (
                          <figure
                            key={index}
                            className="relative rounded-lg overflow-hidden border"
                            aria-label={`Image supplémentaire ${index + 1}`}
                          >
                            <SafeImage
                              src={url}
                              alt={`Image supplémentaire ${index + 1}`}
                              className="w-full h-20 object-cover"
                              width={120}
                              height={80}
                              fallbackClassName="w-full h-20"
                            />
                            <figcaption className="absolute top-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                              {index + 1}
                            </figcaption>
                          </figure>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Aucune image supplémentaire enregistrée.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-violet-vif hover:bg-violet-vif/90 min-w-[140px]"
              onClick={() => {
                console.log("=== SUBMIT BUTTON CLICKED ===");
                console.log("Form state:", {
                  isValid: form.formState.isValid,
                  errors: form.formState.errors,
                  values: form.getValues(),
                  isSubmitting,
                });
              }}
            >
              {isSubmitting ? (
                <>
                  <HugeiconsIcon
                    icon={Loading03Icon}
                    className="h-4 w-4 mr-2 animate-spin"
                  />
                  {isEditing ? "Modification..." : "Création..."}
                </>
              ) : isEditing ? (
                "Modifier la catégorie"
              ) : (
                "Créer la catégorie"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
