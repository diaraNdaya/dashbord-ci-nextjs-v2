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
  Subcategory,
  SubcategoryCredentials,
  SubcategoryUpdateParams,
} from "@/lib/types/categories.types";
import {
  createSubCategoryMutationOptions,
  getAllCategoriesQueryOptions,
  updateSubCategoryMutationOptions,
  uploadFileMutationOptions,
} from "@/services/queries/categories.queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
      message:
        "Le nom de la sous-catégorie doit contenir au moins 2 caractères",
    })
    .min(2, {
      message:
        "Le nom de la sous-catégorie doit contenir au moins 2 caractères",
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
  category_id: z
    .string({
      message: "Veuillez sélectionner une catégorie parent",
    })
    .min(1, {
      message: "La catégorie parent est requise",
    }),
  image: z
    .custom<File>((v) => v === null || v === undefined || isFile(v), {
      message: "Fichier invalide",
    })
    .nullable()
    .optional(),
});

const updateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  type: z.string().optional(),
  category_id: z.string().optional(),
  image: z
    .custom<File>((v) => v === null || v === undefined || isFile(v), {
      message: "Fichier invalide",
    })
    .nullable()
    .optional(),
});

type CreateValues = z.infer<typeof createSchema>;
type UpdateValues = z.infer<typeof updateSchema>;
type FormValues = CreateValues | UpdateValues;

interface SubcategoryFormProps {
  subcategory?: Subcategory | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateAndUpdateSubcategoryForm({
  subcategory,
  onClose,
  onSuccess,
}: SubcategoryFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditing = Boolean(subcategory?.id);

  const schema = useMemo(
    () => (isEditing ? updateSchema : createSchema),
    [isEditing],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      name: subcategory?.name ?? "",
      description: subcategory?.description ?? "",
      type: subcategory?.type ?? "",
      category_id: subcategory?.category_id ?? "",
      image: null,
    } as FormValues,
  });

  // Récupérer les catégories pour le select
  const { data: categoriesData } = useQuery(
    getAllCategoriesQueryOptions(1, 100), // Récupérer toutes les catégories
  );

  const categories = (categoriesData as any)?.success
    ? (categoriesData as any)?.data
    : [];

  const uploadMutation = useMutation(uploadFileMutationOptions());

  const createMutation = useMutation({
    ...createSubCategoryMutationOptions(),
    mutationFn: async (values: CreateValues) => {
      console.log("=== CREATE SUBCATEGORY START ===");
      console.log("Values received:", values);

      let imageUrl = "";

      if (values.image && isFile(values.image)) {
        console.log("Uploading image...");

        const uploadResponse = await uploadMutation.mutateAsync({
          file: values.image,
        });

        if (uploadResponse?.success) {
          imageUrl = (uploadResponse as any)?.data?.url;
          console.log("Image uploaded:", imageUrl);
        } else {
          console.error("Failed to upload image:", uploadResponse);
          toastErr(
            uploadResponse.message || "Erreur lors de l'upload de l'image",
          );
          throw new Error(
            uploadResponse.message || "Erreur lors de l'upload de l'image",
          );
        }
      }

      const subcategoryData: SubcategoryCredentials = {
        name: values.name.trim(),
        description: values.description.trim(),
        type: values.type,
        category_id: values.category_id,
        url: imageUrl,
      };

      console.log("Final subcategory data:", subcategoryData);

      return await createSubCategoryMutationOptions().mutationFn(
        subcategoryData,
      );
    },
    onSuccess: (data) => {
      console.log("=== CREATE SUCCESS ===");
      console.log("Response:", data);

      if (data?.success) {
        toastSuccess("Sous-catégorie créée avec succès");
        queryClient.invalidateQueries({ queryKey: ["subcategories"] });
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
    ...updateSubCategoryMutationOptions(),
    mutationFn: async (values: UpdateValues) => {
      console.log("=== UPDATE SUBCATEGORY START ===");
      console.log("Values received:", values);

      if (!subcategory?.id) {
        toastErr("ID de sous-catégorie manquant");
        return;
      }

      let finalUrl = subcategory.url || "";
      if (values.image && isFile(values.image)) {
        console.log("Uploading new image...");

        const uploadResponse = await uploadMutation.mutateAsync({
          file: values.image,
        });

        if (uploadResponse.success) {
          finalUrl = (uploadResponse as any).data.url;
          console.log("New image uploaded:", finalUrl);
        } else {
          console.error("Failed to upload image:", uploadResponse);
          toastErr(
            uploadResponse.message || "Erreur lors de l'upload de l'image",
          );
          throw new Error(
            uploadResponse.message || "Erreur lors de l'upload de l'image",
          );
        }
      }

      const finalName =
        typeof values.name === "string" && values.name.trim() !== ""
          ? values.name.trim()
          : subcategory.name;

      const finalDescription =
        typeof values.description === "string" &&
        values.description.trim() !== ""
          ? values.description.trim()
          : subcategory.description;

      const finalType =
        typeof values.type === "string" && values.type.trim() !== ""
          ? values.type.trim()
          : subcategory.type;

      const finalCategoryId =
        typeof values.category_id === "string" &&
        values.category_id.trim() !== ""
          ? values.category_id.trim()
          : subcategory.category_id;

      const filledPayload: SubcategoryUpdateParams = {
        name: finalName,
        description: finalDescription,
        type: finalType,
        url: finalUrl,
        category_id: finalCategoryId,
      };

      console.log("Final update payload:", filledPayload);

      return await updateSubCategoryMutationOptions().mutationFn({
        id: subcategory.id,
        data: filledPayload,
      });
    },
    onSuccess: (data) => {
      console.log("=== UPDATE SUCCESS ===");
      console.log("Response:", data);

      if (data?.success) {
        toastSuccess("Sous-catégorie modifiée avec succès");
        queryClient.invalidateQueries({ queryKey: ["subcategories"] });
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
        className="w-[95%] 
    sm:max-w-lg 
    md:max-w-2xl 
    lg:max-w-4xl overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Modifier la sous-catégorie"
              : "Créer une nouvelle sous-catégorie"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifiez les informations de la sous-catégorie"
              : "Ajoutez une nouvelle sous-catégorie avec ses informations"}
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
                  <FieldLabel htmlFor="name">
                    Nom de la sous-catégorie
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id="name"
                      placeholder="Ex: Smartphones"
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
                <FieldLabel htmlFor="category_id">Catégorie parent</FieldLabel>
                <FieldContent>
                  <Select
                    value={form.watch("category_id") || ""}
                    onValueChange={(value) =>
                      form.setValue("category_id", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category: Category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError
                    errors={
                      form.formState.errors.category_id
                        ? [form.formState.errors.category_id]
                        : []
                    }
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <FieldContent>
                  <Textarea
                    id="description"
                    placeholder="Description détaillée de la sous-catégorie..."
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
              {/* Image */}
              <Field>
                <FieldLabel>Image de la sous-catégorie</FieldLabel>
                <FieldContent>
                  <ImageUploader
                    value={(() => {
                      const image = form.watch("image");
                      return image ? [image] : [];
                    })()}
                    onChange={(files) => {
                      const file = files[0];
                      if (file) {
                        form.setValue("image", file);
                        form.clearErrors("image");
                      }
                    }}
                    maxFiles={1}
                    maxSizeMB={10}
                    accept="image/*"
                    onUploadSuccess={(url) =>
                      console.log("Image sélectionnée:", url)
                    }
                    onUploadError={(error) =>
                      console.error("Erreur sélection image:", error)
                    }
                  />
                  <FieldDescription>
                    Cette image sera utilisée pour représenter la sous-catégorie
                  </FieldDescription>
                  {subcategory?.url && !form.watch("image") && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm text-muted-foreground font-medium">
                        Image actuelle :
                      </p>
                      <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-violet-vif/20">
                        <SafeImage
                          src={subcategory.url}
                          alt="Image actuelle"
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
                      form.formState.errors.image
                        ? [form.formState.errors.image]
                        : []
                    }
                  />
                </FieldContent>
              </Field>
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
                "Modifier la sous-catégorie"
              ) : (
                "Créer la sous-catégorie"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
