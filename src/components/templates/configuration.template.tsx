"use client";

import { PageHeader } from "@/components/molecules/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Settings01Icon } from "@hugeicons/core-free-icons";
import { motion } from "motion/react";
import Link from "next/link";

export default function ConfigurationTemplate() {
  const configSections = [
    {
      title: "Catégories",
      description: "Gérer les catégories de produits",
      href: "/configuration/categories",
      icon: "📂",
    },
    {
      title: "Sous-catégories",
      description: "Gérer les sous-catégories",
      href: "/configuration/subcategories",
      icon: "📁",
    },
    {
      title: "Commissions",
      description: "Configurer les taux de commission",
      href: "/configuration/commissions",
      icon: "💰",
    },
    {
      title: "Documents",
      description: "Gérer les documents système",
      href: "/configuration/documents",
      icon: "📄",
    },
    {
      title: "Réclamations",
      description: "Configurer la gestion des réclamations",
      href: "/configuration/reclamations",
      icon: "⚠️",
    },
    {
      title: "Bannières",
      description: "Gérer les bannières publicitaires",
      href: "/configuration/banners",
      icon: "🎨",
    },
    {
      title: "Notifications Push",
      description: "Envoyer des notifications push aux utilisateurs",
      href: "/configuration/push",
      icon: "🔔",
    },
  ];

  return (
    <motion.div
      className="flex flex-1 flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="@container/main flex flex-1 flex-col gap-4 ">
        {/* Header */}
        <PageHeader
          icon={Settings01Icon}
          title="Configuration"
          description="Configurez les paramètres de votre application"
        />

        {/* Configuration sections */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {configSections.map((section, index) => (
            <motion.div
              key={section.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
            >
              <Link href={section.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{section.icon}</span>
                      <div>
                        <CardTitle className="text-lg">
                          {section.title}
                        </CardTitle>
                        <CardDescription>{section.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* System info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Informations système</CardTitle>
              <CardDescription>État général de l'application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="text-sm font-medium">Version</div>
                  <div className="text-2xl font-bold">v2.1.0</div>
                </div>
                <div>
                  <div className="text-sm font-medium">
                    Dernière mise à jour
                  </div>
                  <div className="text-2xl font-bold">Aujourd'hui</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Statut</div>
                  <div className="text-2xl font-bold text-green-600">Actif</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
