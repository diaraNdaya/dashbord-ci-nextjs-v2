"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  CreditCardIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";

export default function FinancesTemplate() {
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
              icon={CreditCardIcon}
              className="h-5 w-5 text-primary"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Gestion financière</h1>
            <p className="text-muted-foreground">
              Suivez vos revenus, dépenses et bénéfices
            </p>
          </div>
        </motion.div>

        {/* Financial stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Revenus totaux</CardTitle>
                <CardDescription>Ce mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">125 430 000 FCFA</div>
                <div className="flex items-center gap-1 text-sm">
                  <HugeiconsIcon
                    icon={ArrowUp01Icon}
                    className="h-4 w-4 text-green-600"
                  />
                  <span className="text-green-600">+12.5%</span>
                </div>
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
                <CardTitle>Dépenses</CardTitle>
                <CardDescription>Ce mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">45 230 000 FCFA</div>
                <div className="flex items-center gap-1 text-sm">
                  <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    className="h-4 w-4 text-red-600"
                  />
                  <span className="text-red-600">+3.2%</span>
                </div>
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
                <CardTitle>Bénéfice net</CardTitle>
                <CardDescription>Ce mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">80 200 000 FCFA</div>
                <Badge variant="outline" className="text-green-600">
                  <HugeiconsIcon
                    icon={ArrowUp01Icon}
                    className="h-3 w-3 mr-1"
                  />
                  Excellent
                </Badge>
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
                <CardTitle>Marge bénéficiaire</CardTitle>
                <CardDescription>Pourcentage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">64%</div>
                <p className="text-sm text-muted-foreground">
                  +2% vs mois dernier
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Financial breakdown */}
        <div className="grid gap-4 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Répartition des revenus</CardTitle>
                <CardDescription>Par source de revenus</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-32 items-center justify-center text-muted-foreground">
                  Graphique des revenus à implémenter
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
                <CardTitle>Évolution mensuelle</CardTitle>
                <CardDescription>Tendance sur 12 mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-32 items-center justify-center text-muted-foreground">
                  Graphique d'évolution à implémenter
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
