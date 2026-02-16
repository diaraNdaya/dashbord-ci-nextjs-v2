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
import { Switch } from "@/components/ui/switch";
import {
  Database01Icon,
  Notification01Icon,
  PaintBoardIcon,
  SecurityIcon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";

export default function SettingsTemplate() {
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
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <HugeiconsIcon
              icon={Settings01Icon}
              strokeWidth={2}
              className="h-5 w-5 text-primary"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Paramètres</h1>
            <p className="text-muted-foreground">
              Configurez vos préférences et paramètres
            </p>
          </div>
        </motion.div>

        <div className="grid gap-6">
          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Notification01Icon}
                    strokeWidth={2}
                    className="h-5 w-5 text-primary"
                  />
                  <CardTitle>Notifications</CardTitle>
                </div>
                <CardDescription>
                  Gérer vos préférences de notification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications par email</Label>
                    <div className="text-sm text-muted-foreground">
                      Recevoir des notifications par email
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications push</Label>
                    <div className="text-sm text-muted-foreground">
                      Recevoir des notifications push dans le navigateur
                    </div>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications de commandes</Label>
                    <div className="text-sm text-muted-foreground">
                      Être notifié des nouvelles commandes
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={PaintBoardIcon}
                    strokeWidth={2}
                    className="h-5 w-5 text-primary"
                  />
                  <CardTitle>Apparence</CardTitle>
                </div>
                <CardDescription>
                  Personnaliser l'apparence de l'interface
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Langue</Label>
                  <select className="w-full p-2 border rounded-md bg-background">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Fuseau horaire</Label>
                  <select className="w-full p-2 border rounded-md bg-background">
                    <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
                    <option value="UTC">UTC (GMT+0)</option>
                    <option value="America/New_York">
                      America/New_York (GMT-5)
                    </option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mode compact</Label>
                    <div className="text-sm text-muted-foreground">
                      Affichage plus dense des éléments
                    </div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={SecurityIcon}
                    strokeWidth={2}
                    className="h-5 w-5 text-primary"
                  />
                  <CardTitle>Sécurité</CardTitle>
                </div>
                <CardDescription>
                  Paramètres de sécurité et confidentialité
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Mot de passe actuel</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="Entrez votre mot de passe actuel"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nouveau mot de passe</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Entrez votre nouveau mot de passe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">
                    Confirmer le mot de passe
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirmez votre nouveau mot de passe"
                  />
                </div>
                <Button className="w-full">Changer le mot de passe</Button>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Authentification à deux facteurs</Label>
                    <div className="text-sm text-muted-foreground">
                      Sécurité renforcée pour votre compte
                    </div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Data & Privacy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Database01Icon}
                    strokeWidth={2}
                    className="h-5 w-5 text-primary"
                  />
                  <CardTitle>Données et confidentialité</CardTitle>
                </div>
                <CardDescription>
                  Gérer vos données personnelles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Collecte de données analytiques</Label>
                    <div className="text-sm text-muted-foreground">
                      Autoriser la collecte de données pour améliorer le service
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Exporter mes données
                  </Button>
                  <Button variant="destructive" className="flex-1">
                    Supprimer mon compte
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
