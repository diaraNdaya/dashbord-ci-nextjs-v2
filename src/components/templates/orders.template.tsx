"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingCart01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";

export default function OrdersTemplate() {
  return (
    <motion.div
      className="flex flex-1 flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="@container/main flex flex-1 flex-col gap-4 ">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <HugeiconsIcon
              icon={ShoppingCart01Icon}
              className="h-5 w-5 text-primary"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Gestion des commandes</h1>
            <p className="text-muted-foreground">
              Suivre et gérer toutes les commandes
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Commandes totales</CardTitle>
                <CardDescription>Ce mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1,847</div>
                <p className="text-sm text-muted-foreground">
                  +15% vs mois dernier
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>En attente</CardTitle>
                <CardDescription>À traiter</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">23</div>
                <Badge variant="outline" className="text-orange-600">
                  Urgent
                </Badge>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Expédiées</CardTitle>
                <CardDescription>Cette semaine</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">456</div>
                <p className="text-sm text-muted-foreground">
                  98% dans les délais
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Chiffre d'affaires</CardTitle>
                <CardDescription>Ce mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">89 234 000 FCFA</div>
                <p className="text-sm text-muted-foreground">+8% vs objectif</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Orders list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Commandes récentes</CardTitle>
              <CardDescription>Dernières commandes passées</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-32 items-center justify-center text-muted-foreground">
                Liste des commandes à implémenter
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
