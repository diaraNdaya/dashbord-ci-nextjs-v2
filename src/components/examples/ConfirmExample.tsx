"use client";

import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/useConfirm";

export function ConfirmExample() {
  const {
    confirm,
    confirmDelete,
    confirmLogout,
    confirmDiscard,
    ConfirmDialog,
  } = useConfirm();

  const handleCustomConfirm = async () => {
    const result = await confirm({
      title: "Action personnalisée",
      description: "Voulez-vous vraiment effectuer cette action ?",
      confirmText: "Oui, continuer",
      cancelText: "Non, annuler",
      variant: "default",
    });

    if (result) {
      alert("Action confirmée");
    } else {
      alert("Action annulée");
    }
  };

  const handleDelete = async () => {
    const result = await confirmDelete("cette bannière");

    if (result) {
      alert("Suppression confirmée");
      // Logique de suppression ici
    }
  };

  const handleLogout = async () => {
    const result = await confirmLogout();

    if (result) {
      alert("Déconnexion confirmée");
      // Logique de déconnexion ici
    }
  };

  const handleDiscard = async () => {
    const result = await confirmDiscard();

    if (result) {
      alert("Modifications abandonnées");
      // Logique d'abandon ici
    }
  };

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-xl font-semibold">Exemples de confirmation</h2>

      <div className="flex flex-wrap gap-3">
        <Button onClick={handleCustomConfirm} variant="outline">
          Confirmation personnalisée
        </Button>

        <Button onClick={handleDelete} variant="destructive">
          Supprimer un élément
        </Button>

        <Button onClick={handleLogout} variant="secondary">
          Se déconnecter
        </Button>

        <Button onClick={handleDiscard} variant="outline">
          Abandonner les modifications
        </Button>
      </div>

      {/* Le dialog de confirmation */}
      <ConfirmDialog />
    </div>
  );
}
