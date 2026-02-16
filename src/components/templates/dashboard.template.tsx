"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";

export default function DashBoardTemplate() {
  return (
    <motion.div
      className="flex flex-1 flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="@container/main flex flex-1 flex-col gap-2">
        {/* Test des icônes */}

        <div className="flex flex-col gap-4">
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="@container/card">
                <CardHeader>
                  <CardDescription>Chiffre d'affaires total</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    1 250 000 FCFA
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">
                      <HugeiconsIcon icon={ArrowUp01Icon} />
                      +12,5%
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    En hausse ce mois{" "}
                    <HugeiconsIcon icon={ArrowUp01Icon} className="size-4" />
                  </div>
                  <div className="text-muted-foreground">
                    Visiteurs des 6 derniers mois
                  </div>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="@container/card">
                <CardHeader>
                  <CardDescription>Nouveaux clients</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    1 234
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">
                      <HugeiconsIcon icon={ArrowDown01Icon} />
                      -20%
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    En baisse de 20% cette période{" "}
                    <HugeiconsIcon icon={ArrowDown01Icon} className="size-4" />
                  </div>
                  <div className="text-muted-foreground">
                    L'acquisition nécessite une attention
                  </div>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="@container/card">
                <CardHeader>
                  <CardDescription>Comptes actifs</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    45 678
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">
                      <HugeiconsIcon icon={ArrowUp01Icon} />
                      +12,5%
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    Forte rétention des utilisateurs{" "}
                    <HugeiconsIcon icon={ArrowUp01Icon} className="size-4" />
                  </div>
                  <div className="text-muted-foreground">
                    L'engagement dépasse les objectifs
                  </div>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="@container/card">
                <CardHeader>
                  <CardDescription>Taux de croissance</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    4,5%
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">
                      <HugeiconsIcon icon={ArrowUp01Icon} />
                      +4,5%
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    Augmentation constante des performances{" "}
                    <HugeiconsIcon icon={ArrowUp01Icon} className="size-4" />
                  </div>
                  <div className="text-muted-foreground">
                    Répond aux projections de croissance
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
