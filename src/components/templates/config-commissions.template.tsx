"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Add01Icon,
  ArrowUp01Icon,
  Edit01Icon,
  PercentIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";

export default function ConfigCommissionsTemplate() {
  const commissionRules = [
    {
      id: 1,
      name: "Commission Standard",
      rate: 5.0,
      category: "Général",
      status: "active",
    },
    {
      id: 2,
      name: "Commission Électronique",
      rate: 3.5,
      category: "Électronique",
      status: "active",
    },
    {
      id: 3,
      name: "Commission Premium",
      rate: 7.5,
      category: "Luxe",
      status: "active",
    },
    {
      id: 4,
      name: "Commission Promotionnelle",
      rate: 2.0,
      category: "Promotion",
      status: "inactive",
    },
  ];

  const totalCommissions = 1250.75;
  const averageRate =
    commissionRules.reduce((sum, rule) => sum + rule.rate, 0) /
    commissionRules.length;

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
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <HugeiconsIcon
                icon={PercentIcon}
                strokeWidth={2}
                className="h-5 w-5 text-primary"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Commission Configuration</h1>
              <p className="text-muted-foreground">Manage commission rates</p>
            </div>
          </div>
          <Button>
            <HugeiconsIcon
              icon={Add01Icon}
              strokeWidth={2}
              className="h-4 w-4 mr-2"
            />
            New Rule
          </Button>
        </motion.div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Règles actives</CardDescription>
                <CardTitle className="text-2xl">
                  {
                    commissionRules.filter((rule) => rule.status === "active")
                      .length
                  }
                </CardTitle>
              </CardHeader>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Taux moyen</CardDescription>
                <CardTitle className="text-2xl">
                  {averageRate.toFixed(1)}%
                </CardTitle>
              </CardHeader>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Commissions ce mois</CardDescription>
                <CardTitle className="text-2xl">${totalCommissions}</CardTitle>
              </CardHeader>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Évolution</CardDescription>
                <CardTitle className="text-2xl text-green-600 flex items-center gap-1">
                  <HugeiconsIcon
                    icon={ArrowUp01Icon}
                    strokeWidth={2}
                    className="h-4 w-4"
                  />
                  +12%
                </CardTitle>
              </CardHeader>
            </Card>
          </motion.div>
        </div>

        {/* Commission rules list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Règles de commission</CardTitle>
              <CardDescription>
                Configure commission rates by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commissionRules.map((rule, index) => (
                  <motion.div
                    key={rule.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
                        <HugeiconsIcon
                          icon={PercentIcon}
                          strokeWidth={2}
                          className="h-4 w-4 text-primary"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{rule.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Catégorie: {rule.category}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">
                        {rule.rate}%
                      </Badge>
                      <Badge
                        variant={
                          rule.status === "active" ? "default" : "secondary"
                        }
                      >
                        {rule.status === "active" ? "Actif" : "Inactif"}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <HugeiconsIcon
                          icon={Edit01Icon}
                          strokeWidth={2}
                          className="h-4 w-4"
                        />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
