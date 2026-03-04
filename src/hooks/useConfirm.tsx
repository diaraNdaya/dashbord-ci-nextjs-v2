"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { useCallback, useState } from "react";

interface ConfirmOptions {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "default";
  icon?: boolean;
}

interface ConfirmState {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  variant: "destructive" | "default";
  showIcon: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function useConfirm() {
  const [state, setState] = useState<ConfirmState>({
    isOpen: false,
    title: "",
    description: "",
    confirmText: "Confirmer",
    cancelText: "Annuler",
    variant: "destructive",
    showIcon: true,
    onConfirm: () => {},
    onCancel: () => {},
  });

  const confirm = useCallback(
    (options: ConfirmOptions = {}): Promise<boolean> => {
      return new Promise((resolve) => {
        setState({
          isOpen: true,
          title: options.title || "Confirmer l'action",
          description:
            options.description || "Êtes-vous sûr de vouloir continuer ?",
          confirmText: options.confirmText || "Confirmer",
          cancelText: options.cancelText || "Annuler",
          variant: options.variant || "destructive",
          showIcon: options.icon !== false,
          onConfirm: () => {
            setState((prev) => ({ ...prev, isOpen: false }));
            resolve(true);
          },
          onCancel: () => {
            setState((prev) => ({ ...prev, isOpen: false }));
            resolve(false);
          },
        });
      });
    },
    [],
  );

  // Méthodes prédéfinies pour les cas courants
  const confirmDelete = useCallback(
    (itemName?: string): Promise<boolean> => {
      return confirm({
        title: "Confirmer la suppression",
        description: itemName
          ? `Êtes-vous sûr de vouloir supprimer "${itemName}" ? Cette action est irréversible.`
          : "Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.",
        confirmText: "Supprimer",
        cancelText: "Annuler",
        variant: "destructive",
        icon: true,
      });
    },
    [confirm],
  );

  const confirmLogout = useCallback((): Promise<boolean> => {
    return confirm({
      title: "Confirmer la déconnexion",
      description: "Êtes-vous sûr de vouloir vous déconnecter ?",
      confirmText: "Se déconnecter",
      cancelText: "Rester connecté",
      variant: "default",
      icon: false,
    });
  }, [confirm]);

  const confirmDiscard = useCallback((): Promise<boolean> => {
    return confirm({
      title: "Abandonner les modifications",
      description:
        "Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir les abandonner ?",
      confirmText: "Abandonner",
      cancelText: "Continuer l'édition",
      variant: "destructive",
      icon: true,
    });
  }, [confirm]);

  const ConfirmDialog = () => (
    <Dialog
      open={state.isOpen}
      onOpenChange={(open) => !open && state.onCancel()}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {state.showIcon && state.variant === "destructive" && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
            )}
            <div className="flex-1">
              <DialogTitle>{state.title}</DialogTitle>
              <DialogDescription className="mt-1">
                {state.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline" onClick={state.onCancel}>
              {state.cancelText}
            </Button>
          </DialogClose>
          <Button variant={state.variant} onClick={state.onConfirm}>
            {state.confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return {
    confirm,
    confirmDelete,
    confirmLogout,
    confirmDiscard,
    ConfirmDialog,
  };
}
