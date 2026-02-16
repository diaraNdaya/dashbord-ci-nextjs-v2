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
  Delete01Icon,
  Edit01Icon,
  FolderOpenIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";

export default function SubcategoriesTemplate() {
  const subcategories = [
    { id: 1, name: "Smartphones", category: "Électronique", products: 25 },
    { id: 2, name: "Ordinateurs", category: "Électronique", products: 20 },
    { id: 3, name: "T-shirts", category: "Vêtements", products: 18 },
    { id: 4, name: "Pantalons", category: "Vêtements", products: 14 },
    { id: 5, name: "Meubles", category: "Maison", products: 16 },
    { id: 6, name: "Décoration", category: "Maison", products: 12 },
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
                icon={FolderOpenIcon}
                strokeWidth={2}
                className="h-5 w-5 text-primary"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Sous-catégories</h1>
              <p className="text-muted-foreground">
                Manage product subcategories
              </p>
            </div>
          </div>
          <Button>
            <HugeiconsIcon
              icon={PlusSignIcon}
              strokeWidth={2}
              className="h-4 w-4 mr-2"
            />
            New Subcategory
          </Button>
        </motion.div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total sous-catégories</CardDescription>
                <CardTitle className="text-2xl">
                  {subcategories.length}
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
                <CardDescription>Produits total</CardDescription>
                <CardTitle className="text-2xl">
                  {subcategories.reduce((sum, sub) => sum + sub.products, 0)}
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
                <CardDescription>Catégories parentes</CardDescription>
                <CardTitle className="text-2xl">
                  {new Set(subcategories.map((sub) => sub.category)).size}
                </CardTitle>
              </CardHeader>
            </Card>
          </motion.div>
        </div>

        {/* Subcategories list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Subcategory List</CardTitle>
              <CardDescription>
                Manage your product subcategories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subcategories.map((subcategory, index) => (
                  <motion.div
                    key={subcategory.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
                        <HugeiconsIcon
                          icon={FolderOpenIcon}
                          strokeWidth={2}
                          className="h-4 w-4 text-primary"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{subcategory.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Catégorie: {subcategory.category}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {subcategory.products} produits
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <HugeiconsIcon
                          icon={Edit01Icon}
                          strokeWidth={2}
                          className="h-4 w-4"
                        />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <HugeiconsIcon
                          icon={Delete01Icon}
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
