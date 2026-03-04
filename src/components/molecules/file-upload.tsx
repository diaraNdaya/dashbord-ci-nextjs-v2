"use client";
import { Button } from "@/components/ui/button";
import {
  Delete01Icon,
  Image01Icon,
  Upload01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploadProps {
  value: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  accept?: string;
  maxSizeMB?: number;
  onUploadSuccess?: (url: string) => void;
  onUploadError?: (error: string) => void;
}

export function ImageUploader({
  value = [],
  onChange,
  maxFiles = 1,
  accept = "image/*",
  maxSizeMB = 5,
  onUploadSuccess,
  onUploadError,
}: FileUploadProps) {
  const onDrop = useCallback(
    (
      acceptedFiles: File[],
      fileRejections: {
        file: File;
        errors: readonly { code: string; message: string }[];
      }[],
    ) => {
      fileRejections.forEach(({ file, errors }) => {
        errors.forEach((error) => {
          if (error.code === "file-too-large") {
            const errorMsg = `Fichier trop volumineux: ${file.name} (max ${maxSizeMB}MB)`;
            console.error(errorMsg);
            onUploadError?.(errorMsg);
          }
          if (error.code === "file-invalid-type") {
            const errorMsg = `Type de fichier non supporté: ${file.name}`;
            console.error(errorMsg);
            onUploadError?.(errorMsg);
          }
        });
      });

      // Gestion des fichiers acceptés
      const updatedFiles =
        maxFiles === 1
          ? acceptedFiles.slice(0, 1) // Remplace le fichier existant si maxFiles=1
          : [...value, ...acceptedFiles].slice(0, maxFiles); // Ajoute les nouveaux fichiers jusqu'à maxFiles

      onChange(updatedFiles);

      // Callback de succès pour chaque fichier accepté
      acceptedFiles.forEach((file) => {
        onUploadSuccess?.(URL.createObjectURL(file));
      });
    },
    [onChange, value, maxFiles, maxSizeMB, onUploadSuccess, onUploadError],
  );

  const removeFile = (index: number) => {
    const newFiles = [...value];
    newFiles.splice(index, 1);
    onChange(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [accept]: [] },
    maxSize: maxSizeMB * 1024 * 1024,
    maxFiles,
    multiple: maxFiles > 1, // Active le multiple seulement si maxFiles > 1
  });

  const formatAcceptTypes = () => {
    if (accept === "image/*") return "JPG, PNG, WEBP";
    return accept.split("/")[1]?.toUpperCase() || "Images";
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-violet-vif bg-violet-vif/10"
            : "border-muted hover:border-violet-vif/50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          <HugeiconsIcon
            icon={Upload01Icon}
            className={`h-8 w-8 ${
              isDragActive ? "text-violet-vif" : "text-muted-foreground"
            }`}
          />
          <p className="text-sm font-medium text-muted-foreground">
            {isDragActive
              ? "Déposez vos fichiers ici"
              : maxFiles === 1
                ? "Cliquez pour sélectionner un fichier"
                : `Cliquez pour sélectionner ou glissez-déposez (max ${maxFiles})`}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatAcceptTypes()} (max {maxSizeMB}MB par fichier)
          </p>
        </div>
      </div>

      {value.length > 0 && (
        <div
          className={`grid gap-3 ${
            maxFiles === 1 ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3"
          }`}
        >
          {value.map((file, index) => (
            <div key={`${file.name}-${index}`} className="relative group">
              <div className="aspect-square overflow-hidden rounded-md bg-muted border">
                {file.type.startsWith("image/") ? (
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-full w-full object-cover"
                    width={200}
                    height={200}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <HugeiconsIcon
                      icon={Image01Icon}
                      className="h-12 w-12 text-muted-foreground"
                    />
                  </div>
                )}
              </div>
              <div className="mt-1 text-xs truncate" title={file.name}>
                {file.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
              <Button
                variant="ghost"
                size="default"
                className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
              >
                <HugeiconsIcon icon={Delete01Icon} className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {value.length > 0 && maxFiles > 1 && (
        <p className="text-xs text-muted-foreground text-center">
          {value.length} / {maxFiles} fichier{value.length > 1 ? "s" : ""}{" "}
          sélectionné{value.length > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}

export default ImageUploader;
