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
  Image01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";

export default function BannersTemplate() {
  const banners = [
    {
      id: 1,
      title: "Summer Promotion",
      description: "Main banner for summer sales",
      position: "homepage_hero",
      status: "active",
      startDate: "2024-06-01",
      endDate: "2024-08-31",
    },
    {
      id: 2,
      title: "New Products",
      description: "Highlighting the latest new products",
      position: "homepage_secondary",
      status: "active",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
    },
    {
      id: 3,
      title: "Black Friday",
      description: "Banner for Black Friday event",
      position: "category_top",
      status: "scheduled",
      startDate: "2024-11-25",
      endDate: "2024-11-30",
    },
    {
      id: 4,
      title: "Free Shipping",
      description: "Information about free shipping",
      position: "cart_page",
      status: "inactive",
      startDate: "2024-01-01",
      endDate: "2024-06-30",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "scheduled":
        return <Badge variant="outline">Programmée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPositionLabel = (position: string) => {
    switch (position) {
      case "homepage_hero":
        return "Homepage - Hero";
      case "homepage_secondary":
        return "Homepage - Secondary";
      case "category_top":
        return "Category - Top";
      case "cart_page":
        return "Cart Page";
      default:
        return position;
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
                icon={Image01Icon}
                strokeWidth={2}
                className="h-5 w-5 text-primary"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Bannières</h1>
              <p className="text-muted-foreground">
                Gérer les bannières publicitaires
              </p>
            </div>
          </div>
          <Button>
            <HugeiconsIcon
              icon={Add01Icon}
              strokeWidth={2}
              className="h-4 w-4 mr-2"
            />
            Nouvelle bannière
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
                <CardDescription>Total bannières</CardDescription>
                <CardTitle className="text-2xl">{banners.length}</CardTitle>
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
                <CardDescription>Actives</CardDescription>
                <CardTitle className="text-2xl text-green-600">
                  {
                    banners.filter((banner) => banner.status === "active")
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
                <CardDescription>Programmées</CardDescription>
                <CardTitle className="text-2xl text-blue-600">
                  {
                    banners.filter((banner) => banner.status === "scheduled")
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
                <CardDescription>Inactives</CardDescription>
                <CardTitle className="text-2xl text-gray-600">
                  {
                    banners.filter((banner) => banner.status === "inactive")
                      .length
                  }
                </CardTitle>
              </CardHeader>
            </Card>
          </motion.div>
        </div>

        {/* Banners list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Liste des bannières</CardTitle>
              <CardDescription>
                Gérer vos bannières publicitaires
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {banners.map((banner, index) => (
                  <motion.div
                    key={banner.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
                        <HugeiconsIcon
                          icon={Image01Icon}
                          strokeWidth={2}
                          className="h-4 w-4 text-primary"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{banner.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {banner.description} •{" "}
                          {getPositionLabel(banner.position)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Du {banner.startDate} au {banner.endDate}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(banner.status)}
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
