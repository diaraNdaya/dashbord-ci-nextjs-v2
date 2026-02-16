"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { meQueryOptions } from "@/services/queries/auth.queries";
import {
  Calendar01Icon,
  Edit01Icon,
  Location01Icon,
  Mail01Icon,
  User02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";

export default function ProfileTemplate() {
  const { data: currentUser, isLoading } = useQuery(meQueryOptions());

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!currentUser) {
    return <div>Utilisateur non trouvé</div>;
  }

  return (
    <motion.div
      className="flex flex-1 flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="@container/main flex flex-1 flex-col gap-4 p-4 lg:p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <HugeiconsIcon
                icon={User02Icon}
                strokeWidth={2}
                className="h-5 w-5 text-primary"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Mon profil</h1>
              <p className="text-muted-foreground">
                Gérer vos informations personnelles
              </p>
            </div>
          </div>
          <Button>
            <HugeiconsIcon
              icon={Edit01Icon}
              strokeWidth={2}
              className="h-4 w-4 mr-2"
            />
            Modifier
          </Button>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>Vos informations de base</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Nom d&apos;utilisateur</Label>
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={User02Icon}
                      strokeWidth={2}
                      className="h-4 w-4 text-muted-foreground"
                    />
                    <Input
                      id="username"
                      value={currentUser.username}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={Mail01Icon}
                      strokeWidth={2}
                      className="h-4 w-4 text-muted-foreground"
                    />
                    <Input
                      id="email"
                      value={currentUser.email}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={Mail01Icon}
                      strokeWidth={2}
                      className="h-4 w-4 text-muted-foreground"
                    />
                    <Input
                      id="phone"
                      value={currentUser.phone_number || "Non renseigné"}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Informations complémentaires</CardTitle>
                <CardDescription>
                  Détails supplémentaires de votre profil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={Location01Icon}
                      strokeWidth={2}
                      className="h-4 w-4 text-muted-foreground"
                    />
                    <Input
                      id="city"
                      value={currentUser.city || "Non renseigné"}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Pays</Label>
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={Location01Icon}
                      strokeWidth={2}
                      className="h-4 w-4 text-muted-foreground"
                    />
                    <Input
                      id="country"
                      value={currentUser.country || "Non renseigné"}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthdate">Date de naissance</Label>
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={Calendar01Icon}
                      strokeWidth={2}
                      className="h-4 w-4 text-muted-foreground"
                    />
                    <Input
                      id="birthdate"
                      value={currentUser.dateOfBirth || "Non renseigné"}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Account Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Statut du compte</CardTitle>
              <CardDescription>Informations sur votre compte</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="text-sm font-medium">Rôle</div>
                  <div className="text-2xl font-bold text-primary">
                    {currentUser.role?.name || "Non défini"}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Statut</div>
                  <div
                    className={`text-2xl font-bold ${currentUser.is_active ? "text-green-600" : "text-red-600"}`}
                  >
                    {currentUser.is_active ? "Actif" : "Inactif"}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Fournisseur</div>
                  <div className="text-2xl font-bold">
                    {currentUser.provider || "EMAIL"}
                  </div>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-sm font-medium">Créé le</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(currentUser.createdAt).toLocaleDateString(
                      "fr-FR",
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">
                    Dernière mise à jour
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(currentUser.updatedAt).toLocaleDateString(
                      "fr-FR",
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
