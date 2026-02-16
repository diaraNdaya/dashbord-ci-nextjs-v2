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
  Alert01Icon,
  Clock01Icon,
  Edit01Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";

export default function ReclamationsTemplate() {
  const reclamations = [
    {
      id: 1,
      title: "Produit défectueux",
      customer: "Jean Dupont",
      date: "2024-01-15",
      status: "pending",
      priority: "high",
    },
    {
      id: 2,
      title: "Livraison en retard",
      customer: "Marie Martin",
      date: "2024-01-14",
      status: "in_progress",
      priority: "medium",
    },
    {
      id: 3,
      title: "Remboursement demandé",
      customer: "Pierre Durand",
      date: "2024-01-12",
      status: "resolved",
      priority: "low",
    },
    {
      id: 4,
      title: "Service client insatisfaisant",
      customer: "Sophie Bernard",
      date: "2024-01-10",
      status: "pending",
      priority: "high",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="destructive">En attente</Badge>;
      case "in_progress":
        return <Badge variant="default">En cours</Badge>;
      case "resolved":
        return <Badge variant="secondary">Résolu</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Haute</Badge>;
      case "medium":
        return <Badge variant="default">Moyenne</Badge>;
      case "low":
        return <Badge variant="secondary">Basse</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

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
                icon={Alert01Icon}
                strokeWidth={2}
                className="h-5 w-5 text-primary"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Réclamations</h1>
              <p className="text-muted-foreground">Manage customer claims</p>
            </div>
          </div>
          <Button>
            <HugeiconsIcon
              icon={PlusSignIcon}
              strokeWidth={2}
              className="h-4 w-4 mr-2"
            />
            New Claim
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
                <CardDescription>Total réclamations</CardDescription>
                <CardTitle className="text-2xl">
                  {reclamations.length}
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
                <CardDescription>En attente</CardDescription>
                <CardTitle className="text-2xl text-red-600">
                  {
                    reclamations.filter((rec) => rec.status === "pending")
                      .length
                  }
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
                <CardDescription>En cours</CardDescription>
                <CardTitle className="text-2xl text-blue-600">
                  {
                    reclamations.filter((rec) => rec.status === "in_progress")
                      .length
                  }
                </CardTitle>
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
                <CardDescription>Résolues</CardDescription>
                <CardTitle className="text-2xl text-green-600">
                  {
                    reclamations.filter((rec) => rec.status === "resolved")
                      .length
                  }
                </CardTitle>
              </CardHeader>
            </Card>
          </motion.div>
        </div>

        {/* Reclamations list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Claims List</CardTitle>
              <CardDescription>Manage your customer claims</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reclamations.map((reclamation, index) => (
                  <motion.div
                    key={reclamation.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
                        <HugeiconsIcon
                          icon={Alert01Icon}
                          strokeWidth={2}
                          className="h-4 w-4 text-primary"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{reclamation.title}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <span>{reclamation.customer}</span>
                          <span>•</span>
                          <HugeiconsIcon
                            icon={Clock01Icon}
                            strokeWidth={2}
                            className="h-3 w-3"
                          />
                          <span>{reclamation.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPriorityBadge(reclamation.priority)}
                      {getStatusBadge(reclamation.status)}
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
