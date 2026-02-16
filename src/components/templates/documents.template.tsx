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
  Download01Icon,
  Edit01Icon,
  File01Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";

export default function DocumentsTemplate() {
  const documents = [
    {
      id: 1,
      name: "Terms and Conditions",
      type: "PDF",
      size: "2.4 MB",
      lastModified: "2024-01-15",
      status: "published",
    },
    {
      id: 2,
      name: "Privacy Policy",
      type: "PDF",
      size: "1.8 MB",
      lastModified: "2024-01-10",
      status: "published",
    },
    {
      id: 3,
      name: "User Guide",
      type: "PDF",
      size: "5.2 MB",
      lastModified: "2024-01-08",
      status: "draft",
    },
    {
      id: 4,
      name: "FAQ",
      type: "HTML",
      size: "0.5 MB",
      lastModified: "2024-01-05",
      status: "published",
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <HugeiconsIcon
                icon={File01Icon}
                strokeWidth={2}
                className="h-5 w-5 text-primary"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Documents</h1>
              <p className="text-muted-foreground">
                Gérer les documents système
              </p>
            </div>
          </div>
          <Button>
            <HugeiconsIcon
              icon={PlusSignIcon}
              strokeWidth={2}
              className="h-4 w-4 mr-2"
            />
            Nouveau document
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
                <CardDescription>Total documents</CardDescription>
                <CardTitle className="text-2xl">{documents.length}</CardTitle>
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
                <CardDescription>Publiés</CardDescription>
                <CardTitle className="text-2xl">
                  {documents.filter((doc) => doc.status === "published").length}
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
                <CardDescription>Brouillons</CardDescription>
                <CardTitle className="text-2xl">
                  {documents.filter((doc) => doc.status === "draft").length}
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
                <CardDescription>Taille totale</CardDescription>
                <CardTitle className="text-2xl">9.9 MB</CardTitle>
              </CardHeader>
            </Card>
          </motion.div>
        </div>

        {/* Documents list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Liste des documents</CardTitle>
              <CardDescription>Gérer vos documents système</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map((document, index) => (
                  <motion.div
                    key={document.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
                        <HugeiconsIcon
                          icon={File01Icon}
                          strokeWidth={2}
                          className="h-4 w-4 text-primary"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{document.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {document.type} • {document.size} • Modifié le{" "}
                          {document.lastModified}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          document.status === "published"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {document.status === "published"
                          ? "Publié"
                          : "Brouillon"}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <HugeiconsIcon
                          icon={Download01Icon}
                          strokeWidth={2}
                          className="h-4 w-4"
                        />
                      </Button>
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
