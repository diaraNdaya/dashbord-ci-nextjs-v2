"use client";

import { PageHeader } from "@/components/molecules/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PercentIcon } from "@hugeicons/core-free-icons";
import { motion } from "motion/react";

export default function CommissionsTemplate() {
  return (
    <motion.div
      className="flex flex-1 flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="@container/main flex flex-1 flex-col gap-4">
        {/* Header */}
        <PageHeader
          icon={PercentIcon}
          title="Gestion des commissions"
          description="Gérer les commissions des vendeurs et partenaires"
          emoji="💰"
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Commissions totales</CardTitle>
                <CardDescription>Ce mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12 450 000 FCFA</div>
                <p className="text-sm text-muted-foreground">
                  +8% vs mois dernier
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
                <CardTitle>Vendeurs actifs</CardTitle>
                <CardDescription>Avec commissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">47</div>
                <p className="text-sm text-muted-foreground">Sur 52 vendeurs</p>
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
                <CardTitle>Taux moyen</CardTitle>
                <CardDescription>Commission moyenne</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8.5%</div>
                <p className="text-sm text-muted-foreground">
                  Selon les catégories
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
                <CardTitle>À payer</CardTitle>
                <CardDescription>Commissions en attente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">3 240 000 FCFA</div>
                <p className="text-sm text-muted-foreground">15 vendeurs</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Commission management */}
        <div className="grid gap-4 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Top vendeurs</CardTitle>
                <CardDescription>Classement par commissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-32 items-center justify-center text-muted-foreground">
                  Classement des vendeurs à implémenter
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Paiements récents</CardTitle>
                <CardDescription>Dernières commissions versées</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-32 items-center justify-center text-muted-foreground">
                  Historique des paiements à implémenter
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
