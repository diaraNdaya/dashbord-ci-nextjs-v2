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
  Delete01Icon,
  Edit01Icon,
  Folder01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";

export default function CategoriesTemplate() {
  const categories = [
    {
      id: 1,
      name: "Electronics",
      description: "Electronic devices",
      products: 45,
    },
    {
      id: 2,
      name: "Clothing",
      description: "Fashion and accessories",
      products: 32,
    },
    {
      id: 3,
      name: "Home",
      description: "Home articles",
      products: 28,
    },
    { id: 4, name: "Sports", description: "Sports equipment", products: 19 },
  ];

  return (
    <motion.div
      className="flex flex-1 flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="@container/main flex flex-1 flex-col gap-4 ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <HugeiconsIcon
                icon={Folder01Icon}
                className="h-5 w-5 text-primary"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Catégories</h1>
              <p className="text-muted-foreground">
                Gérer les catégories de produits
              </p>
            </div>
          </div>
          <Button>
            <HugeiconsIcon icon={Add01Icon} className="h-4 w-4 mr-2" />
            Nouvelle catégorie
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
                <CardDescription>Total catégories</CardDescription>
                <CardTitle className="text-2xl">{categories.length}</CardTitle>
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
                <CardDescription>Total produits</CardDescription>
                <CardTitle className="text-2xl">
                  {categories.reduce((sum, cat) => sum + cat.products, 0)}
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
                <CardDescription>Moyenne par catégorie</CardDescription>
                <CardTitle className="text-2xl">
                  {Math.round(
                    categories.reduce((sum, cat) => sum + cat.products, 0) /
                      categories.length,
                  )}
                </CardTitle>
              </CardHeader>
            </Card>
          </motion.div>
        </div>

        {/* Categories list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Liste des catégories</CardTitle>
              <CardDescription>
                Gérer vos catégories de produits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
                        <HugeiconsIcon
                          icon={Folder01Icon}
                          className="h-4 w-4 text-primary"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {category.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {category.products} produits
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <HugeiconsIcon icon={Edit01Icon} className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <HugeiconsIcon
                          icon={Delete01Icon}
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
