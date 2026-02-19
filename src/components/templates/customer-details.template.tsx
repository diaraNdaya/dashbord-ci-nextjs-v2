"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { getOneCustomerQueryOptions } from "@/services/queries/user.queries";
import {
  ArrowLeft01Icon,
  Copy01Icon,
  CreditCardIcon,
  Shield01Icon,
  User02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface CustomerDetailsTemplateProps {
  customerId: string;
}

function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString("fr-FR");
}

function yesNo(v?: boolean) {
  return v ? "Oui" : "Non";
}

function CopyButton({ value, label }: { value?: string; label: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            disabled={!value}
            onClick={async () => {
              if (!value) return;
              await navigator.clipboard.writeText(value);
            }}
            aria-label={`Copier ${label}`}
          >
            <HugeiconsIcon icon={Copy01Icon} className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Copier {label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function FieldRow({
  label,
  value,
  right,
}: {
  label: string;
  value?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-sm font-medium leading-5">{value ?? "—"}</p>
      </div>
      {right}
    </div>
  );
}

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  // look "badge pill" + violet for positive states
  return (
    <Badge
      variant="secondary"
      className={[
        "rounded-full",
        ok
          ? "bg-violet-600 text-white hover:bg-violet-600"
          : "bg-muted text-muted-foreground",
      ].join(" ")}
    >
      {label}
    </Badge>
  );
}

export default function CustomerDetailsTemplate({
  customerId,
}: CustomerDetailsTemplateProps) {
  const router = useRouter();
  const {
    data: customer,
    isLoading,
    error,
  } = useQuery(getOneCustomerQueryOptions(customerId));

  const user = customer?.user;

  const badges = useMemo(() => {
    if (!customer || !user) return [];
    return [
      {
        ok: !!customer.isVerified,
        label: customer.isVerified ? "Vérifié" : "Non vérifié",
      },
      {
        ok: !!user.is_active,
        label: user.is_active ? "Actif" : "Inactif",
      },
      {
        ok: !user.isBlocked,
        label: user.isBlocked ? "Non bloqué" : "Bloqué",
      },
      { ok: true, label: user.provider ?? "EMAIL" },
    ];
  }, [customer, user]);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-6 w-56" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-56 w-full lg:col-span-2" />
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full lg:col-span-3" />
        </div>
      </div>
    );
  }

  if (error || !customer || !user) {
    return (
      <div className="p-6 text-muted-foreground">
        Impossible de charger les détails du client.
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-1 flex-col gap-6 p-6"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Header compact (sans espace vide) */}
      <Card className="border-violet-500/10">
        <CardContent className="p-4 md:p-5">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
            {/* LEFT */}
            <div className="min-w-0 space-y-2">
              {/* back + title */}
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => router.back()}
                        aria-label="Retour"
                      >
                        <HugeiconsIcon
                          icon={ArrowLeft01Icon}
                          className="h-4 w-4"
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Retour</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <HugeiconsIcon icon={User02Icon} className="h-5 w-5 shrink-0" />
                <h1 className="truncate text-xl font-bold md:text-2xl">
                  {customer.name}
                </h1>
              </div>

              {/* badges */}
              <div className="flex flex-wrap gap-2">
                {badges.map((b, i) => (
                  <StatusPill key={i} ok={b.ok} label={b.label} />
                ))}

                <Badge
                  variant="outline"
                  className="rounded-full border-violet-500/30 text-violet-300"
                >
                  {user.role?.name ?? "CUSTOMER"}
                </Badge>
              </div>
            </div>

            {/* RIGHT (actions) */}
            <div className="flex w-full flex-col gap-2 md:w-[280px]">
              <Button
                variant="outline"
                className="w-full border-violet-500/40 text-violet-200 hover:bg-violet-500/10"
              >
                <HugeiconsIcon icon={Shield01Icon} className="mr-2 h-4 w-4" />
                {user.isBlocked ? "Débloquer" : "Bloquer"}
              </Button>

              <Button
                variant="outline"
                className="w-full border-violet-500/40 text-violet-200 hover:bg-violet-500/10"
              >
                {user.is_active ? "Désactiver" : "Activer"}
              </Button>

              <Button className="w-full bg-violet-600 text-white hover:bg-violet-700">
                Marquer vérifié
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contenu (sans Tabs) */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-violet-100">
            <CardHeader>
              <CardTitle>Identité & contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldRow label="Nom complet" value={customer.name} />
              <Separator />
              <FieldRow
                label="Email"
                value={user.email || "—"}
                right={<CopyButton value={user.email} label="email" />}
              />
              <FieldRow
                label="Téléphone"
                value={user.phone_number || "—"}
                right={
                  <CopyButton value={user.phone_number} label="téléphone" />
                }
              />
              <Separator />
              <FieldRow
                label="Username"
                value={user.username || "—"}
                right={<CopyButton value={user.username} label="username" />}
              />
              <FieldRow
                label="Date de naissance"
                value={formatDate(user.dateOfBirth)}
              />
            </CardContent>
          </Card>

          <Card className="border-violet-100">
            <CardHeader>
              <CardTitle>Adresse & localisation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldRow label="Pays" value={user.country || "—"} />
              <FieldRow label="Ville" value={user.city || "—"} />
              <FieldRow label="Adresse" value={customer.address || "—"} />
            </CardContent>
          </Card>
        </div>

        {/* Side */}
        <div className="space-y-6">
          <Card className="border-violet-100">
            <CardHeader>
              <CardTitle>Statut</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldRow label="Vérifié" value={yesNo(customer.isVerified)} />
              <FieldRow label="Actif" value={yesNo(user.is_active)} />
              <FieldRow label="Bloqué" value={yesNo(user.isBlocked)} />
              <FieldRow label="Supprimé" value={yesNo(user.isDeleted)} />
            </CardContent>
          </Card>

          <Card className="border-violet-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Stripe</CardTitle>
              <HugeiconsIcon
                icon={CreditCardIcon}
                className="h-5 w-5 text-violet-700"
              />
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldRow
                label="Customer ID"
                value={user.clientStripeId || "—"}
                right={
                  <CopyButton
                    value={user.clientStripeId}
                    label="Stripe customer id"
                  />
                }
              />
              <p className="text-xs text-muted-foreground">
                Tu peux ajouter un bouton “Ouvrir dans Stripe” si tu as un lien
                dashboard.
              </p>
            </CardContent>
          </Card>

          <Card className="border-violet-100">
            <CardHeader>
              <CardTitle>Métadonnées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldRow
                label="Customer ID"
                value={customer.id}
                right={<CopyButton value={customer.id} label="customer id" />}
              />
              <FieldRow
                label="User ID"
                value={customer.user_id}
                right={<CopyButton value={customer.user_id} label="user id" />}
              />
              <Separator />
              <FieldRow
                label="Créé (customer)"
                value={formatDate(customer.createdAt)}
              />
              <FieldRow
                label="MAJ (customer)"
                value={formatDate(customer.updatedAt)}
              />
              <Separator />
              <FieldRow
                label="Créé (user)"
                value={formatDate(user.createdAt)}
              />
              <FieldRow label="MAJ (user)" value={formatDate(user.updatedAt)} />
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
